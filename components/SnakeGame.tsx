"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from "lucide-react"

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    if (gameOver) return

    const newSnake = [...snake]
    const head = { ...newSnake[0] }
    head.x += direction.x
    head.y += direction.y

    // Check for collisions
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true)
      return
    }

    newSnake.unshift(head)

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      const newScore = score + 1
      setScore(newScore)
      onScoreChange(newScore)
      setFood(getRandomFood())
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food, gameOver, score, onScoreChange])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    const gameLoop = setInterval(moveSnake, 150)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      clearInterval(gameLoop)
    }
  }, [moveSnake])

  const getRandomFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(getRandomFood())
    setGameOver(false)
    setScore(0)
    onScoreChange(0)
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative bg-gradient-to-br from-pink-100 to-rose-200 border-4 border-rose-300 rounded-lg overflow-hidden shadow-lg"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${index === 0 ? "bg-rose-600" : "bg-rose-500"}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxShadow: index === 0 ? "0 0 10px rgba(225, 29, 72, 0.5)" : "none",
            }}
          />
        ))}
        <Heart
          className="absolute text-red-500 animate-pulse"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      </div>
      <p className="text-lg font-semibold text-rose-600 mt-4">Score: {score}</p>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold text-rose-600 mb-2">Game Over!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      {score < 10 && <p className="text-sm text-rose-500 mt-2">Reach a score of 10 for a special surprise!</p>}
    </div>
  )
}

