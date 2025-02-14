"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Zap,
  Ghost,
  Timer,
  Crown,
  ArrowUp,
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Star,
} from "lucide-react";
import { CelebrationEffect } from "./Confetti";
import {
  GameState,
  INITIAL_STATE,
  generateFood,
  generatePowerUp,
  generateObstacles,
  checkCollision,
  Position,
  PowerUp,
} from "./snake/SnakeEngine";
import { ParticleEffect } from "./snake/ParticleEffect";

const GRID_SIZE = 30;
const CELL_SIZE = 20;
const TARGET_SCORE = 15;
const BASE_SPEED = 120; // Faster base speed

// Add power-up icons mapping
const POWER_UP_ICONS = {
  speed: <Zap className="w-full h-full text-yellow-400 animate-pulse" />,
  slow: <Timer className="w-full h-full text-blue-400 animate-pulse" />,
  ghost: <Ghost className="w-full h-full text-purple-400 animate-pulse" />,
  points2x: <Star className="w-full h-full text-green-400 animate-pulse" />,
};

// Add status effects component
function StatusEffects({ activeEffects }: { activeEffects: PowerUp[] }) {
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      {activeEffects.map((effect, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full bg-white/80 p-1 animate-bounce"
          title={`Active ${effect.type} power-up`}
        >
          {POWER_UP_ICONS[effect.type]}
        </div>
      ))}
    </div>
  );
}

export default function SnakeGame({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE });
  const [gameOver, setGameOver] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; color: string }[]
  >([]);

  useEffect(() => {
    if (isPlaying) {
      const preventScroll = (e: KeyboardEvent) => {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
            e.key
          )
        ) {
          e.preventDefault();
        }
      };
      window.addEventListener("keydown", preventScroll);
      return () => window.removeEventListener("keydown", preventScroll);
    }
  }, [isPlaying]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setGameState((prev) => {
      const head = { ...prev.snake[0] };
      head.x += prev.direction.x;
      head.y += prev.direction.y;

      const collisionResult = checkCollision(
        head,
        prev.snake,
        prev.obstacles,
        GRID_SIZE,
        prev.isGhost
      );

      if (collisionResult === true) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [head, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;
      let newPowerUps = [...prev.powerUps];
      let newLevel = prev.level;

      // Food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        setParticles((prev) => [
          ...prev,
          {
            x: head.x * CELL_SIZE + CELL_SIZE / 2,
            y: head.y * CELL_SIZE + CELL_SIZE / 2,
            color: "#f43f5e",
          },
        ]);
        const points = prev.activeEffects.some((e) => e.type === "points2x")
          ? 2
          : 1;
        newScore += points;
        newFood = generateFood(newSnake, prev.obstacles, GRID_SIZE);

        if (newScore % 3 === 0) {
          // Power-up every 3 points
          newPowerUps.push(
            generatePowerUp(newSnake, newFood, prev.obstacles, GRID_SIZE)
          );
        }

        if (newScore >= TARGET_SCORE) {
          onScoreChange(newScore);
        }
      } else {
        newSnake.pop();
      }

      // PowerUp collision check and processing
      const powerUpIndex = prev.powerUps.findIndex(
        (p) => p.position.x === head.x && p.position.y === head.y
      );

      if (powerUpIndex !== -1) {
        const powerUp = prev.powerUps[powerUpIndex];
        setParticles((prev) => [
          ...prev,
          {
            x: head.x * CELL_SIZE + CELL_SIZE / 2,
            y: head.y * CELL_SIZE + CELL_SIZE / 2,
            color:
              powerUp.type === "speed"
                ? "#facc15"
                : powerUp.type === "ghost"
                ? "#a855f7"
                : powerUp.type === "points2x"
                ? "#22c55e"
                : "#3b82f6",
          },
        ]);
        newPowerUps = newPowerUps.filter((_, i) => i !== powerUpIndex);
        prev.activeEffects.push({
          ...powerUp,
          expiresAt: Date.now() + powerUp.duration,
        });
      }

      // Clean expired effects
      const newActiveEffects = prev.activeEffects.filter(
        (effect) => effect.expiresAt && effect.expiresAt > Date.now()
      );

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        powerUps: newPowerUps,
        activeEffects: newActiveEffects,
        level: Math.floor(newScore / 5) + 1,
        obstacles:
          newLevel !== prev.level
            ? generateObstacles(newLevel, GRID_SIZE)
            : prev.obstacles,
      };
    });
  }, [gameOver, onScoreChange]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          setGameState((prev) => ({ ...prev, direction: { x: 0, y: -1 } }));
          break;
        case "ArrowDown":
          setGameState((prev) => ({ ...prev, direction: { x: 0, y: 1 } }));
          break;
        case "ArrowLeft":
          setGameState((prev) => ({ ...prev, direction: { x: -1, y: 0 } }));
          break;
        case "ArrowRight":
          setGameState((prev) => ({ ...prev, direction: { x: 1, y: 0 } }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    const currentSpeed = gameState.activeEffects.some((e) => e.type === "speed")
      ? BASE_SPEED * 0.6
      : gameState.activeEffects.some((e) => e.type === "slow")
      ? BASE_SPEED * 1.5
      : BASE_SPEED;

    const gameLoop = setInterval(moveSnake, currentSpeed);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [moveSnake, isPlaying, gameOver, gameState.activeEffects]);

  const getRandomFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const startGame = () => {
    setGameState({ ...INITIAL_STATE });
    setGameOver(false);
    setShowCelebration(false);
    setParticles([]);
    setIsPlaying(true);
    onScoreChange(0);
  };

  const resetGame = () => {
    setGameState({ ...INITIAL_STATE });
    setGameOver(false);
    setShowCelebration(false);
    setParticles([]);
    setIsPlaying(false);
    onScoreChange(0);
  };

  return (
    <div className="flex flex-col items-center">
      {!isPlaying ? (
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-rose-600 mb-4">
            Ready to Play?
          </h3>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div
            className="relative bg-gradient-to-br from-pink-100 to-rose-200 border-4 border-rose-300 rounded-lg overflow-hidden shadow-lg"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
            }}
          >
            {/* Render obstacles */}
            {gameState.obstacles.map((obstacle, index) => (
              <div
                key={`obstacle-${index}`}
                className={`absolute ${
                  obstacle.type === "wall"
                    ? "bg-gray-700"
                    : "bg-purple-500 animate-pulse"
                } rounded-md`}
                style={{
                  left: obstacle.position.x * CELL_SIZE,
                  top: obstacle.position.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            ))}

            {/* Render power-ups */}
            {gameState.powerUps.map((powerUp, index) => (
              <div
                key={`powerup-${index}`}
                className="absolute rounded-full bg-white/80 p-1"
                style={{
                  left: powerUp.position.x * CELL_SIZE,
                  top: powerUp.position.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              >
                {POWER_UP_ICONS[powerUp.type]}
              </div>
            ))}

            {/* Existing snake and food rendering */}
            {gameState.snake.map((segment, index) => (
              <div
                key={`snake-${index}`}
                className={`absolute rounded-full transition-all duration-100 ${
                  index === 0
                    ? "bg-rose-600"
                    : gameState.isGhost
                    ? "bg-purple-400/70"
                    : "bg-rose-500"
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  boxShadow:
                    index === 0 ? "0 0 10px rgba(225, 29, 72, 0.5)" : "none",
                }}
              />
            ))}

            <Heart
              className="absolute text-red-500 animate-pulse"
              style={{
                left: gameState.food.x * CELL_SIZE,
                top: gameState.food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />

            <StatusEffects activeEffects={gameState.activeEffects} />

            {particles.map((particle, i) => (
              <ParticleEffect
                key={`particle-${i}`}
                x={particle.x}
                y={particle.y}
                color={particle.color}
              />
            ))}
          </div>

          {/* Game info */}
          <div className="mt-4 flex items-center gap-4">
            <p className="text-lg font-semibold text-rose-600">
              Score: {gameState.score}
            </p>
            <p className="text-lg font-semibold text-purple-600">
              Level: {gameState.level}
            </p>
          </div>

          {/* Mobile Controls - Updated with touch-action */}
          <div className="md:hidden mt-6 grid grid-cols-3 gap-2 touch-none">
            <div className="col-start-2">
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    direction: { x: 0, y: -1 },
                  }))
                }
                className="w-12 h-12 bg-rose-500 text-white rounded-lg flex items-center justify-center active:bg-rose-600 touch-none"
                aria-label="Up"
              >
                <ArrowUp size={24} />
              </button>
            </div>
            <div className="col-span-3 flex justify-center gap-2">
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    direction: { x: -1, y: 0 },
                  }))
                }
                className="w-12 h-12 bg-rose-500 text-white rounded-lg flex items-center justify-center active:bg-rose-600 touch-none"
                aria-label="Left"
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    direction: { x: 0, y: 1 },
                  }))
                }
                className="w-12 h-12 bg-rose-500 text-white rounded-lg flex items-center justify-center active:bg-rose-600 touch-none"
                aria-label="Down"
              >
                <ArrowDown size={24} />
              </button>
              <button
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    direction: { x: 1, y: 0 },
                  }))
                }
                className="w-12 h-12 bg-rose-500 text-white rounded-lg flex items-center justify-center active:bg-rose-600 touch-none"
                aria-label="Right"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          {/* Game instructions for mobile */}
          <p className="md:hidden text-xs text-rose-400 mt-4 text-center">
            Use the buttons above to control the snake
          </p>
          {/* Game instructions for desktop */}
          <p className="hidden md:block text-xs text-rose-400 mt-4 text-center">
            Use arrow keys to control the snake
          </p>

          {gameOver && (
            <div className="mt-4">
              <p className="text-xl font-bold text-rose-600 mb-2">Game Over!</p>
              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Start
                </button>
              </div>
            </div>
          )}
          {gameState.score < TARGET_SCORE && (
            <p className="text-sm text-rose-500 mt-2">
              Reach a score of {TARGET_SCORE} for a special surprise!
            </p>
          )}
        </>
      )}
    </div>
  );
}
