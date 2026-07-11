import {
  BIRD_RADIUS,
  BIRD_X,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GROUND_HEIGHT,
  PIPE_GAP,
  PIPE_MAX_TOP,
  PIPE_MIN_TOP,
  PIPE_WIDTH,
} from '../constants';
import type { Bird, Pipe } from './types';

export function createBird(y = CANVAS_HEIGHT / 2): Bird {
  return {
    x: BIRD_X,
    y,
    vy: 0,
    radius: BIRD_RADIUS,
  };
}

export function randomGapY(): number {
  return PIPE_MIN_TOP + Math.random() * (PIPE_MAX_TOP - PIPE_MIN_TOP);
}

export function createPipe(x = CANVAS_WIDTH + PIPE_WIDTH): Pipe {
  return {
    x,
    gapY: randomGapY(),
    scored: false,
  };
}

export function hitsCeilingOrGround(bird: Bird): boolean {
  const top = bird.y - bird.radius;
  const bottom = bird.y + bird.radius;
  return top <= 0 || bottom >= CANVAS_HEIGHT - GROUND_HEIGHT;
}

export function hitsPipe(bird: Bird, pipe: Pipe): boolean {
  const birdLeft = bird.x - bird.radius;
  const birdRight = bird.x + bird.radius;
  const birdTop = bird.y - bird.radius;
  const birdBottom = bird.y + bird.radius;

  const pipeLeft = pipe.x;
  const pipeRight = pipe.x + PIPE_WIDTH;
  const gapTop = pipe.gapY;
  const gapBottom = pipe.gapY + PIPE_GAP;

  if (birdRight < pipeLeft || birdLeft > pipeRight) return false;

  return birdTop < gapTop || birdBottom > gapBottom;
}

export function passesPipe(bird: Bird, pipe: Pipe): boolean {
  return !pipe.scored && bird.x > pipe.x + PIPE_WIDTH;
}
