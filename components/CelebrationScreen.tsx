import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { Plane, X } from "lucide-react";

interface CelebrationScreenProps {
  onClose: () => void;
}

export default function CelebrationScreen({ onClose }: CelebrationScreenProps) {
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Animate text after confetti starts
    setTimeout(() => setShowMessage(true), 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl p-8 text-center relative overflow-hidden">
          {/* Add close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-rose-400 hover:text-rose-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Animated hearts background */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-heart"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: 0.1,
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          <div
            className={`space-y-6 relative ${
              showMessage ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-rose-600 font-serif">
              Congratulations! 🎉
            </h2>
            <p className="text-xl text-rose-500">
              You&apos;ve unlocked all the love letters!
            </p>
            <p className="text-lg text-gray-600">
              Now, let&apos;s plan our next adventure together...
            </p>
            <button
              onClick={() => router.push("/travel-dreams")}
              className="bg-rose-500 text-white px-8 py-3 rounded-xl
                hover:bg-rose-600 transition-all transform hover:scale-105
                active:scale-95 font-medium group"
            >
              <span className="flex items-center justify-center gap-2">
                Plan Our Next Adventure
                <Plane className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
