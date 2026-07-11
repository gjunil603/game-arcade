export type FlappyStatus = 'ready' | 'playing' | 'paused' | 'gameOver';

export type FlappyAction = 'flap' | 'pause' | 'start';

export interface Bird {
  x: number;
  y: number;
  vy: number;
  radius: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

export interface FlappyState {
  bird: Bird;
  pipes: Pipe[];
  status: FlappyStatus;
  score: number;
  highScore: number;
}
