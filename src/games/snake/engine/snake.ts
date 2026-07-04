import { GRID_SIZE } from '../constants';
import type { Direction, Point } from './types';
import { DIRECTION_DELTA } from './types';

export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isOutOfBounds({ x, y }: Point): boolean {
  return x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE;
}

export function getNextHead(head: Point, direction: Direction): Point {
  const delta = DIRECTION_DELTA[direction];
  return { x: head.x + delta.x, y: head.y + delta.y };
}

export function isOnSnake(point: Point, snake: Point[]): boolean {
  return snake.some((segment) => pointsEqual(segment, point));
}

export function spawnFood(snake: Point[]): Point | null {
  const occupied = new Set(snake.map(({ x, y }) => `${x},${y}`));
  const empty: Point[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }

  if (empty.length === 0) return null;

  return empty[Math.floor(Math.random() * empty.length)];
}

export function createInitialSnake(): Point[] {
  const center = Math.floor(GRID_SIZE / 2);
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];
}
