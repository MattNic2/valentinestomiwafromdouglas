"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function PopEffect({ x, y }: { x: number; y: number }) {
  useEffect(() => {
    const burst = confetti.create(undefined, {
      resize: true,
      useWorker: true,
    });

    burst({
      particleCount: 3,
      spread: 15,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ["#fb7185", "#f43f5e", "#e11d48"],
      gravity: 0.3,
    });
  }, [x, y]);

  return null;
}

export function CelebrationEffect() {
  useEffect(() => {
    const end = Date.now() + 1000;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fb7185", "#f43f5e", "#e11d48"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fb7185", "#f43f5e", "#e11d48"],
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return null;
}
