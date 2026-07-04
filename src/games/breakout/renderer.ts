import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS } from './constants';
import type { Ball, BreakoutState, Brick, Paddle } from './engine/types';

export function renderBoard(canvas: HTMLCanvasElement, state: BreakoutState): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBricks(ctx, state.bricks);
  drawPaddle(ctx, state.paddle);
  drawBall(ctx, state.ball);
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle): void {
  ctx.fillStyle = COLORS.paddle;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
  ctx.fill();
}

function drawBricks(ctx: CanvasRenderingContext2D, bricks: Brick[]): void {
  for (const brick of bricks) {
    if (brick.destroyed) continue;
    ctx.fillStyle = COLORS.brickRows[brick.row % COLORS.brickRows.length];
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.stroke();
  }
}
