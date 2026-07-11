export const CANVAS_WIDTH = 360;
export const CANVAS_HEIGHT = 640;

export const BIRD_X = 80;
export const BIRD_RADIUS = 14;
export const GRAVITY = 1800;
export const FLAP_VELOCITY = -420;
export const MAX_FALL_SPEED = 700;

export const PIPE_WIDTH = 56;
export const PIPE_GAP = 150;
export const PIPE_SPEED = 160;
export const PIPE_SPAWN_INTERVAL = 1.45;
export const PIPE_MIN_TOP = 80;
export const PIPE_MAX_TOP = CANVAS_HEIGHT - PIPE_GAP - 120;

export const GROUND_HEIGHT = 64;

export const COLORS = {
  skyTop: '#4ecdc4',
  skyBottom: '#1a535c',
  bird: '#feca57',
  birdWing: '#ff9f43',
  birdEye: '#ffffff',
  birdPupil: '#2d3436',
  birdBeak: '#e17055',
  pipe: '#26de81',
  pipeBorder: '#20bf6b',
  ground: '#a3cb38',
  groundDark: '#6ab04c',
} as const;

const HIGH_SCORE_KEY = 'game-arcade-flappy-high-score';

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
