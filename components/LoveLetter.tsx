"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GameType =
  | "snake"
  | "quiz"
  | "memory"
  | "scramble"
  | "bubble"
  | "wordle"
  | "final";

interface LoveLetterProps {
  game: GameType;
  onLetterClose?: () => void;
}

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

  bubble: `My dearest Miwa,

You've popped my heart like a bubble. I'm so glad you're in my life. I love you. Thank you for being my girlfriend. 
Thank you for being my best friend. Thank you for being my confidant. Thank you for being my partner in crime. Thank you for being my everything.
I love you more than I love my own life. I love you more than I love my own family. I love you more than I love my own friends. I love you more than I love my own country.
I know you feel like you're competing with Popper for my love, but you're wrong. Popper is just a game. You are my life.
Love always,
Douglas`,

  wordle: `My dearest Miwa,

Sometimes when I look at you, I find myself at a loss for words. Your beauty is so captivating that even as someone who loves to write and express themselves, I struggle to find the right words to describe how stunning you are.

It's not just your outer beauty - though your smile lights up any room you're in, and your eyes hold a warmth that makes my heart skip a beat. It's also the beautiful soul that shines through in everything you do.

The way you scrunch your nose when you laugh, how your eyes sparkle when you're excited about something, the gentle way you care for others, and the passionate way you pursue your dreams - every little detail about you is breathtakingly beautiful.

You're like a masterpiece that I get to admire every day, and somehow you become even more beautiful as time goes by. Sometimes I catch myself just looking at you, trying to memorize every detail of your face, wondering how I got so lucky.

Even these words feel inadequate to express just how beautiful you are to me. You're not just beautiful - you're my definition of beauty itself.

Forever mesmerized by you,
Douglas 💝`,

  final: `My Dearest Miwa,

Congratulations on completing all the games and unlocking every love letter! This special message is just for you, my amazing girlfriend who went above and beyond to discover all the hidden treasures I created.

Your dedication, intelligence, and playful spirit never cease to amaze me. Just like you solved these puzzles, you've solved the puzzle of my heart - though that one was much easier, as it was yours from the moment we met.

This journey through the games is just like our relationship - full of fun, challenges, and sweet rewards. And just like these letters, my love for you is something you can always come back to.

Thank you for playing, for loving, and for being the extraordinary person you are. You make every day feel like a celebration.

With infinite love and admiration,
Douglas 💝`,
};

export default function LoveLetter({ game, onLetterClose }: LoveLetterProps) {
  const [showMessage, setShowMessage] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setShowMessage(false);
    // After animation completes, reset the letter state
    setTimeout(() => {
      setMounted(false);
      // Signal to parent to clear selectedLetter
      onLetterClose?.();
    }, 200);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {showMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[80]"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-serif text-rose-600 mb-6 text-center">
              A Special Message for You
            </h2>
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {loveLetters[game]}
              </pre>
            </div>
            <button
              onClick={handleClose}
              className="mt-6 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full 
                       text-sm font-medium transition-all duration-200 
                       hover:scale-105 mx-auto block
                       focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
