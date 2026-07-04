export const LEVELS: string[] = [
  // Level 1 — full rows
  `
##########
##########
##########
##########
##########
##########
  `.trim(),
  // Level 2 — pyramid
  `
....##....
...####...
..######..
.########.
##########
##########
  `.trim(),
  // Level 3 — checkerboard gaps
  `
#.#.#.#.#.
.#.#.#.#.#
#.#.#.#.#.
.#.#.#.#.#
#.#.#.#.#.
.#.#.#.#.#
  `.trim(),
  // Level 4 — hollow center
  `
##########
#........#
#........#
#........#
#........#
##########
  `.trim(),
  // Level 5 — sparse
  `
#..#..#..#
..#..#..#.
#..#..#..#
..#..#..#.
#..#..#..#
..#..#..#.
  `.trim(),
];

export function getLevelPattern(level: number): string {
  return LEVELS[(level - 1) % LEVELS.length];
}
