export type Direction = 'up' | 'down' | 'left' | 'right';

export type Grid = number[][];

export interface Game2048State {
  grid: Grid;
  score: number;
  highScore: number;
  gameOver: boolean;
  won: boolean;
  keepPlaying: boolean;
}

export type Game2048Action = Direction | 'keepPlaying';
