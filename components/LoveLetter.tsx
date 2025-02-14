"use client"

import { useState, useEffect } from "react"

const loveLetters = {
  snake: `My dearest Miwa,

Just as our love snake game grows longer with each heart collected, my love for you grows stronger with each passing day. You've captured my heart, and I'm forever grateful for the joy and warmth you bring to my life.

Love always,
Douglas`,

  quiz: `My intelligent Miwa,

Your knowledge of our relationship, and of me, amazes me as much as your beauty and kindness. Every moment with you is a treasure, and I love learning more about you each day. You're the answer to all my heart's questions.

Yours forever,
Douglas`,

  memory: `My sweet Miwa,

Like the pairs in our memory game, we're a perfect match. Every memory we create together is precious to me, and I look forward to making countless more. You're unforgettable, and my heart will always find its way to you.

With all my love,
Douglas`,

  scramble: `My clever Miwa,

Just as you unscramble these words of love, you've untangled the strings of my heart. Your quick wit and charming smile never fail to brighten my day. You're the missing piece that makes my life complete. I will always loving playing iphone letter matching games with you.

Eternally yours,
Douglas`,
}

export default function LoveLetter({ game }: { game: keyof typeof loveLetters }) {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    setShowMessage(true)
  }, [])

  return (
    <>
      {showMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]">
            <h2 className="text-3xl font-serif text-rose-600 mb-6 text-center">A Special Message for You</h2>
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">{loveLetters[game]}</pre>
            </div>
            <button
              onClick={() => setShowMessage(false)}
              className="mt-6 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 mx-auto block"
            >
              Close <span className="opacity-50">(Click anywhere)</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

