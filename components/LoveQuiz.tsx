"use client"

import { useState, useEffect } from "react"

const questions = [
  { q: "Where was the last place Douglas gave you a kiss.", a: "LAX" },
  { q: "Where did we have our first date?", a: "Crepevine" },
  { q: "What's Douglas's favorite food?", a: "Pizza" },
  { q: "What's Miwa's dream vacation destination together?", a: "Japan" },
  { q: "Where did Miwa realize she fell in love with Douglas?", a: "Santa Cruz" },
  { q: "Does Douglas love Miwa more than anyone he's loved before (romantically)?", a: "Yes" },

]

export default function LoveQuiz({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === questions[currentQuestion].a.toLowerCase()) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer("")
    } else {
      setGameOver(true)
    }
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setUserAnswer("")
    setGameOver(false)
  }

  return (
    <div className="space-y-4">
      {!gameOver ? (
        <>
          <p className="text-lg font-semibold">{questions[currentQuestion].q}</p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full p-2 border border-rose-300 rounded"
            placeholder="Your answer"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600 transition-colors"
          >
            Submit
          </button>
        </>
      ) : (
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Game Over!</p>
          <p className="text-lg">
            Your score: {score} / {questions.length}
          </p>
          <button
            onClick={resetGame}
            className="mt-4 bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-sm text-rose-500">Score 4 or higher for a special surprise!</p>
    </div>
  )
}

