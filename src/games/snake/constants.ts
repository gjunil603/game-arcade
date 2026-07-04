export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const COLORS = {
  background: '#12151f',
  grid: '#2a2f42',
  snakeHead: '#00e676',
  snakeBody: '#00c853',
  food: '#ff5252',
} as const;

const HIGH_SCORE_KEY = 'game-arcade-snake-high-score';

export function getMoveInterval(length: number): number {
  const base = 180;
  const reduction = Math.min(length - 3, 15) * 6;
  return Math.max(base - reduction, 70);
}

export function loadHighScore(): number {
  try {
    const value = localStorage.getItem(HIGH_SCORE_KEY);
    return value ? Number.parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // ignore storage errors
  }
}
