export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  destroyed: boolean;
}

export type GameStatus = 'ready' | 'playing' | 'paused' | 'levelClear' | 'gameOver';

export interface BreakoutState {
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  status: GameStatus;
  score: number;
  level: number;
  lives: number;
  highScore: number;
}

export type BreakoutAction =
  | 'moveLeft'
  | 'moveRight'
  | 'moveLeftEnd'
  | 'moveRightEnd'
  | 'launch'
  | 'pause';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
