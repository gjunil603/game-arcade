import { getDropInterval } from '../constants';
import {
  clearLines,
  createEmptyBoard,
  getGhostPiece,
  getHardDropDistance,
  isValidPosition,
  mergePiece,
  type Board,
} from './board';
import {
  createPiece,
  getColor,
  randomPieceType,
  type ActivePiece,
  type PieceType,
} from './pieces';
import { calculateLevel, calculateLineScore } from './scoring';

export interface TetrisState {
  board: Board;
  activePiece: ActivePiece | null;
  nextPiece: PieceType;
  ghostPiece: ActivePiece | null;
  score: number;
  level: number;
  lines: number;
  paused: boolean;
  gameOver: boolean;
}

export type TetrisAction =
  | 'moveLeft'
  | 'moveRight'
  | 'rotate'
  | 'softDrop'
  | 'hardDrop'
  | 'pause';

const WALL_KICKS = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

const MAX_TICK_MS = 100;

export class TetrisEngine {
  private board: Board = createEmptyBoard();
  private activePiece: ActivePiece | null = null;
  private nextPiece: PieceType = randomPieceType();
  private score = 0;
  private level = 1;
  private lines = 0;
  private paused = false;
  private gameOver = false;
  private dropAccumulator = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.board = createEmptyBoard();
    this.nextPiece = randomPieceType();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.paused = false;
    this.gameOver = false;
    this.dropAccumulator = 0;
    this.spawnPiece();
  }

  getState(): TetrisState {
    const ghostPiece =
      this.activePiece && !this.gameOver && !this.paused
        ? getGhostPiece(this.board, this.activePiece)
        : null;

    return {
      board: this.board,
      activePiece: this.activePiece,
      nextPiece: this.nextPiece,
      ghostPiece,
      score: this.score,
      level: this.level,
      lines: this.lines,
      paused: this.paused,
      gameOver: this.gameOver,
    };
  }

  tick(deltaMs: number): void {
    if (this.gameOver || this.paused || !this.activePiece) return;

    this.dropAccumulator += Math.min(deltaMs, MAX_TICK_MS);
    const interval = getDropInterval(this.level);

    while (this.dropAccumulator >= interval) {
      if (this.gameOver || !this.activePiece) break;
      this.dropAccumulator -= interval;
      this.moveDown(false);
    }
  }

  dispatch(action: TetrisAction): void {
    if (this.gameOver) return;

    if (action === 'pause') {
      this.paused = !this.paused;
      return;
    }

    if (this.paused || !this.activePiece) return;

    switch (action) {
      case 'moveLeft':
        this.tryMove(-1, 0);
        break;
      case 'moveRight':
        this.tryMove(1, 0);
        break;
      case 'rotate':
        this.tryRotate();
        break;
      case 'softDrop':
        this.moveDown(true);
        break;
      case 'hardDrop':
        this.hardDrop();
        break;
    }
  }

  private spawnPiece(): void {
    const type = this.nextPiece;
    this.nextPiece = randomPieceType();
    const piece = createPiece(type);

    if (!isValidPosition(this.board, piece)) {
      this.activePiece = null;
      this.gameOver = true;
      return;
    }

    this.activePiece = piece;
    this.dropAccumulator = 0;
  }

  private tryMove(dx: number, dy: number): boolean {
    if (!this.activePiece) return false;

    const moved = { ...this.activePiece, x: this.activePiece.x + dx, y: this.activePiece.y + dy };
    if (!isValidPosition(this.board, moved)) return false;

    this.activePiece = moved;
    return true;
  }

  private tryRotate(): boolean {
    if (!this.activePiece) return false;

    const nextRotation = (this.activePiece.rotation + 1) % 4;

    for (const kick of WALL_KICKS) {
      const rotated = {
        ...this.activePiece,
        rotation: nextRotation,
        x: this.activePiece.x + kick.x,
        y: this.activePiece.y + kick.y,
      };

      if (isValidPosition(this.board, rotated)) {
        this.activePiece = rotated;
        return true;
      }
    }

    return false;
  }

  private moveDown(awardPoints: boolean): void {
    if (!this.activePiece) return;

    const moved = { ...this.activePiece, y: this.activePiece.y + 1 };
    if (isValidPosition(this.board, moved)) {
      this.activePiece = moved;
      if (awardPoints) this.score += 1;
      return;
    }

    this.lockPiece();
  }

  private hardDrop(): void {
    if (!this.activePiece) return;

    const distance = getHardDropDistance(this.board, this.activePiece);
    this.activePiece = { ...this.activePiece, y: this.activePiece.y + distance };
    this.score += distance * 2;
    this.lockPiece();
  }

  private lockPiece(): void {
    if (!this.activePiece) return;

    this.board = mergePiece(this.board, this.activePiece, getColor(this.activePiece.type));
    const { board, linesCleared } = clearLines(this.board);
    this.board = board;

    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += calculateLineScore(linesCleared, this.level);
      this.level = calculateLevel(this.lines);
    }

    this.activePiece = null;
    this.spawnPiece();
  }
}
