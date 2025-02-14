"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Crown, Star } from "lucide-react";
import { CelebrationEffect } from "./Confetti";
import { ParticleEffect } from "./snake/ParticleEffect";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  isSpecial?: boolean;
  vx: number; // Horizontal velocity
  vy: number; // Vertical velocity
  wobble: number; // Wobble offset
  wobbleSpeed: number; // Wobble animation speed
  acceleration: number;
  turbulence: number;
}

const TARGET_SCORE = 20;
const SPAWN_INTERVAL = 1200; // Slightly faster to account for more bubbles
const SPECIAL_BUBBLE_CHANCE = 0.15; // Increased special chance
const WOBBLE_AMOUNT = 5; // Maximum wobble distance in pixels

// Adjust physics constants
const VERTICAL_SPEED_BASE = 2.0;
const HORIZONTAL_DRIFT_MAX = 0.02;
const HORIZONTAL_SPEED_MAX = 0.02; // Maximum horizontal speed
const WIND_EFFECT = 0.0005;
const BOUNCE_DAMPING = 0.3;

// Add motion constants
const SIZE_SPEED_FACTOR = 0.01; // Smaller bubbles move faster
const ACCELERATION = 0.005; // Gradual speed increase
const MAX_SPEED_MULTIPLIER = 1.1; // Maximum speed increase
const TURBULENCE = 0.002; // Random motion variation

// Add boundary physics constants
const BOUNDARY_MARGIN = 150; // Slightly reduced boundary margin
const EDGE_DECELERATION = 0.98; // More gradual deceleration
const MIN_SPEED = 0.01; // Reduced minimum speed

// Add emoji variety for bubbles
const BUBBLE_ICONS = {
  normal: [Heart, Crown, Star], // Will randomly choose one
  special: {
    type: "gradient",
    icons: ["💖", "💝", "💕", "💓", "💗", "💘", "💞", "💟"],
  },
};

const createBubble = (containerWidth: number): Bubble => {
  const size = Math.random() * 20 + 40;
  const baseSpeed = VERTICAL_SPEED_BASE + (60 - size) * SIZE_SPEED_FACTOR;

  return {
    id: Date.now() + Math.random(),
    x: Math.random() * (containerWidth - size),
    y: 500,
    size,
    speed: baseSpeed,
    isSpecial: Math.random() < SPECIAL_BUBBLE_CHANCE,
    vx: (Math.random() - 0.5) * HORIZONTAL_DRIFT_MAX * 0.5,
    vy: 0,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.01 + 0.005,
    acceleration: 0,
    turbulence: Math.random() * TURBULENCE,
  };
};

export default function BubblePop({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; color: string }[]
  >([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get container width using ref directly in physics calculations
  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth || 800; // Fallback width
  }, []);

  const updateBubblePhysics = useCallback(
    (bubble: Bubble, deltaTime: number) => {
      const containerWidth = getContainerWidth();
      const newWobble = bubble.wobble + bubble.wobbleSpeed * deltaTime;
      const wobbleX = Math.sin(newWobble) * WOBBLE_AMOUNT;

      // Update acceleration and speed
      const newAcceleration = Math.min(
        bubble.acceleration + ACCELERATION * deltaTime,
        MAX_SPEED_MULTIPLIER - 1
      );
      const speedMultiplier = 1 + newAcceleration;

      // Add turbulence to motion
      const turbulenceX =
        Math.sin(Date.now() * bubble.turbulence) * bubble.size * 0.02;
      const turbulenceY =
        Math.cos(Date.now() * bubble.turbulence) * bubble.size * 0.01;

      // Update horizontal velocity with wind and turbulence
      let newVx =
        bubble.vx +
        (Math.random() - 0.5) * WIND_EFFECT +
        turbulenceX * deltaTime;

      // Hard limit on horizontal speed before edge calculations
      newVx = Math.max(
        -HORIZONTAL_SPEED_MAX,
        Math.min(HORIZONTAL_SPEED_MAX, newVx)
      );

      // Calculate distance from edges
      const distanceFromLeft = bubble.x;
      const distanceFromRight = containerWidth - (bubble.x + bubble.size);

      // Apply edge deceleration with smoother transition
      if (distanceFromLeft < BOUNDARY_MARGIN) {
        const factor =
          Math.pow(distanceFromLeft / BOUNDARY_MARGIN, 2) * EDGE_DECELERATION;
        if (newVx < 0) {
          newVx *= factor;
          if (Math.abs(newVx) < MIN_SPEED) {
            newVx = MIN_SPEED * (1 - factor); // Smoother push away
          }
        }
      } else if (distanceFromRight < BOUNDARY_MARGIN) {
        const factor =
          Math.pow(distanceFromRight / BOUNDARY_MARGIN, 2) * EDGE_DECELERATION;
        if (newVx > 0) {
          newVx *= factor;
          if (Math.abs(newVx) < MIN_SPEED) {
            newVx = -MIN_SPEED * (1 - factor); // Smoother push away
          }
        }
      }

      // Final velocity clamping
      let clampedVx = Math.max(
        -HORIZONTAL_DRIFT_MAX,
        Math.min(HORIZONTAL_DRIFT_MAX, newVx)
      );

      // Calculate new position
      let newX = bubble.x + clampedVx * deltaTime + wobbleX;

      // Soft boundary enforcement
      const maxX = containerWidth - bubble.size;
      if (newX < 0) {
        newX = 0;
        clampedVx = MIN_SPEED * 0.5; // Gentler bounce
      } else if (newX > maxX) {
        newX = maxX;
        clampedVx = -MIN_SPEED * 0.5; // Gentler bounce
      }

      const newY =
        bubble.y - (bubble.speed * speedMultiplier + turbulenceY) * deltaTime;

      return {
        ...bubble,
        x: newX,
        y: newY,
        vx: clampedVx,
        wobble: newWobble,
        acceleration: newAcceleration,
      };
    },
    [getContainerWidth]
  );

  // Update game loop
  useEffect(() => {
    if (!gameActive) return;

    let lastTime = Date.now();
    const spawnInterval = setInterval(() => {
      setBubbles((prev) => [...prev, createBubble(getContainerWidth())]);
    }, SPAWN_INTERVAL);

    const moveInterval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      setBubbles((prev) =>
        prev
          .map((bubble) => updateBubblePhysics(bubble, deltaTime))
          .filter((bubble) => bubble.y + bubble.size > 0)
      );
    }, 16);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameActive, updateBubblePhysics, getContainerWidth]);

  const popBubble = useCallback(
    (bubble: Bubble, x: number, y: number) => {
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

      // Add particle effect
      setParticles((prev) => [
        ...prev,
        {
          x,
          y,
          color: bubble.isSpecial ? "#fcd34d" : "#ec4899",
        },
      ]);

      const points = bubble.isSpecial ? 2 : 1;
      const newScore = score + points;
      setScore(newScore);
      onScoreChange(newScore);

      if (newScore >= TARGET_SCORE && !showCelebration) {
        setShowCelebration(true);
      }
    },
    [score, onScoreChange, showCelebration]
  );

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setGameActive(true);
    setShowCelebration(false);
    setParticles([]);
  };

  return (
    <div className="flex flex-col items-center">
      {!gameActive ? (
        <button
          onClick={startGame}
          className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
        >
          Start Game
        </button>
      ) : (
        <div
          ref={containerRef}
          className="relative h-[500px] w-full overflow-hidden bg-gradient-to-b from-pink-50 to-rose-100 rounded-lg"
        >
          {/* Score Display */}
          <div className="absolute top-4 left-4 space-y-1">
            <div className="text-lg font-bold text-rose-600">
              Score: {score}
            </div>
            <div className="text-sm text-rose-500">Target: {TARGET_SCORE}</div>
          </div>

          {/* Progress indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="text-sm text-rose-500">
              Progress: {Math.floor((score / TARGET_SCORE) * 100)}%
            </div>
            <div className="w-20 h-2 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${(score / TARGET_SCORE) * 100}%` }}
              />
            </div>
          </div>

          {/* Bubbles */}
          {bubbles.map((bubble) => (
            <button
              key={bubble.id}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                popBubble(bubble, e.clientX - rect.left, e.clientY - rect.top);
              }}
              className={`absolute transition-transform hover:scale-105 
                ${
                  bubble.isSpecial
                    ? "bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 animate-pulse"
                    : "bg-rose-400 hover:bg-rose-500"
                }
                rounded-full shadow-lg`}
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                transform: `translateX(${
                  Math.sin(bubble.wobble) * WOBBLE_AMOUNT
                }px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {bubble.isSpecial ? (
                <div className="w-full h-full text-white animate-[spin_3s_linear_infinite] flex items-center justify-center text-2xl">
                  {
                    BUBBLE_ICONS.special.icons[
                      Math.floor(
                        Math.random() * BUBBLE_ICONS.special.icons.length
                      )
                    ]
                  }
                </div>
              ) : (
                <Heart className="w-full h-full text-white" />
              )}
            </button>
          ))}

          {/* Particles */}
          {particles.map((particle, i) => (
            <ParticleEffect
              key={`particle-${i}`}
              x={particle.x}
              y={particle.y}
              color={particle.color}
            />
          ))}

          {showCelebration && <CelebrationEffect />}
        </div>
      )}
    </div>
  );
}
