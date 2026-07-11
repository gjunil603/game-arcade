import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  GROUND_HEIGHT,
  PIPE_GAP,
  PIPE_WIDTH,
} from './constants';
import type { FlappyState } from './engine/types';

function drawSky(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, COLORS.skyTop);
  gradient.addColorStop(1, COLORS.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGround(ctx: CanvasRenderingContext2D): void {
  const y = CANVAS_HEIGHT - GROUND_HEIGHT;
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, y, CANVAS_WIDTH, GROUND_HEIGHT);
  ctx.fillStyle = COLORS.groundDark;
  ctx.fillRect(0, y, CANVAS_WIDTH, 8);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  for (let x = 0; x < CANVAS_WIDTH; x += 24) {
    ctx.fillRect(x, y + 16, 12, 8);
  }
}

function drawPipe(ctx: CanvasRenderingContext2D, x: number, gapY: number): void {
  const topHeight = gapY;
  const bottomY = gapY + PIPE_GAP;
  const bottomHeight = CANVAS_HEIGHT - GROUND_HEIGHT - bottomY;

  ctx.fillStyle = COLORS.pipe;
  ctx.strokeStyle = COLORS.pipeBorder;
  ctx.lineWidth = 3;

  // Top pipe
  ctx.fillRect(x, 0, PIPE_WIDTH, topHeight);
  ctx.strokeRect(x, 0, PIPE_WIDTH, topHeight);
  ctx.fillRect(x - 4, topHeight - 24, PIPE_WIDTH + 8, 24);
  ctx.strokeRect(x - 4, topHeight - 24, PIPE_WIDTH + 8, 24);

  // Bottom pipe
  ctx.fillRect(x, bottomY, PIPE_WIDTH, bottomHeight);
  ctx.strokeRect(x, bottomY, PIPE_WIDTH, bottomHeight);
  ctx.fillRect(x - 4, bottomY, PIPE_WIDTH + 8, 24);
  ctx.strokeRect(x - 4, bottomY, PIPE_WIDTH + 8, 24);
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, vy: number): void {
  const tilt = Math.max(-0.6, Math.min(0.9, vy / 600));

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);

  ctx.fillStyle = COLORS.bird;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius + 2, radius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.birdWing;
  ctx.beginPath();
  ctx.ellipse(-4, 2, radius * 0.55, radius * 0.35, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.birdEye;
  ctx.beginPath();
  ctx.arc(6, -4, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.birdPupil;
  ctx.beginPath();
  ctx.arc(7, -4, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.birdBeak;
  ctx.beginPath();
  ctx.moveTo(radius - 2, -1);
  ctx.lineTo(radius + 10, 2);
  ctx.lineTo(radius - 2, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function renderBoard(canvas: HTMLCanvasElement, state: FlappyState): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  drawSky(ctx);

  for (const pipe of state.pipes) {
    drawPipe(ctx, pipe.x, pipe.gapY);
  }

  drawGround(ctx);
  drawBird(ctx, state.bird.x, state.bird.y, state.bird.radius, state.bird.vy);
}
