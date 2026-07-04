export const COLS = 10;
export const ROWS = 20;
export const CELL_SIZE = 30;
export const PREVIEW_CELL_SIZE = 20;

export const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
  ghost: 'rgba(255, 255, 255, 0.15)',
  grid: '#2a2f42',
  background: '#12151f',
} as const;

export function getDropInterval(level: number): number {
  const speeds = [800, 720, 630, 550, 470, 380, 300, 220, 150, 100, 80, 70, 60, 50, 40];
  return speeds[Math.min(level - 1, speeds.length - 1)] ?? 30;
}
