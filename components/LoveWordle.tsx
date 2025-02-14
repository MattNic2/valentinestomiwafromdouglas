import { useState, useEffect, useCallback } from "react";
import { Shuffle, Heart } from "lucide-react";

const LOVE_WORDS = [
  "HEART", // Classic love symbol
  "SWEET", // Term of endearment
  "LOVER", // Love-related
  "BLUSH", // Romantic reaction
  "CHARM", // Romantic quality
  "DREAM", // Romantic concept
  "SMILE", // Expression of love
  "TRUST", // Foundation of love
  "PEACE", // Feeling of love
  "HAPPY", // Emotion of love
  "SHARE", // Action of love
  "FAITH", // Aspect of love
];

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "←"],
];

export default function LoveWordle({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [usedLetters, setUsedLetters] = useState<
    Record<string, "correct" | "present" | "absent">
  >({});
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [totalWins, setTotalWins] = useState(0);

  useEffect(() => {
    const newWord = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)];
    setTargetWord(newWord);
  }, []);

  const ProgressDisplay = () => {
    const hearts = Array.from({ length: 6 }).map((_, i) => ({
      filled: i < totalWins,
      key: i,
    }));

    return (
      <div className="w-full mb-6 mt-2">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-rose-500 font-medium">
            Progress: {totalWins} / 6 wins
          </span>
          {totalWins >= 6 && (
            <span className="text-sm text-green-500 font-bold animate-bounce">
              Letter Unlocked! 💝
            </span>
          )}
        </div>

        <div className="flex justify-between mb-3 px-1 max-w-[300px] mx-auto">
          {hearts.map(({ filled, key }) => (
            <div
              key={key}
              className={`
                transition-all duration-500 transform
                ${filled ? "scale-110" : "scale-100"}
                ${filled ? "animate-heartBeat" : ""}
              `}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-300 ${
                  filled
                    ? "fill-rose-500 text-rose-500"
                    : "fill-gray-200 text-gray-300"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 
              transition-all duration-500 ease-out transform origin-left"
            style={{
              width: `${(totalWins / 6) * 100}%`,
              boxShadow: "0 0 8px rgba(244, 63, 94, 0.5)",
            }}
          />
        </div>

        {totalWins > 0 && (
          <div className="mt-2 text-xs text-rose-400 text-center animate-in fade-in slide-in-from-bottom-2">
            {totalWins === 6
              ? "All letters unlocked! 🎉"
              : `${6 - totalWins} more ${
                  6 - totalWins === 1 ? "win" : "wins"
                } to unlock the letter!`}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setMessage("Word must be 5 letters!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");
    setMessage("");

    // Update keyboard colors
    const newUsedLetters = { ...usedLetters };
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      if (letter === targetWord[i]) {
        newUsedLetters[letter] = "correct";
      } else if (
        targetWord.includes(letter) &&
        newUsedLetters[letter] !== "correct"
      ) {
        newUsedLetters[letter] = "present";
      } else if (!newUsedLetters[letter]) {
        newUsedLetters[letter] = "absent";
      }
    }
    setUsedLetters(newUsedLetters);

    // Check win/lose conditions
    if (currentGuess === targetWord) {
      setTimeout(() => {
        setGameOver(true);
        const newTotalWins = totalWins + 1;
        setTotalWins(newTotalWins);
        onScoreChange(newTotalWins);
        setMessage("Amazing! 💝");
      }, 1600);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setTimeout(() => {
        setGameOver(true);
        setMessage(`The word was ${targetWord} 💔`);
      }, 1600);
    }
  }, [
    currentGuess,
    guesses,
    targetWord,
    usedLetters,
    totalWins,
    onScoreChange,
  ]);

  const handleReset = () => {
    const newWord = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)];
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setUsedLetters({});
    setMessage("");
    setShake(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (
        currentGuess.length < WORD_LENGTH &&
        /^[A-Za-z]$/.test(e.key) &&
        guesses.length < MAX_ATTEMPTS
      ) {
        setCurrentGuess((prev) => (prev + e.key).toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver, guesses.length, handleSubmit]);

  const getCurrentRow = () => Math.min(guesses.length, MAX_ATTEMPTS - 1);

  const getSquareContent = (rowIndex: number, colIndex: number) => {
    // Current row shows current guess
    if (rowIndex === guesses.length) {
      return currentGuess[colIndex] || "";
    }
    // Past rows show submitted guesses
    if (rowIndex < guesses.length) {
      return guesses[rowIndex][colIndex];
    }
    // Future rows are empty
    return "";
  };

  const getSquareClassName = (rowIndex: number, colIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length;
    const isPastRow = rowIndex < guesses.length;
    const letter = getSquareContent(rowIndex, colIndex);
    const baseClasses = `
      w-14 h-14 border-2 flex items-center justify-center
      text-2xl font-bold uppercase
    `;

    // Empty future square
    if (!isPastRow && !isCurrentRow) {
      return `${baseClasses} border-gray-200 bg-white`;
    }

    // Current row square
    if (isCurrentRow) {
      return `${baseClasses} ${
        letter ? "border-gray-400 bg-white" : "border-gray-200 bg-white"
      }`;
    }

    // Past row square - apply color based on correctness
    const guess = guesses[rowIndex];
    const isRevealingRow = rowIndex === guesses.length - 1;

    let colorClasses = "";
    if (letter === targetWord[colIndex]) {
      colorClasses = "bg-green-500 text-white border-green-600";
    } else if (targetWord.includes(letter)) {
      colorClasses = "bg-yellow-500 text-white border-yellow-600";
    } else {
      colorClasses = "bg-gray-300 text-gray-700 border-gray-400";
    }

    return `${baseClasses} ${colorClasses} ${
      isRevealingRow ? `flip-${colIndex}` : ""
    }`;
  };

  const isLetterUsedBefore = (guess: string, index: number, letter: string) => {
    let countBefore = 0;
    for (let i = 0; i < index; i++) {
      if (guess[i] === letter) countBefore++;
    }
    const totalInTarget = targetWord.split(letter).length - 1;
    return countBefore >= totalInTarget;
  };

  const handleKeyboardClick = (key: string) => {
    if (gameOver || guesses.length >= MAX_ATTEMPTS) return;

    if (key === "ENTER") {
      handleSubmit();
    } else if (key === "←") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <ProgressDisplay />

      {message && (
        <div className="text-rose-500 font-medium animate-in fade-in slide-in-from-top-4">
          {message}
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-rows-6 gap-2 mb-4">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex gap-2 ${
              rowIndex === guesses.length && shake ? "animate-shake" : ""
            }`}
          >
            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={getSquareClassName(rowIndex, colIndex)}
              >
                {getSquareContent(rowIndex, colIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyboardClick(key)}
                disabled={gameOver || guesses.length >= MAX_ATTEMPTS}
                className={`
                  ${key.length > 1 ? "px-4" : "w-10"} 
                  h-14 text-sm font-semibold rounded
                  transition-all duration-200
                  ${
                    key.length > 1
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      : usedLetters[key] === "correct"
                      ? "bg-green-500 text-white"
                      : usedLetters[key] === "present"
                      ? "bg-yellow-500 text-white"
                      : usedLetters[key] === "absent"
                      ? "bg-gray-300 text-gray-700"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }
                `}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <button
          onClick={handleReset}
          className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-lg
            hover:bg-rose-600 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            Next Word
          </div>
        </button>
      )}
    </div>
  );
}
