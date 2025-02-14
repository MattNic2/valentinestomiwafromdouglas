"use client";

import { useState, useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import { CelebrationEffect } from "./Confetti";

const emojis = [
  "❤️",
  "💖",
  "💕",
  "💓",
  "💗",
  "💘",
  "💝",
  "💞", // Original hearts
  "💟",
  "💌",
  "💑",
  "💏",
  "💋",
  "💔",
  "💜",
  "💙", // Additional similar emojis
];
const allEmojis = [...emojis, ...emojis];

export default function MemoryMatch({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  function shuffleCards() {
    return allEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
  }

  function handleCardClick(id: number) {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id))
      return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        const now = Date.now();
        const timeDiff = now - lastMatchTime;
        const newCombo = timeDiff < 2000 ? combo + 1 : 1;
        setCombo(newCombo);
        setLastMatchTime(now);

        const comboPoints = Math.min(newCombo, 3);
        const newScore = score + comboPoints;

        setMatched([...matched, first, second]);
        setScore(newScore);

        if (matched.length + 2 === allEmojis.length) {
          setShowCelebration(true);
        }
      } else {
        setCombo(0);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }

  function resetGame() {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setCombo(0);
    setShowCelebration(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ id, emoji }) => (
          <button
            key={id}
            onClick={() => handleCardClick(id)}
            className={`
              w-16 h-16 rounded-lg relative
              transition-all duration-300 transform
              ${matched.includes(id) && "animate-bounce"}
              ${
                flipped.includes(id) || matched.includes(id)
                  ? "bg-rose-300"
                  : "bg-rose-500 hover:bg-rose-400"
              }
            `}
            disabled={flipped.includes(id) || matched.includes(id)}
          >
            {!flipped.includes(id) && !matched.includes(id) && (
              <>
                <div
                  className="absolute top-0 left-0 w-full h-1/2 bg-rose-400
                    transition-transform duration-300 origin-bottom
                    group-hover:rotate-x-[-15deg]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </>
            )}

            <div
              className={`
                w-full h-full flex items-center justify-center
                transition-all duration-300
                ${
                  flipped.includes(id) || matched.includes(id)
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0"
                }
              `}
            >
              <span className="text-3xl animate-in zoom-in-50 duration-300">
                {emoji}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-rose-600">Score: {score}</p>
        {combo > 1 && (
          <div className="flex items-center gap-1 text-rose-500 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">{combo}x Combo!</span>
          </div>
        )}
      </div>

      {showCelebration && <CelebrationEffect />}

      {matched.length === allEmojis.length && (
        <div className="text-center">
          <p className="text-xl font-bold mb-4 text-rose-600 animate-bounce">
            Congratulations! 🎉
          </p>
          <button
            onClick={resetGame}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 
                     transition-all transform hover:scale-105 active:scale-95"
          >
            Play Again
          </button>
        </div>
      )}
      <p className="text-sm text-rose-500">
        Match all pairs for a special surprise!
      </p>
    </div>
  );
}
