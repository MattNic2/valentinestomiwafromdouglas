import { useState, useEffect } from "react";
import { Heart, Brain, BookOpen, Type, Sparkles, Lock, X } from "lucide-react";
import LoveLetter from "./LoveLetter";
import CelebrationScreen from "./CelebrationScreen";

type GameType = "snake" | "quiz" | "memory" | "scramble" | "bubble" | "wordle";

interface GameIcon {
  icon: React.ElementType;
  requiredScore: number;
  label: string;
}

const gameIcons: Record<GameType, GameIcon> = {
  snake: { icon: Sparkles, requiredScore: 15, label: "Snake Game" },
  quiz: { icon: BookOpen, requiredScore: 6, label: "Love Quiz" },
  memory: { icon: Brain, requiredScore: 16, label: "Memory Match" },
  scramble: { icon: Type, requiredScore: 5, label: "Word Scramble" },
  bubble: { icon: Heart, requiredScore: 20, label: "Bubble Pop" },
  wordle: { icon: Type, requiredScore: 6, label: "Love Words" },
};

export default function LetterDisplay({
  unlockedGames,
}: {
  unlockedGames: Record<GameType, boolean>;
}) {
  const [selectedLetter, setSelectedLetter] = useState<GameType | null>(null);
  const [hoveredGame, setHoveredGame] = useState<GameType | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if all letters are unlocked
  useEffect(() => {
    const allUnlocked = Object.values(unlockedGames).every(Boolean);
    if (allUnlocked) {
      setShowCelebration(true);
    }
  }, [unlockedGames]);

  return (
    <>
      {/* Fixed footer bar */}
      <div
        className="sticky bottom-0 left-0 right-0 z-40 pb-4 pt-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgb(255 255 255) 60%, transparent)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-rose-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-rose-600">
                Love Letters Collection
              </h3>
              <div className="text-sm text-rose-400">
                {Object.values(unlockedGames).filter(Boolean).length} / 6
                Unlocked
              </div>
            </div>

            <div className="flex justify-around gap-6">
              {(Object.entries(gameIcons) as [GameType, GameIcon][]).map(
                ([game, { icon: Icon, label, requiredScore }]) => (
                  <div key={game} className="relative group">
                    <button
                      onClick={() =>
                        unlockedGames[game] && setSelectedLetter(game)
                      }
                      onMouseEnter={() => setHoveredGame(game)}
                      onMouseLeave={() => setHoveredGame(null)}
                      className={`
                        relative w-20 h-20 rounded-xl
                        transition-all duration-300 transform
                        ${
                          unlockedGames[game] ? "hover:scale-110" : "opacity-90"
                        }
                        ${
                          unlockedGames[game]
                            ? "bg-gradient-to-br from-rose-100 to-rose-200"
                            : "bg-gray-100"
                        }
                        shadow-md hover:shadow-xl
                      `}
                    >
                      {/* Envelope design */}
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div
                          className={`
                            absolute top-0 left-0 w-full h-1/2
                            transition-all duration-300 origin-bottom
                            ${hoveredGame === game ? "rotate-x-[-25deg]" : ""}
                          `}
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                            background: unlockedGames[game]
                              ? "rgb(254 205 211)" // rose-200
                              : "rgb(229 231 235)", // gray-200
                          }}
                        >
                          {/* Envelope texture */}
                          <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-white to-transparent" />
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon
                          className={`w-8 h-8 transition-transform duration-300
                            ${hoveredGame === game ? "scale-110" : ""}
                            ${
                              unlockedGames[game]
                                ? "text-rose-500"
                                : "text-gray-400"
                            }
                          `}
                        />
                      </div>

                      {/* Lock overlay */}
                      {!unlockedGames[game] && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-xl backdrop-blur-[1px]">
                          <Lock className="w-6 h-6 text-white mb-1" />
                          <span className="text-xs text-white/90">
                            Score {requiredScore}
                          </span>
                        </div>
                      )}
                    </button>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-rose-500 whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Letter Modal with improved transition */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200">
            {/* <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-rose-50 text-rose-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button> */}
            <LoveLetter game={selectedLetter} />
          </div>
        </div>
      )}

      {showCelebration && <CelebrationScreen />}
    </>
  );
}
