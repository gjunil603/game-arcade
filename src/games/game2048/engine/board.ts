import { GRID_SIZE, WIN_TILE } from '../constants';
import type { Direction, Grid } from './types';

export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

function slideAndMergeLine(line: number[]): { line: number[]; score: number } {
  const filtered = line.filter((v) => v !== 0);
  const result: number[] = [];
  let score = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      score += merged;
      i += 2;
    } else {
      result.push(filtered[i]);
      i += 1;
    }
  }

  while (result.length < GRID_SIZE) result.push(0);
  return { line: result, score };
}

function getRow(grid: Grid, index: number, direction: Direction): number[] {
  if (direction === 'left') return [...grid[index]];
  if (direction === 'right') return [...grid[index]].reverse();
  if (direction === 'up') return grid.map((row) => row[index]);
  return grid.map((row) => row[index]).reverse();
}

function setRow(grid: Grid, index: number, direction: Direction, line: number[]): void {
  if (direction === 'left') {
    grid[index] = line;
  } else if (direction === 'right') {
    grid[index] = [...line].reverse();
  } else if (direction === 'up') {
    for (let r = 0; r < GRID_SIZE; r++) grid[r][index] = line[r];
  } else {
    const reversed = [...line].reverse();
    for (let r = 0; r < GRID_SIZE; r++) grid[r][index] = reversed[r];
  }
}

export function moveGrid(grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean } {
  const next = grid.map((row) => [...row]);
  let totalScore = 0;

  for (let i = 0; i < GRID_SIZE; i++) {
    const line = getRow(next, i, direction);
    const { line: merged, score } = slideAndMergeLine(line);
    totalScore += score;
    setRow(next, i, direction, merged);
  }

  return { grid: next, score: totalScore, moved: !gridsEqual(grid, next) };
}

export function spawnTile(grid: Grid): Grid {
  const empty: { r: number; c: number }[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return grid;

  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

export function initGrid(): Grid {
  return spawnTile(spawnTile(createEmptyGrid()));
}

export function canMove(grid: Grid): boolean {
  for (const direction of ['up', 'down', 'left', 'right'] as Direction[]) {
    if (moveGrid(grid, direction).moved) return true;
  }
  return false;
}

export function hasWinTile(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] >= WIN_TILE) return true;
    }
  }
  return false;
}
