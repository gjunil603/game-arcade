import {
  BOARD_PADDING,
  BOARD_SIZE,
  CELL_GAP,
  CELL_SIZE,
  COLORS,
  GRID_SIZE,
  getTileColors,
} from './constants';
import type { Grid } from './engine/types';

export function renderBoard(canvas: HTMLCanvasElement, grid: Grid): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = BOARD_SIZE;
  canvas.height = BOARD_SIZE;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const x = BOARD_PADDING + c * (CELL_SIZE + CELL_GAP);
      const y = BOARD_PADDING + r * (CELL_SIZE + CELL_GAP);
      const value = grid[r][c];

      if (value === 0) {
        ctx.fillStyle = COLORS.cellEmpty;
        ctx.beginPath();
        ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 6);
        ctx.fill();
        continue;
      }

      const { bg, text } = getTileColors(value);
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, 6);
      ctx.fill();

      ctx.fillStyle = text;
      ctx.font =
        value >= 1000
          ? 'bold 28px Segoe UI, system-ui, sans-serif'
          : value >= 100
            ? 'bold 34px Segoe UI, system-ui, sans-serif'
            : 'bold 40px Segoe UI, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(value), x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 2);
    }
  }
}
