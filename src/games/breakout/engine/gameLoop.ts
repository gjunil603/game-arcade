import {
  BALL_RADIUS,
  BRICK_COLS,
  BRICK_HEIGHT,
  BRICK_OFFSET_LEFT,
  BRICK_OFFSET_TOP,
  BRICK_PADDING,
  BRICK_ROWS,
  BRICK_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_LIVES,
  LEVEL_CLEAR_DELAY_MS,
  PADDLE_HEIGHT,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PADDLE_Y,
  brickScore,
  getBallSpeed,
  levelClearBonus,
  loadHighScore,
  saveHighScore,
} from '../constants';
import {
  resolveBrickCollision,
  resolvePaddleCollision,
  resolveWallCollision,
} from './collision';
import { getLevelPattern } from './levels';
import type { Ball, BreakoutAction, BreakoutState, Brick, GameStatus, Paddle } from './types';

const MAX_TICK_MS = 100;

export class BreakoutEngine {
  private ball: Ball = createBall();
  private paddle: Paddle = createPaddle();
  private bricks: Brick[] = [];
  private status: GameStatus = 'ready';
  private score = 0;
  private level = 1;
  private lives = INITIAL_LIVES;
  private highScore = loadHighScore();
  private movingLeft = false;
  private movingRight = false;
  private levelClearTimer = 0;
  private statusBeforePause: GameStatus = 'ready';

  constructor() {
    this.reset();
  }

  reset(): void {
    this.score = 0;
    this.level = 1;
    this.lives = INITIAL_LIVES;
    this.highScore = loadHighScore();
    this.status = 'ready';
    this.movingLeft = false;
    this.movingRight = false;
    this.levelClearTimer = 0;
    this.paddle = createPaddle();
    this.bricks = createBricks(this.level);
    this.ball = createBallOnPaddle(this.paddle);
  }

  getState(): BreakoutState {
    return {
      ball: { ...this.ball },
      paddle: { ...this.paddle },
      bricks: this.bricks.map((b) => ({ ...b })),
      status: this.status,
      score: this.score,
      level: this.level,
      lives: this.lives,
      highScore: this.highScore,
    };
  }

  tick(deltaMs: number): void {
    const dt = Math.min(deltaMs, MAX_TICK_MS) / 1000;

    if (this.status === 'levelClear') {
      this.levelClearTimer -= deltaMs;
      if (this.levelClearTimer <= 0) {
        this.advanceLevel();
      }
      return;
    }

    if (this.status === 'gameOver' || this.status === 'paused') return;

    this.updatePaddle(dt);

    if (this.status === 'ready') {
      this.ball.x = this.paddle.x + this.paddle.width / 2;
      this.ball.y = this.paddle.y - this.ball.radius;
      return;
    }

    if (this.status !== 'playing') return;

    const result = this.updateBall(dt);
    if (result === 'lost') {
      this.loseLife();
    }
  }

  private updateBall(dt: number): 'continue' | 'lost' {
    const speed = Math.hypot(this.ball.vx, this.ball.vy);
    if (speed === 0) return 'continue';

    const maxStep = BALL_RADIUS * 0.5;
    const totalDistance = speed * dt;
    const steps = Math.max(1, Math.ceil(totalDistance / maxStep));
    const stepDt = dt / steps;

    for (let step = 0; step < steps; step++) {
      this.ball.x += this.ball.vx * stepDt;
      this.ball.y += this.ball.vy * stepDt;

      const wallHit = resolveWallCollision(this.ball, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (wallHit === 'bottom') return 'lost';

      resolvePaddleCollision(this.ball, this.paddle);

      for (const brick of this.bricks) {
        if (resolveBrickCollision(this.ball, brick)) {
          this.score += brickScore(this.level);
          this.updateHighScore();
          break;
        }
      }

      if (this.bricks.every((b) => b.destroyed)) {
        this.score += levelClearBonus(this.level);
        this.updateHighScore();
        this.status = 'levelClear';
        this.levelClearTimer = LEVEL_CLEAR_DELAY_MS;
        return 'continue';
      }
    }

    return 'continue';
  }

  dispatch(action: BreakoutAction): void {
    switch (action) {
      case 'moveLeft':
        this.movingLeft = true;
        break;
      case 'moveRight':
        this.movingRight = true;
        break;
      case 'moveLeftEnd':
        this.movingLeft = false;
        break;
      case 'moveRightEnd':
        this.movingRight = false;
        break;
      case 'launch':
        this.launchBall();
        break;
      case 'pause':
        this.togglePause();
        break;
    }
  }

  private updatePaddle(dt: number): void {
    let dx = 0;
    if (this.movingLeft) dx -= PADDLE_SPEED * dt;
    if (this.movingRight) dx += PADDLE_SPEED * dt;
    this.paddle.x = clamp(this.paddle.x + dx, 0, CANVAS_WIDTH - this.paddle.width);
  }

  private setPaddleX(clientX: number, canvasRect: DOMRect): void {
    const scale = CANVAS_WIDTH / canvasRect.width;
    const canvasX = (clientX - canvasRect.left) * scale;
    this.paddle.x = clamp(canvasX - this.paddle.width / 2, 0, CANVAS_WIDTH - this.paddle.width);

    if (this.status === 'ready') {
      this.ball.x = this.paddle.x + this.paddle.width / 2;
    }
  }

  setPaddleFromTouch(clientX: number, canvasRect: DOMRect): void {
    if (this.status === 'gameOver' || this.status === 'paused') return;
    this.setPaddleX(clientX, canvasRect);
  }

  private launchBall(): void {
    if (this.status === 'ready') {
      const speed = getBallSpeed(this.level);
      this.ball.vx = speed * 0.2 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.vy = -speed;
      this.status = 'playing';
    }
  }

  private togglePause(): void {
    if (this.status === 'gameOver' || this.status === 'levelClear') return;
    if (this.status === 'paused') {
      this.status = this.statusBeforePause;
    } else {
      this.statusBeforePause = this.status;
      this.status = 'paused';
    }
  }

  private loseLife(): void {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.status = 'gameOver';
      this.updateHighScore();
      return;
    }
    this.status = 'ready';
    this.paddle = createPaddle();
    this.ball = createBallOnPaddle(this.paddle);
  }

  private advanceLevel(): void {
    this.level += 1;
    this.bricks = createBricks(this.level);
    this.paddle = createPaddle();
    this.ball = createBallOnPaddle(this.paddle);
    this.status = 'ready';
  }

  private updateHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.score);
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function createPaddle(): Paddle {
  return {
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };
}

function createBall(): Ball {
  return { x: CANVAS_WIDTH / 2, y: PADDLE_Y - BALL_RADIUS, vx: 0, vy: 0, radius: BALL_RADIUS };
}

function createBallOnPaddle(paddle: Paddle): Ball {
  return {
    x: paddle.x + paddle.width / 2,
    y: paddle.y - BALL_RADIUS,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
  };
}

function createBricks(level: number): Brick[] {
  const pattern = getLevelPattern(level);
  const rows = pattern.split('\n');
  const bricks: Brick[] = [];

  for (let row = 0; row < BRICK_ROWS; row++) {
    const line = rows[row] ?? '';
    for (let col = 0; col < BRICK_COLS; col++) {
      if (line[col] !== '#') continue;
      bricks.push({
        x: BRICK_OFFSET_LEFT + col * (BRICK_WIDTH + BRICK_PADDING),
        y: BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        row,
        destroyed: false,
      });
    }
  }

  return bricks;
}

export type { BreakoutAction, BreakoutState };
