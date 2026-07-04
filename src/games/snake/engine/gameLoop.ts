import { getMoveInterval, loadHighScore, saveHighScore } from '../constants';
import {
  createInitialSnake,
  getNextHead,
  isOnSnake,
  isOutOfBounds,
  spawnFood,
} from './snake';
import type { Direction, Point, SnakeAction, SnakeState } from './types';
import { OPPOSITE } from './types';

const MAX_TICK_MS = 100;

export class SnakeEngine {
  private snake: Point[] = createInitialSnake();
  private food: Point | null = spawnFood(this.snake);
  private direction: Direction = 'right';
  private directionQueue: Direction[] = [];
  private score = 0;
  private highScore = loadHighScore();
  private paused = false;
  private gameOver = false;
  private won = false;
  private moveAccumulator = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.snake = createInitialSnake();
    this.food = spawnFood(this.snake);
    this.direction = 'right';
    this.directionQueue = [];
    this.score = 0;
    this.highScore = loadHighScore();
    this.paused = false;
    this.gameOver = false;
    this.won = false;
    this.moveAccumulator = 0;
  }

  getState(): SnakeState {
    return {
      snake: this.snake,
      food: this.food ?? { x: -1, y: -1 },
      direction: this.direction,
      score: this.score,
      highScore: this.highScore,
      paused: this.paused,
      gameOver: this.gameOver,
      won: this.won,
    };
  }

  tick(deltaMs: number): void {
    if (this.gameOver || this.paused) return;

    this.moveAccumulator += Math.min(deltaMs, MAX_TICK_MS);

    while (true) {
      if (this.gameOver || this.paused) break;

      const interval = getMoveInterval(this.snake.length);
      if (this.moveAccumulator < interval) break;

      this.moveAccumulator -= interval;
      this.step();
    }
  }

  dispatch(action: SnakeAction): void {
    if (this.gameOver) return;

    if (action === 'pause') {
      this.paused = !this.paused;
      return;
    }

    if (this.paused) return;

    const reference =
      this.directionQueue.length > 0
        ? this.directionQueue[this.directionQueue.length - 1]
        : this.direction;

    if (OPPOSITE[reference] === action) return;
    if (this.directionQueue.length >= 2) return;

    this.directionQueue.push(action);
  }

  private step(): void {
    const next = this.directionQueue.shift();
    if (next) this.direction = next;
    const head = getNextHead(this.snake[0], this.direction);

    if (isOutOfBounds(head)) {
      this.endGame();
      return;
    }

    const ateFood =
      this.food !== null && head.x === this.food.x && head.y === this.food.y;
    const bodyToCheck = ateFood ? this.snake : this.snake.slice(0, -1);

    if (isOnSnake(head, bodyToCheck)) {
      this.endGame();
      return;
    }

    this.snake = [head, ...this.snake];

    if (ateFood) {
      this.score += 10;
      const nextFood = spawnFood(this.snake);
      if (!nextFood) {
        this.winGame();
        return;
      }
      this.food = nextFood;
    } else {
      this.snake.pop();
    }
  }

  private winGame(): void {
    this.gameOver = true;
    this.won = true;
    this.food = null;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.score);
    }
  }

  private endGame(): void {
    this.gameOver = true;
    this.won = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.score);
    }
  }
}

export type { SnakeAction, SnakeState };
