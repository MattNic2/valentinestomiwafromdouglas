"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SnakeGame from "../components/SnakeGame";
import LoveQuiz from "../components/LoveQuiz";
import MemoryMatch from "../components/MemoryMatch";
import WordScramble from "../components/WordScramble";
import LoveLetter from "../components/LoveLetter";

// Dynamically import PhotoGallery with ssr disabled
const PhotoGallery = dynamic(() => import("../components/PhotoGallery"), {
  ssr: false,
});

export default function Home() {
  const [showLoveLetters, setShowLoveLetters] = useState({
    snake: false,
    quiz: false,
    memory: false,
    scramble: false,
  });

  const handleScoreChange = (
    game: keyof typeof showLoveLetters,
    score: number
  ) => {
    if (
      (game === "snake" && score >= 10) ||
      (game === "quiz" && score >= 4) ||
      (game === "memory" && score >= 8) ||
      (game === "scramble" && score >= 5)
    ) {
      setShowLoveLetters((prev) => ({ ...prev, [game]: true }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <header className="text-center mb-12 opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
            {/* Add a heart background or decorative elements */}
            <div className="relative flex flex-col items-center text-center">
              {/* Subtle Animated Heart Decorations */}
              <div className="absolute inset-x-0 top-0 flex justify-center gap-4 opacity-40 animate-pulse">
                <span className="text-rose-400 text-5xl md:text-6xl">❤️</span>
                <span className="text-rose-300 text-4xl md:text-5xl">💖</span>
                <span className="text-rose-300 text-4xl md:text-5xl">💞</span>
                <span className="text-rose-300 text-4xl md:text-5xl">💘</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-rose-600 mb-4 font-serif drop-shadow-md">
                Douglas &amp; Miwa&apos;s Love Games
              </h1>
            </div>

            {/* Subtitle with Valentine's Day message */}
            <p className="text-lg text-rose-500">
              Happy Valentine&apos;s Day, Miwa! ❤️ You mean the world to me.
            </p>

            {/* Optional: Add a romantic quote */}
            <p className="mt-2 text-sm text-rose-400 italic">
              &quot;In all the world, there is no heart for me like yours. In
              all the world, there is no love for you like mine.&quot;
            </p>
          </header>
        </section>

        <section className="mb-12">
          <PhotoGallery />
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-rose-600 mb-4">
            Because you love slither.io so much
          </h2>
          <SnakeGame
            onScoreChange={(score) => handleScoreChange("snake", score)}
          />
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-rose-600 mb-4">
            Because you love love quizzes so much
          </h2>
          <LoveQuiz
            onScoreChange={(score) => handleScoreChange("quiz", score)}
          />
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-rose-600 mb-4">
            This is payback for all the cognitive tests you made me take
          </h2>
          <MemoryMatch
            onScoreChange={(score) => handleScoreChange("memory", score)}
          />
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-rose-600 mb-4">
            I will always love the word scramble games we play
          </h2>
          <WordScramble
            onScoreChange={(score) => handleScoreChange("scramble", score)}
          />
        </section>

        {showLoveLetters.snake && <LoveLetter game="snake" />}
        {showLoveLetters.quiz && <LoveLetter game="quiz" />}
        {showLoveLetters.memory && <LoveLetter game="memory" />}
        {showLoveLetters.scramble && <LoveLetter game="scramble" />}

        <footer className="text-center text-pink-700 mt-8">
          <p>Created with love by Douglas for Miwa</p>
        </footer>
      </div>
    </main>
  );
}
