"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

const COLORS = ["red", "pink", "purple", "blue", "green", "yellow", "orange", "indigo"]

type Card = {
  id: number
  color: string
  flipped: boolean
  matched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const shuffledColors = [...COLORS, ...COLORS].sort(() => Math.random() - 0.5)
    const newCards = shuffledColors.map((color, index) => ({
      id: index,
      color,
      flipped: false,
      matched: false,
    }))
    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
  }

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].matched) return

    const newCards = [...cards]
    newCards[id].flipped = true
    setCards(newCards)

    setFlippedCards([...flippedCards, id])

    if (flippedCards.length === 1) {
      setTimeout(checkMatch, 1000)
    }
  }

  const checkMatch = () => {
    const [first, second] = flippedCards
    if (cards[first].color === cards[second].color) {
      const newCards = [...cards]
      newCards[first].matched = true
      newCards[second].matched = true
      setCards(newCards)
      setMatchedPairs(matchedPairs + 1)
    } else {
      const newCards = [...cards]
      newCards[first].flipped = false
      newCards[second].flipped = false
      setCards(newCards)
    }
    setFlippedCards([])
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 ${
              card.flipped || card.matched ? `bg-${card.color}-500` : "bg-gray-300"
            }`}
            disabled={card.flipped || card.matched}
          >
            {(card.flipped || card.matched) && <Heart className={`w-8 h-8 text-${card.color}-100`} />}
          </button>
        ))}
      </div>
      <p className="text-lg font-semibold text-pink-700 mb-4">
        Matched Pairs: {matchedPairs} / {COLORS.length}
      </p>
      <button
        onClick={initializeGame}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        New Game
      </button>
    </div>
  )
}

