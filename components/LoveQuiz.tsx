"use client";

import { useState, useEffect } from "react";
import { Shuffle } from "lucide-react";

interface Question {
  q: string;
  a: string;
  choices: string[];
}

const questions: Question[] = [
  {
    q: "Where was the last place Douglas gave you a kiss?",
    a: "LAX",
    choices: ["SFO", "LAX", "Oakland Airport", "San Jose Airport"],
  },
  {
    q: "Where did we have our first date?",
    a: "Crepevine",
    choices: ["Cheesecake Factory", "Crepevine", "Olive Garden", "Sweet Maple"],
  },
  {
    q: "What's not Douglas's favorite food?",
    a: "Pizza",
    choices: ["Pizza", "Sushi", "Noodles", "Korean BBQ"],
  },
  {
    q: "What's Miwa's dream vacation destination together?",
    a: "Japan",
    choices: ["Korea", "Japan", "Hawaii", "Europe"],
  },
  {
    q: "Where did Miwa realize she fell in love with Douglas?",
    a: "Santa Cruz",
    choices: ["San Francisco", "Berkeley", "Santa Cruz", "Palo Alto"],
  },
  {
    q: "Does Douglas love Miwa more than anyone he's ever loved before (romantically)?",
    a: "Yes",
    choices: ["Yes", "No", "Maybe", "Not Sure"],
  },
  {
    q: "What grade did Douglas meet Miwa?",
    a: "Junior",
    choices: ["Freshman", "Sophomore", "Junior", "Senior"],
  },
  {
    q: "What is our anniversary?",
    a: "august 1st",
    choices: ["july 31st", "august 1st", "august 2nd", "july 30th"],
  },
  {
    q: "Where did Douglas take Miwa to their first outdoor adventure?",
    a: "Muir Woods",
    choices: ["Golden Gate Park", "Muir Woods", "Land's End", "Mt. Tam"],
  },
  {
    q: "What is Douglas's favorite ice cream?",
    a: "Dippon Dots",
    choices: ["Dippon Dots", "Soft Serve", "Popsickel", "Bingsu"],
  },
  {
    q: "What is our favorite vacation together (even though we weren't alone)?",
    a: "Hawaii",
    choices: ["Disneyland", "Hawaii", "San Diego", "Sacramento"],
  },
];

const ANSWER_DELAY = 750; // Longer delay to show feedback

export default function LoveQuiz({
  onScoreChange,
}: {
  onScoreChange: (score: number) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Initialize shuffled questions
  useEffect(() => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);

    setTimeout(() => {
      if (
        answer.toLowerCase() ===
        shuffledQuestions[currentQuestion].a.toLowerCase()
      ) {
        setScore(score + 1);
      }

      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, ANSWER_DELAY);
  };

  const resetGame = () => {
    setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameOver(false);
  };

  if (shuffledQuestions.length === 0) return null;

  return (
    <div className="space-y-4">
      {!gameOver ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-rose-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <p className="text-sm text-rose-500">Score: {score}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-rose-100 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <p
            className="text-lg font-semibold mb-6 animate-in slide-in-from-right duration-300"
            key={currentQuestion} // Force animation on question change
          >
            {shuffledQuestions[currentQuestion].q}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {shuffledQuestions[currentQuestion].choices.map((choice, index) => (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={selectedAnswer !== null}
                className={`
                  p-4 rounded-lg text-left transition-all
                  animate-in slide-in-from-right duration-300
                  border-2
                  ${
                    selectedAnswer === choice
                      ? selectedAnswer.toLowerCase() ===
                        shuffledQuestions[currentQuestion].a.toLowerCase()
                        ? "bg-green-100 text-green-700 border-green-300 ring-2 ring-green-500 ring-offset-2"
                        : "bg-red-100 text-red-700 border-red-300 ring-2 ring-red-500 ring-offset-2"
                      : "bg-rose-50 hover:bg-rose-100 text-rose-700 border-transparent hover:border-rose-300"
                  }
                  ${selectedAnswer !== null && "cursor-not-allowed"}
                  hover:shadow-md active:shadow-sm
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {choice}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center animate-in zoom-in-50 duration-300">
          <div className="mb-8">
            <p className="text-2xl font-bold mb-4">Quiz Complete! 🎉</p>
            <p className="text-lg mb-2">
              Your score: {score} / {questions.length}
            </p>
            <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-1000"
                style={{
                  width: `${(score / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg
              hover:bg-rose-600 transition-all transform hover:scale-105 active:scale-95"
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
