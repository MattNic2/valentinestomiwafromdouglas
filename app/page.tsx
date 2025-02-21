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
import CelebrationScreen from "../components/CelebrationScreen";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";
import FloatingHearts from "../components/FloatingHearts";
import HeartTrail from "../components/HeartTrail";

// Dynamically import PhotoGallery with ssr disabled
const PhotoGallery = dynamic(() => import("../components/PhotoGallery"), {
  ssr: false,
});

// Move loadGameProgress outside of the component or use useCallback
const loadGameProgress = async (user: any, setShowLoveLetters: any) => {
  if (!user) return;

  try {
    const { data, error } = await supabase
      .from("game_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Initialize new progress record if none exists
        const initialProgress = {
          user_id: user.id,
          progress: {
            snake: false,
            quiz: false,
            memory: false,
            scramble: false,
            bubble: false,
            wordle: false,
            final: false,
          },
        };
        await supabase.from("game_progress").insert(initialProgress);
      } else {
        throw error;
      }
    } else if (data) {
      setShowLoveLetters(data.progress);
    }
  } catch (error) {
    console.error("Error managing game progress:", error);
  }
};

export default function Home() {
  type GameType =
    | "snake"
    | "quiz"
    | "memory"
    | "scramble"
    | "bubble"
    | "wordle"
    | "final";

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [showLoveLetters, setShowLoveLetters] = useState<
    Record<GameType, boolean>
  >({
    snake: false,
    quiz: false,
    memory: false,
    scramble: false,
    bubble: false,
    wordle: false,
    final: false,
  });
  const [selectedLetter, setSelectedLetter] = useState<GameType | null>(null);

  const [showFooter, setShowFooter] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFinalLetter, setShowFinalLetter] = useState(false);

  const router = useRouter();

  // Add this near the top with other state variables
  const [isMobile, setIsMobile] = useState(false);

  // Add this useEffect to handle screen size detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard mobile breakpoint
    };

    // Check initial size
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update the auth effect with proper dependency management
  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const handleSession = async (session: any) => {
      if (!mounted) return;

      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await loadGameProgress(newUser, setShowLoveLetters);
      } else {
        setShowLoveLetters({
          snake: false,
          quiz: false,
          memory: false,
          scramble: false,
          bubble: false,
          wordle: false,
          final: false,
        });
      }
    };

    // Set up auth subscription
    const setupSubscription = async () => {
      const { data } = await supabase.auth.getSession();
      await handleSession(data.session);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: string, session: any) =>
        handleSession(session)
      );
      authSubscription = subscription;
    };

    setupSubscription();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array since we don't want this to re-run

  // Update handleScoreChange to be more efficient
  const handleScoreChange = async (
    game: keyof typeof showLoveLetters,
    score: number
  ) => {
    const thresholds: Record<GameType, number> = {
      snake: 15,
      quiz: 10,
      memory: 16,
      scramble: 10,
      bubble: 20,
      wordle: 6,
      final: 0,
    };

    if (score >= thresholds[game]) {
      const newProgress = { ...showLoveLetters, [game]: true };

      if (user) {
        try {
          const { error } = await supabase.from("game_progress").upsert(
            {
              user_id: user.id,
              progress: newProgress,
            },
            {
              onConflict: "user_id",
            }
          );

          if (!error) {
            setShowLoveLetters(newProgress);
          } else {
            console.error("Error saving progress:", error);
          }
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }
    }
  };

  // Add sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowLoveLetters({
      snake: false,
      quiz: false,
      memory: false,
      scramble: false,
      bubble: false,
      wordle: false,
      final: false,
    });
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

  // Update scroll handler to only affect footer on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const bottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight;
        setShowFooter(bottom);
      } else {
        setShowFooter(true); // Always show on desktop
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update effect to handle final letter unlock
  useEffect(() => {
    const allUnlocked = Object.values(showLoveLetters).every(Boolean);
    if (allUnlocked) {
      setShowCelebration(true);
      setShowFinalLetter(true);
      // Update showLoveLetters to include final letter
      setShowLoveLetters((prev) => ({
        ...prev,
        final: true,
      }));
    }
  }, [showLoveLetters]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-red-100 p-8 pb-48">
      {/* Update FloatingHearts and HeartTrail with pointer-events-none class on mobile */}
      <div className="md:pointer-events-auto pointer-events-none">
        <FloatingHearts />
        <HeartTrail />
      </div>

      {/* Update auth section with user email */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-rose-600 font-medium">
              Hello, {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Add CelebrationScreen at the root level */}
      {showCelebration && (
        <CelebrationScreen onClose={() => setShowCelebration(false)} />
      )}

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section with Fade-in */}
        <section className="mb-12 opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
          <header className="text-center mb-12">
            <div className="relative flex flex-col items-center text-center">
              {/* Floating Hearts Background */}
              <h1 className="text-4xl md:text-6xl font-bold text-rose-600 mb-4 font-serif drop-shadow-md group">
                Douglas{" "}
                <span className="inline-block animate-heart-pulse">❤️</span>{" "}
                Miwa&apos;s Love Games
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

        {/* Update LetterDisplay container */}

        <div
          className={`
            md:fixed md:bottom-4 md:left-1/2 md:transform md:-translate-x-1/2 md:z-50 md:w-full md:max-w-3xl
            transition-opacity duration-300 
            opacity-100
          `}
        >
          <LetterDisplay
            unlockedGames={showLoveLetters}
            onLetterSelect={setSelectedLetter}
            showFinalLetter={showFinalLetter}
            isMobile={isMobile}
            showFooter={showFooter}
          />
        </div>

        {/* Add LoveLetter at the page level */}
        {selectedLetter && (
          <LoveLetter
            game={selectedLetter}
            onLetterClose={() => setSelectedLetter(null)}
          />
        )}

        {/* Add new travel dreams button section before the footer */}
        <section className="scroll-animate fade-in-up text-center">
          <button
            onClick={() => router.push("/travel-dreams")}
            className="bg-rose-500 text-white px-8 py-3 rounded-xl
              hover:bg-rose-600 transition-all transform hover:scale-105
              active:scale-95 font-medium group inline-flex items-center gap-2"
          >
            Plan Our Next Adventure
            <Plane className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </section>

        <footer
          className={`text-center text-pink-700 mt-8 scroll-animate fade-in-up md:opacity-100 transition-opacity duration-300 ${
            showFooter ? "opacity-100" : "opacity-0"
          }`}
        >
          <p>Created with love by Douglas for Miwa</p>
        </footer>
      </div>
    </main>
  );
}
