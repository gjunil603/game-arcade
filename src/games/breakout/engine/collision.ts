import type { Ball, Brick, Paddle, Rect } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function circleRectOverlap(ball: Ball, rect: Rect): boolean {
  const closestX = clamp(ball.x, rect.x, rect.x + rect.width);
  const closestY = clamp(ball.y, rect.y, rect.y + rect.height);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy < ball.radius * ball.radius;
}

export function resolveWallCollision(
  ball: Ball,
  width: number,
  height: number,
): 'left' | 'right' | 'top' | 'bottom' | null {
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx);
    return 'left';
  }
  if (ball.x + ball.radius >= width) {
    ball.x = width - ball.radius;
    ball.vx = -Math.abs(ball.vx);
    return 'right';
  }
  if (ball.y - ball.radius <= 0) {
    ball.y = ball.radius;
    ball.vy = Math.abs(ball.vy);
    return 'top';
  }
  if (ball.y + ball.radius >= height) {
    return 'bottom';
  }
  return null;
}

export function resolvePaddleCollision(ball: Ball, paddle: Paddle): boolean {
  const rect: Rect = { x: paddle.x, y: paddle.y, width: paddle.width, height: paddle.height };

  if (!circleRectOverlap(ball, rect) || ball.vy <= 0) return false;

  ball.y = paddle.y - ball.radius;

  const hitPos = (ball.x - paddle.x) / paddle.width - 0.5;
  const clampedHit = clamp(hitPos, -0.5, 0.5);
  const speed = Math.hypot(ball.vx, ball.vy);
  const angle = clampedHit * Math.PI * 0.75;
  ball.vx = speed * Math.sin(angle);
  ball.vy = -Math.abs(speed * Math.cos(angle));

  return true;
}

export function resolveBrickCollision(ball: Ball, brick: Brick): boolean {
  if (brick.destroyed) return false;

  const rect: Rect = { x: brick.x, y: brick.y, width: brick.width, height: brick.height };
  if (!circleRectOverlap(ball, rect)) return false;

  const overlapLeft = ball.x + ball.radius - brick.x;
  const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
  const overlapTop = ball.y + ball.radius - brick.y;
  const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);

  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

  if (minOverlap === overlapLeft) {
    ball.x = brick.x - ball.radius;
    ball.vx = -Math.abs(ball.vx);
  } else if (minOverlap === overlapRight) {
    ball.x = brick.x + brick.width + ball.radius;
    ball.vx = Math.abs(ball.vx);
  } else if (minOverlap === overlapTop) {
    ball.y = brick.y - ball.radius;
    ball.vy = -Math.abs(ball.vy);
  } else {
    ball.y = brick.y + brick.height + ball.radius;
    ball.vy = Math.abs(ball.vy);
  }

  brick.destroyed = true;
  return true;
}
