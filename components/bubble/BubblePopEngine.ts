export type BubbleType = "normal" | "golden" | "rainbow" | "bomb" | "freeze";

export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: BubbleType;
  color: string;
  points: number;
  frozen?: boolean;
  chain?: number;
}

export interface GameState {
  bubbles: Bubble[];
  score: number;
  level: number;
  combo: number;
  lastPopTime: number;
  frozenUntil: number | null;
  multiplier: number;
  chainCount: number;
}

export const INITIAL_STATE: GameState = {
  bubbles: [],
  score: 0,
  level: 1,
  combo: 0,
  lastPopTime: 0,
  frozenUntil: null,
  multiplier: 1,
  chainCount: 0,
};

const BUBBLE_TYPES: Record<
  BubbleType,
  { color: string; points: number; chance: number }
> = {
  normal: { color: "bg-pink-400", points: 1, chance: 0.7 },
  golden: { color: "bg-yellow-400", points: 5, chance: 0.15 },
  rainbow: {
    color: "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400",
    points: 3,
    chance: 0.1,
  },
  bomb: { color: "bg-red-600", points: -2, chance: 0.03 },
  freeze: { color: "bg-blue-400", points: 2, chance: 0.02 },
};

export function generateBubble(
  level: number,
  existingBubbles: Bubble[]
): Bubble {
  const id = Date.now() + Math.random();
  const size = Math.random() * 20 + 30; // Varying sizes

  // Ensure bubbles don't overlap too much
  let x: number;
  let y: number;
  do {
    x = Math.random() * (window.innerWidth - size);
    y = Math.random() * (500 - size); // Game area height
  } while (
    existingBubbles.some(
      (b) => Math.hypot(b.x - x, b.y - y) < (b.size + size) / 1.5
    )
  );

  // Determine bubble type based on chances
  const rand = Math.random();
  let accumulatedChance = 0;
  let selectedType: BubbleType = "normal";

  for (const [type, config] of Object.entries(BUBBLE_TYPES)) {
    accumulatedChance += config.chance;
    if (rand <= accumulatedChance) {
      selectedType = type as BubbleType;
      break;
    }
  }

  return {
    id,
    x,
    y,
    size,
    speed: (Math.random() * 0.5 + 0.5) * (1 + level * 0.1),
    type: selectedType,
    color: BUBBLE_TYPES[selectedType].color,
    points: BUBBLE_TYPES[selectedType].points,
  };
}

export function updateBubbles(
  bubbles: Bubble[],
  deltaTime: number,
  frozenUntil: number | null
): Bubble[] {
  const isFrozen = frozenUntil && Date.now() < frozenUntil;

  return bubbles.map((bubble) => {
    if (isFrozen || bubble.frozen) return bubble;

    const newY = bubble.y - bubble.speed * deltaTime;
    return {
      ...bubble,
      y: newY < -bubble.size ? 500 : newY,
    };
  });
}

export function handleBubblePop(
  state: GameState,
  bubbleId: number,
  clickX: number,
  clickY: number
): GameState {
  const bubble = state.bubbles.find((b) => b.id === bubbleId);
  if (!bubble) return state;

  const timeSinceLastPop = Date.now() - state.lastPopTime;
  const newCombo = timeSinceLastPop < 1000 ? state.combo + 1 : 1;

  let newMultiplier = state.multiplier;
  let newFrozenUntil = state.frozenUntil;
  let pointsEarned = bubble.points;

  // Handle special bubble effects
  switch (bubble.type) {
    case "rainbow":
      newMultiplier = Math.min(state.multiplier + 0.5, 3);
      break;
    case "freeze":
      newFrozenUntil = Date.now() + 3000;
      break;
    case "bomb":
      // Bomb reduces multiplier but doesn't go below 1
      newMultiplier = Math.max(1, state.multiplier - 0.5);
      break;
  }

  // Apply combo and multiplier
  pointsEarned *= newMultiplier * (1 + newCombo * 0.1);

  return {
    ...state,
    bubbles: state.bubbles.filter((b) => b.id !== bubbleId),
    score: state.score + Math.round(pointsEarned),
    combo: newCombo,
    lastPopTime: Date.now(),
    multiplier: newMultiplier,
    frozenUntil: newFrozenUntil,
    level: Math.floor(state.score / 50) + 1,
  };
}
