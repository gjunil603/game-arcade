export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

export const PADDLE_WIDTH = 80;
export const PADDLE_HEIGHT = 14;
export const PADDLE_Y = CANVAS_HEIGHT - 40;
export const PADDLE_SPEED = 420;

export const BALL_RADIUS = 7;
export const BASE_BALL_SPEED = 300;

export const BRICK_COLS = 10;
export const BRICK_ROWS = 6;
export const BRICK_PADDING = 4;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = 20;

export const BRICK_WIDTH =
  (CANVAS_WIDTH - BRICK_OFFSET_LEFT * 2 - BRICK_PADDING * (BRICK_COLS - 1)) / BRICK_COLS;
export const BRICK_HEIGHT = 22;

export const INITIAL_LIVES = 3;
export const LEVEL_CLEAR_DELAY_MS = 1500;

export const COLORS = {
  background: '#12151f',
  paddle: '#6c5ce7',
  ball: '#ffffff',
  brickRows: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#ff9ff3'],
  wall: '#2a2f42',
} as const;

const HIGH_SCORE_KEY = 'game-arcade-breakout-high-score';

export function getBallSpeed(level: number): number {
  return BASE_BALL_SPEED * (1 + (level - 1) * 0.08);
}

export function loadHighScore(): number {
  try {
    const value = localStorage.getItem(HIGH_SCORE_KEY);
    if (!value) return 0;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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

export function brickScore(level: number): number {
  return 10 * level;
}

export function levelClearBonus(level: number): number {
  return 100 * level;
}
