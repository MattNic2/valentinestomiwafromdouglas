export type Position = { x: number; y: number };
export type Direction = { x: number; y: number };
export type PowerUp = {
  type: "speed" | "slow" | "ghost" | "points2x";
  position: Position;
  duration: number;
  expiresAt?: number;
};

export type Obstacle = {
  position: Position;
  type: "wall" | "portal" | "moving";
  paired?: Position; // For portals
};

export type GameState = {
  snake: Position[];
  direction: Direction;
  food: Position;
  score: number;
  powerUps: PowerUp[];
  activeEffects: PowerUp[];
  obstacles: Obstacle[];
  level: number;
  speed: number;
  isGhost: boolean;
};

export const INITIAL_STATE: GameState = {
  snake: [{ x: 10, y: 10 }],
  direction: { x: 1, y: 0 },
  food: { x: 15, y: 15 },
  score: 0,
  powerUps: [],
  activeEffects: [],
  obstacles: [],
  level: 1,
  speed: 150,
  isGhost: false,
};

export function generateFood(
  snake: Position[],
  obstacles: Obstacle[],
  gridSize: number
): Position {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === food.x && segment.y === food.y
    );
    const isOnObstacle = obstacles.some(
      (obs) => obs.position.x === food.x && obs.position.y === food.y
    );

    if (!isOnSnake && !isOnObstacle) {
      return food;
    }
  }
}

export function generatePowerUp(
  snake: Position[],
  food: Position,
  obstacles: Obstacle[],
  gridSize: number
): PowerUp {
  const types: PowerUp["type"][] = ["speed", "slow", "ghost", "points2x"];
  const position = generateFood(snake, obstacles, gridSize);
  return {
    type: types[Math.floor(Math.random() * types.length)],
    position,
    duration: 5000,
  };
}

export function generateObstacles(level: number, gridSize: number): Obstacle[] {
  const obstacles: Obstacle[] = [];
  const count = Math.min(level * 2, 10);

  // Generate walls
  for (let i = 0; i < count; i++) {
    obstacles.push({
      position: {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      },
      type: "wall",
    });
  }

  // Add portals in pairs
  if (level > 2) {
    for (let i = 0; i < 2; i++) {
      const portal1: Position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      const portal2: Position = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };

      obstacles.push({
        position: portal1,
        type: "portal",
        paired: portal2,
      });
      obstacles.push({
        position: portal2,
        type: "portal",
        paired: portal1,
      });
    }
  }

  return obstacles;
}

export function checkCollision(
  head: Position,
  snake: Position[],
  obstacles: Obstacle[],
  gridSize: number,
  isGhost: boolean
): boolean | Position {
  // Wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return true;
  }

  // Self collision
  if (
    snake.some(
      (segment, i) => i !== 0 && segment.x === head.x && segment.y === head.y
    )
  ) {
    return true;
  }

  // Obstacle collision
  for (const obstacle of obstacles) {
    if (head.x === obstacle.position.x && head.y === obstacle.position.y) {
      if (obstacle.type === "portal" && obstacle.paired) {
        return obstacle.paired; // Return teleport position
      }
      if (obstacle.type === "wall" && !isGhost) {
        return true; // Collision
      }
    }
  }

  return false;
}
