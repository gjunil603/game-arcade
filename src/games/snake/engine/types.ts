export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export interface SnakeState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  highScore: number;
  paused: boolean;
  gameOver: boolean;
  won: boolean;
}

export type SnakeAction = 'up' | 'down' | 'left' | 'right' | 'pause';

export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const DIRECTION_DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
