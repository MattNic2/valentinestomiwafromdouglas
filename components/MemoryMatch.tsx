"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

const emojis = ["❤️", "💖", "💕", "💓", "💗", "💘", "💝", "💞"]
const allEmojis = [...emojis, ...emojis]

export default function MemoryMatch({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [cards, setCards] = useState(shuffleCards())
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    onScoreChange(score)
  }, [score, onScoreChange])

  function shuffleCards() {
    return allEmojis.sort(() => Math.random() - 0.5).map((emoji, index) => ({ id: index, emoji }))
  }

  function handleCardClick(id: number) {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setScore(score + 1)
      }
      setTimeout(() => setFlipped([]), 1000)
    }
  }

  function resetGame() {
    setCards(shuffleCards())
    setFlipped([])
    setMatched([])
    setScore(0)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ id, emoji }) => (
          <button
            key={id}
            onClick={() => handleCardClick(id)}
            className={`w-16 h-16 text-3xl flex items-center justify-center rounded-lg transition-all duration-300 ${
              flipped.includes(id) || matched.includes(id) ? "bg-rose-300" : "bg-rose-500"
            }`}
            disabled={flipped.includes(id) || matched.includes(id)}
          >
            {flipped.includes(id) || matched.includes(id) ? emoji : <Heart className="text-white" />}
          </button>
        ))}
      </div>
      <p className="text-lg font-semibold text-rose-600">Score: {score}</p>
      {matched.length === allEmojis.length && (
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Congratulations!</p>
          <button
            onClick={resetGame}
            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-sm text-rose-500">Match all pairs for a special surprise!</p>
    </div>
  )
}

