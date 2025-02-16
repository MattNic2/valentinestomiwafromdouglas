"use client";

import { useEffect, useCallback, useState } from "react";

interface HeartPosition {
  x: number;
  y: number;
  id: number;
}

export default function HeartTrail() {
  const [hearts, setHearts] = useState<HeartPosition[]>([]);
  const [nextId, setNextId] = useState(0);

  const createHeart = useCallback(
    (x: number, y: number) => {
      setHearts((prevHearts) => [...prevHearts, { x, y, id: nextId }]);
      setNextId((prev) => prev + 1);

      // Remove heart after animation completes
      setTimeout(() => {
        setHearts((prevHearts) =>
          prevHearts.filter((heart) => heart.id !== nextId)
        );
      }, 1000);
    },
    [nextId]
  );

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      // Calculate distance moved
      const distance = Math.sqrt(
        Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2)
      );

      // Only create new heart if mouse has moved enough
      if (distance > 30) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          createHeart(currentX - 8, currentY - 8);
        }, 50);
        lastX = currentX;
        lastY = currentY;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [createHeart]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map(({ x, y, id }) => (
        <div
          key={id}
          className="absolute animate-heart-fade text-rose-500"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            fontSize: "16px",
            opacity: 0.8,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
