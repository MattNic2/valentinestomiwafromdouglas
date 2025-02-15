import { useState, useEffect } from "react";
import {
  Heart,
  Brain,
  BookOpen,
  Type,
  Sparkles,
  Lock,
  X,
  Move,
} from "lucide-react";

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

interface Position {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface LetterDisplayProps {
  unlockedGames: Record<GameType, boolean>;
  onLetterSelect: (game: GameType) => void;
}

export default function LetterDisplay({
  unlockedGames,
  onLetterSelect,
}: LetterDisplayProps) {
  const [hoveredGame, setHoveredGame] = useState<GameType | null>(null);

  // New state for position and movement
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2)
    );
    setDragDistance((prev) => prev + distance);

    setPosition((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleLetterClick = (game: GameType, isUnlocked: boolean) => {
    if (isUnlocked) {
      onLetterSelect(game);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey) {
      // Scale with Ctrl + Wheel
      setPosition((prev) => ({
        ...prev,
        scale: Math.max(0.5, Math.min(2, prev.scale - e.deltaY * 0.001)),
      }));
    } else if (e.shiftKey) {
      // Rotate with Shift + Wheel
      setPosition((prev) => ({
        ...prev,
        rotation: prev.rotation + (e.deltaY > 0 ? 5 : -5),
      }));
    }
  };

  return (
    <div
      className="fixed bottom-4 left-0 right-0 z-10 cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale}) rotate(${position.rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onWheel={handleWheel}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-rose-600">
              Love Letters Collection
            </h3>
            <div className="flex items-center gap-2">
              <Move className="w-5 h-5 text-rose-400" />
              <div className="text-sm text-rose-400">
                {Object.values(unlockedGames).filter(Boolean).length} / 6
                Unlocked
              </div>
            </div>
          </div>

          <div className="flex justify-around gap-6">
            {(Object.entries(gameIcons) as [GameType, GameIcon][]).map(
              ([game, { icon: Icon, label, requiredScore }]) => (
                <div key={game} className="relative group">
                  <button
                    onClick={() => handleLetterClick(game, unlockedGames[game])}
                    onMouseEnter={() => setHoveredGame(game)}
                    onMouseLeave={() => setHoveredGame(null)}
                    className={`
                      relative w-20 h-20 rounded-xl
                      transition-all duration-300 transform
                      ${unlockedGames[game] ? "hover:scale-110" : "opacity-90"}
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
  );
}
