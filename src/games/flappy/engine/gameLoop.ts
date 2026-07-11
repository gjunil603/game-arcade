import {
  FLAP_VELOCITY,
  GRAVITY,
  loadHighScore,
  MAX_FALL_SPEED,
  PIPE_SPAWN_INTERVAL,
  PIPE_SPEED,
  PIPE_WIDTH,
  saveHighScore,
} from '../constants';
import {
  createBird,
  createPipe,
  hitsCeilingOrGround,
  hitsPipe,
  passesPipe,
} from './physics';
import type { Bird, FlappyAction, FlappyState, FlappyStatus, Pipe } from './types';

const MAX_TICK_MS = 100;

export class FlappyEngine {
  private bird: Bird = createBird();
  private pipes: Pipe[] = [];
  private status: FlappyStatus = 'ready';
  private score = 0;
  private highScore = loadHighScore();
  private spawnTimer = 0;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.bird = createBird();
    this.pipes = [];
    this.status = 'ready';
    this.score = 0;
    this.highScore = loadHighScore();
    this.spawnTimer = 0;
  }

  getState(): FlappyState {
    return {
      bird: { ...this.bird },
      pipes: this.pipes.map((pipe) => ({ ...pipe })),
      status: this.status,
      score: this.score,
      highScore: this.highScore,
    };
  }

  tick(deltaMs: number): void {
    if (this.status !== 'playing') return;

    const dt = Math.min(deltaMs, MAX_TICK_MS) / 1000;

    this.bird.vy = Math.min(this.bird.vy + GRAVITY * dt, MAX_FALL_SPEED);
    this.bird.y += this.bird.vy * dt;

    for (const pipe of this.pipes) {
      pipe.x -= PIPE_SPEED * dt;
    }

    this.pipes = this.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -10);

    this.spawnTimer += dt;
    if (this.spawnTimer >= PIPE_SPAWN_INTERVAL) {
      this.spawnTimer = 0;
      this.pipes.push(createPipe());
    }

    for (const pipe of this.pipes) {
      if (passesPipe(this.bird, pipe)) {
        pipe.scored = true;
        this.score += 1;
        this.updateHighScore();
      }

      if (hitsPipe(this.bird, pipe)) {
        this.status = 'gameOver';
        return;
      }
    }

    if (hitsCeilingOrGround(this.bird)) {
      this.status = 'gameOver';
    }
  }

  dispatch(action: FlappyAction): void {
    if (action === 'pause') {
      if (this.status === 'playing') this.status = 'paused';
      else if (this.status === 'paused') this.status = 'playing';
      return;
    }

    if (action === 'start' || action === 'flap') {
      if (this.status === 'ready') {
        this.status = 'playing';
        this.bird.vy = FLAP_VELOCITY;
        this.pipes = [createPipe()];
        this.spawnTimer = 0;
        return;
      }

      if (this.status === 'playing' && action === 'flap') {
        this.bird.vy = FLAP_VELOCITY;
      }
    }
  }

  private updateHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.score);
    }
  }
}

export type { FlappyAction, FlappyState };
