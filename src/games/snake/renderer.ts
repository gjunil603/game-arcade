import { CELL_SIZE, COLORS, GRID_SIZE } from './constants';
import type { Point } from './engine/types';

function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  radius = 3,
): void {
  const padding = 1;
  const px = x * CELL_SIZE + padding;
  const py = y * CELL_SIZE + padding;
  const size = CELL_SIZE - padding * 2;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(px, py, size, size, radius);
  ctx.fill();
}

export function renderBoard(
  canvas: HTMLCanvasElement,
  snake: Point[],
  food: Point | null,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = GRID_SIZE * CELL_SIZE;
  canvas.height = GRID_SIZE * CELL_SIZE;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }

  if (food && food.x >= 0 && food.y >= 0) {
    drawCell(ctx, food.x, food.y, COLORS.food, 6);
  }

  snake.forEach((segment, index) => {
    drawCell(ctx, segment.x, segment.y, index === 0 ? COLORS.snakeHead : COLORS.snakeBody);
  });
}
