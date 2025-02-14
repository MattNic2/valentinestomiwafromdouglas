"use client"

import { useState, useEffect } from "react"

const words = ["LOVE", "HEART", "KISS", "ROMANCE", "VALENTINE", "CUPID", "ADORE", "AFFECTION", "ACE", "JAPAN AND KOREA"]

export default function WordScramble({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledWord, setScrambledWord] = useState("")
  const [userGuess, setUserGuess] = useState("")
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    newWord()
  }, [])

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  function scrambleWord(word: string) {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  function newWord() {
    const word = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(word)
    setScrambledWord(scrambleWord(word))
    setUserGuess("")
  }

  function handleSubmit() {
    if (userGuess.toUpperCase() === currentWord) {
      setScore(score + 1)
      if (score + 1 >= 5) {
        setGameOver(true)
      } else {
        newWord()
      }
    } else {
      setGameOver(true)
    }
  }

  function resetGame() {
    setScore(0)
    setGameOver(false)
    newWord()
  }

  return (
    <div className="space-y-4">
      {!gameOver ? (
        <>
          <p className="text-lg font-semibold">Unscramble: {scrambledWord}</p>
          <input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="w-full p-2 border border-rose-300 rounded"
            placeholder="Your guess"
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
          <p className="text-lg">Your score: {score}</p>
          <button
            onClick={resetGame}
            className="mt-4 bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-sm text-rose-500">Score 5 or higher for a special surprise!</p>
    </div>
  )
}

