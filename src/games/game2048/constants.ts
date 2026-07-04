export const GRID_SIZE = 4;
export const CELL_GAP = 8;
export const BOARD_PADDING = 12;
export const CELL_SIZE = 80;
export const BOARD_SIZE = BOARD_PADDING * 2 + GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP;

export const WIN_TILE = 2048;

export const COLORS = {
  background: '#bbada0',
  cellEmpty: '#cdc1b4',
  textDark: '#776e65',
  textLight: '#f9f6f2',
} as const;

export const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
};

const HIGH_SCORE_KEY = 'game-arcade-2048-high-score';

export function getTileColors(value: number): { bg: string; text: string } {
  if (TILE_COLORS[value]) return TILE_COLORS[value];
  return { bg: '#3c3a32', text: '#f9f6f2' };
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
