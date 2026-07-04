import { CELL_SIZE, COLORS, COLS, PREVIEW_CELL_SIZE, ROWS } from './constants';
import type { ActivePiece, PieceType } from './engine/pieces';
import { getCells, getColor, getShape } from './engine/pieces';
import type { Board } from './engine/board';

function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1,
): void {
  const padding = 1;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.strokeRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
}

function drawGrid(ctx: CanvasRenderingContext2D, cols: number, rows: number, size: number): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, cols * size, rows * size);

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;

  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * size, 0);
    ctx.lineTo(x * size, rows * size);
    ctx.stroke();
  }

  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * size);
    ctx.lineTo(cols * size, y * size);
    ctx.stroke();
  }
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: ActivePiece,
  size: number,
  alpha = 1,
): void {
  const color = getColor(piece.type);
  for (const { x, y } of getCells(piece)) {
    if (y >= 0) {
      drawCell(ctx, x, y, size, color, alpha);
    }
  }
}

export function renderBoard(
  canvas: HTMLCanvasElement,
  board: Board,
  activePiece: ActivePiece | null,
  ghostPiece: ActivePiece | null,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;

  drawGrid(ctx, COLS, ROWS, CELL_SIZE);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = board[y][x];
      if (cell) {
        drawCell(ctx, x, y, CELL_SIZE, cell);
      }
    }
  }

  if (ghostPiece && activePiece) {
    drawPiece(ctx, ghostPiece, CELL_SIZE, 0.25);
  }

  if (activePiece) {
    drawPiece(ctx, activePiece, CELL_SIZE);
  }
}

export function renderNextPiece(canvas: HTMLCanvasElement, type: PieceType): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const previewSize = 4;
  canvas.width = previewSize * PREVIEW_CELL_SIZE;
  canvas.height = previewSize * PREVIEW_CELL_SIZE;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const piece: ActivePiece = { type, rotation: 0, x: 0, y: 0 };
  const shape = getShape(piece);
  const color = getColor(type);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col]) {
        drawCell(ctx, col, row, PREVIEW_CELL_SIZE, color);
      }
    }
  }
}
