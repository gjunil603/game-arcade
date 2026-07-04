const LINE_SCORES = [0, 100, 300, 500, 800];
const LINES_PER_LEVEL = 10;

export function calculateLineScore(linesCleared: number, level: number): number {
  return (LINE_SCORES[linesCleared] ?? 0) * level;
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
}
