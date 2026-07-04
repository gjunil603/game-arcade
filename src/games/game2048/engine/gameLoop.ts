import { loadHighScore, saveHighScore } from '../constants';
import { canMove, hasWinTile, initGrid, moveGrid, spawnTile } from './board';
import type { Direction, Game2048Action, Game2048State, Grid } from './types';

export class Game2048Engine {
  private grid: Grid = initGrid();
  private score = 0;
  private highScore = loadHighScore();
  private gameOver = false;
  private won = false;
  private keepPlaying = false;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.grid = initGrid();
    this.score = 0;
    this.highScore = loadHighScore();
    this.gameOver = false;
    this.won = false;
    this.keepPlaying = false;
  }

  getState(): Game2048State {
    return {
      grid: this.grid.map((row) => [...row]),
      score: this.score,
      highScore: this.highScore,
      gameOver: this.gameOver,
      won: this.won,
      keepPlaying: this.keepPlaying,
    };
  }

  dispatch(action: Game2048Action): boolean {
    if (action === 'keepPlaying') {
      this.keepPlaying = true;
      return true;
    }

    if (this.gameOver) return false;
    if (this.won && !this.keepPlaying) return false;

    const { grid, score, moved } = moveGrid(this.grid, action as Direction);
    if (!moved) return false;

    this.grid = spawnTile(grid);
    this.score += score;
    this.updateHighScore();

    if (!this.won && hasWinTile(this.grid)) {
      this.won = true;
    }

    if (!canMove(this.grid)) {
      this.gameOver = true;
    }

    return true;
  }

  private updateHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.score);
    }
  }
}

export type { Game2048Action, Game2048State };
