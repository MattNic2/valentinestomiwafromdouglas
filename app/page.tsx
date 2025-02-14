"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import SnakeGame from "../components/SnakeGame";
import LoveQuiz from "../components/LoveQuiz";
import MemoryMatch from "../components/MemoryMatch";
import WordScramble from "../components/WordScramble";
import LoveLetter from "../components/LoveLetter";
import BubblePop from "../components/BubblePop";
import LetterDisplay from "../components/LetterDisplay";
import LoveWordle from "../components/LoveWordle";

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
    bubble: false,
    wordle: false,
  });

  const handleScoreChange = (
    game: keyof typeof showLoveLetters,
    score: number
  ) => {
    if (
      (game === "snake" && score >= 15) ||
      (game === "quiz" && score >= 10) ||
      (game === "memory" && score >= 16) ||
      (game === "scramble" && score >= 10) ||
      (game === "bubble" && score >= 20) ||
      (game === "wordle" && score >= 6)
    ) {
      setShowLoveLetters((prev) => ({ ...prev, [game]: true }));
    }
  };

  // Add scroll animation logic
  const setupScrollAnimation = (element: Element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);
  };

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach(setupScrollAnimation);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 p-8 pb-48">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section with Fade-in */}
        <section className="mb-12 opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
          <header className="text-center mb-12">
            <div className="relative flex flex-col items-center text-center">
              {/* Floating Hearts Background */}
              <h1 className="text-4xl md:text-6xl font-bold text-rose-600 mb-4 font-serif drop-shadow-md">
                Douglas &amp; Miwa&apos;s Love Games
              </h1>
            </div>

            <p className="text-lg text-rose-500 animate-fade-in-up">
              Happy Valentine&apos;s Day, Miwa! ❤️ You mean the world to me.
            </p>

            <p className="mt-2 text-sm text-rose-400 italic animate-fade-in-up-delay">
              &quot;In all the world, there is no heart for me like yours. In
              all the world, there is no love for you like mine.&quot;
            </p>
          </header>
        </section>

        {/* Photo Gallery with Slide-in */}
        <section className="mb-12 scroll-animate slide-in-right">
          <PhotoGallery />
        </section>

        {/* Game Sections with Staggered Fade-in */}
        <section className="space-y-12">
          <div className="scroll-animate fade-in-up">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                Because you love slither.io so much
              </h2>
              <SnakeGame
                onScoreChange={(score) => handleScoreChange("snake", score)}
              />
            </div>
          </div>

          <div className="scroll-animate fade-in-up delay-200">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                Because you love love quizzes so much
              </h2>
              <LoveQuiz
                onScoreChange={(score) => handleScoreChange("quiz", score)}
              />
            </div>
          </div>

          <div className="scroll-animate fade-in-up delay-400">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                This is payback for all the cognitive tests you made me take
              </h2>
              <MemoryMatch
                onScoreChange={(score) => handleScoreChange("memory", score)}
              />
            </div>
          </div>

          <div className="scroll-animate fade-in-up delay-600">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                I will always love the word scramble games we play
              </h2>
              <h3 className="text-lg text-rose-500 mb-4">
                Hint: The words are all valentine&apos;s day themed
              </h3>
              <WordScramble
                onScoreChange={(score) => handleScoreChange("scramble", score)}
              />
            </div>
          </div>

          <div className="scroll-animate fade-in-up delay-800">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                You make my heart pop
              </h2>
              <BubblePop
                onScoreChange={(score) => handleScoreChange("bubble", score)}
              />
            </div>
          </div>

          <div className="scroll-animate fade-in-up delay-1000">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-600 mb-4">
                Love Wordle
              </h2>
              <h3 className="text-lg text-rose-500 mb-4">
                Guess the 5-letter love-themed word!
              </h3>
              <LoveWordle
                onScoreChange={(score) => handleScoreChange("wordle", score)}
              />
            </div>
          </div>
        </section>

        <LetterDisplay unlockedGames={showLoveLetters} />

        <footer className="text-center text-pink-700 mt-8 scroll-animate fade-in-up">
          <p>Created with love by Douglas for Miwa</p>
        </footer>
      </div>
    </main>
  );
}
