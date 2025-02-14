"use client";

import { useState, useEffect } from "react";

type GameType = "snake" | "quiz" | "memory" | "scramble" | "bubble" | "wordle";

interface LoveLetterProps {
  game: GameType;
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
};

export default function LoveLetter({ game }: LoveLetterProps) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(true);
  }, []);

  return (
    <>
      {showMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-[scaleIn_0.3s_ease-out]">
            <h2 className="text-3xl font-serif text-rose-600 mb-6 text-center">
              A Special Message for You
            </h2>
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {loveLetters[game as keyof typeof loveLetters]}
              </pre>
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
  );
}
