import { COLS, ROWS } from '../constants';
import type { ActivePiece } from './pieces';
import { getCells } from './pieces';

export type Cell = string | null;
export type Board = Cell[][];

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

export function isValidPosition(board: Board, piece: ActivePiece): boolean {
  return getCells(piece).every(({ x, y }) => {
    if (x < 0 || x >= COLS || y >= ROWS) return false;
    if (y < 0) return true;
    return board[y][x] === null;
  });
}

export function mergePiece(board: Board, piece: ActivePiece, color: string): Board {
  const next = board.map((row) => [...row]);

  for (const { x, y } of getCells(piece)) {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      next[y][x] = color;
    }
  }

  return next;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = ROWS - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () => Array<Cell>(COLS).fill(null));

  return { board: [...emptyRows, ...remaining], linesCleared };
}

export function getGhostPiece(board: Board, piece: ActivePiece): ActivePiece {
  let ghost = { ...piece };

  while (isValidPosition(board, { ...ghost, y: ghost.y + 1 })) {
    ghost = { ...ghost, y: ghost.y + 1 };
  }

  return ghost;
}

export function getHardDropDistance(board: Board, piece: ActivePiece): number {
  let distance = 0;

  while (isValidPosition(board, { ...piece, y: piece.y + distance + 1 })) {
    distance++;
  }

  return distance;
}
