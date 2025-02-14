"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Shuffle, Timer, Star, Heart } from "lucide-react";

const VALENTINE_WORDS = [
  { word: "LOVE", hint: "The strongest emotion" },
  { word: "HEART", hint: "Symbol of affection" },
  { word: "KISS", hint: "A romantic gesture" },
  { word: "HUG", hint: "A warm embrace" },
  { word: "SWEET", hint: "Like candy, like you" },
  { word: "ROMANCE", hint: "What's in the air" },
  { word: "CUPID", hint: "Love's archer" },
  { word: "ROSES", hint: "Red flowers of love" },
  { word: "ADORE", hint: "To love deeply" },
  { word: "CHERISH", hint: "To hold dear" },
  { word: "DARLING", hint: "Term of endearment" },
  { word: "FOREVER", hint: "How long I'll love you" },
];

const ROUND_TIME = 30; // seconds per word

export default function WordScramble({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [hint, setHint] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(3);
  const [lifeAnimation, setLifeAnimation] = useState(false);

  // Add a ref to track if the game is active
  const gameActiveRef = useRef(false);

  // Add a ref to track if the input is focused
  const inputRef = useRef<HTMLInputElement>(null);

  const endGame = useCallback(() => {
    setGameOver(true);
    gameActiveRef.current = false;
    onScoreChange(score);
  }, [score, onScoreChange]);

  const selectNewWord = useCallback(() => {
    if (!gameActiveRef.current) return;

    const availableWords = VALENTINE_WORDS.filter(
      (w) => !usedWords.has(w.word)
    );

    // Reset used words if we've used all words
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      const word =
        VALENTINE_WORDS[Math.floor(Math.random() * VALENTINE_WORDS.length)];
      setCurrentWord(word.word);
      setHint(word.hint);
      let scrambled = scrambleWord(word.word);
      while (scrambled === word.word) {
        scrambled = scrambleWord(word.word);
      }
      setScrambledWord(scrambled);
      setUsedWords(new Set([word.word]));
      return;
    }

    const { word, hint: newHint } =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(word);
    setHint(newHint);

    let scrambled = scrambleWord(word);
    while (scrambled === word) {
      scrambled = scrambleWord(word);
    }
    setScrambledWord(scrambled);

    setUsedWords((prev) => {
      const newSet = new Set(prev);
      newSet.add(word);
      return newSet;
    });
    setTimeLeft(ROUND_TIME);
    setShowHint(false);
    setUserGuess(""); // Clear user guess when new word is selected
  }, [usedWords]);

  // Update timer effect to only count down
  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setMessage("Time's up! The word was: " + currentWord);
            setLifeAnimation(true);
            LifeLostReset();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameOver, endGame, currentWord]);

  const LifeLostReset = () => {
    setTimeLeft(ROUND_TIME);
    selectNewWord();
    setMessage(""); // Clear the message
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
        return 0;
      }
      return newLives;
    });
    setTimeout(() => {
      setLifeAnimation(false);
    }, 3000);
  };

  // Update initial game setup
  useEffect(() => {
    gameActiveRef.current = true;
    setTimeLeft(ROUND_TIME);
    selectNewWord();
    return () => {
      gameActiveRef.current = false;
    };
  }, []);

  const scrambleWord = (word: string) => {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const handleSubmit = () => {
    if (!userGuess) {
      setMessage("Please enter a guess!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (userGuess.toUpperCase() === currentWord) {
      const newScore = score + 1;
      setScore(newScore);
      onScoreChange(newScore);
      setMessage("Correct! 💝");
      setTimeLeft(ROUND_TIME);
      setTimeout(() => {
        setMessage("");
        selectNewWord();
      }, 1000);
    } else {
      setMessage("Try again! 💭");
      setShake(true);
      setLifeAnimation(true);
      setTimeout(() => {
        setShake(false);
        setLifeAnimation(false);
        setMessage("");
      }, 500);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          endGame();
          return 0;
        }
        return newLives;
      });
      setUserGuess(""); // Clear incorrect guess
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setUsedWords(new Set());
    setUserGuess("");
    setMessage("");
    setTimeLeft(ROUND_TIME);
    setLives(3);
    onScoreChange(0);
    gameActiveRef.current = true;
    selectNewWord();
  };

  return (
    <div className="space-y-6">
      {!gameOver ? (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-rose-500">
              <Timer className="w-5 h-5" />
              <span className="font-mono text-xl">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-rose-500">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < lives
                        ? `fill-rose-500 ${
                            lifeAnimation ? "animate-bounce" : ""
                          }`
                        : "fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-rose-500">
                <Star className="w-5 h-5" />
                <span className="font-mono text-xl">{score}</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-xl">
            <div className="text-center space-y-4">
              <div
                className="text-4xl font-bold tracking-wider text-rose-600 
                animate-in slide-in-from-top duration-300"
              >
                {scrambledWord.split("").map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block mx-1 hover:scale-110 transition-transform"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              {showHint && (
                <p className="text-rose-500 italic animate-in fade-in slide-in-from-bottom-4">
                  Hint: {hint}
                </p>
              )}
            </div>
          </div>

          <div className={`space-y-4 ${shake ? "animate-shake" : ""}`}>
            <input
              ref={inputRef}
              type="text"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="w-full p-3 border-2 border-rose-200 rounded-lg text-center
                text-xl uppercase tracking-wider focus:border-rose-400 focus:ring-rose-400"
              placeholder="Your guess..."
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-rose-500 text-white py-2 rounded-lg
                  hover:bg-rose-600 transition-all transform hover:scale-105
                  active:scale-95"
              >
                Submit
              </button>
              <button
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg
                  hover:bg-rose-200 transition-all disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                Hint
              </button>
            </div>
          </div>

          {message && (
            <div className="text-center text-rose-500 font-medium animate-in fade-in slide-in-from-top-4">
              {message}
            </div>
          )}
        </>
      ) : (
        <div className="text-center animate-in zoom-in-50 duration-300">
          <p className="text-2xl font-bold mb-4">Game Over! 🎉</p>
          <p className="text-lg mb-6">Your score: {score}</p>
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3
              rounded-lg hover:bg-rose-600 transition-all transform hover:scale-105
              active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            Play Again
          </button>
        </div>
      )}

      <p className="text-sm text-rose-500 text-center">
        Score 10 or higher for a special surprise!
      </p>
    </div>
  );
}
