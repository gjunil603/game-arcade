import { BreakoutGame } from './breakout/BreakoutGame';
import { Game2048 } from './game2048/Game2048';
import { SnakeGame } from './snake/SnakeGame';
import { TetrisGame } from './tetris/TetrisGame';
import type { GameDefinition } from './types';

export const games: GameDefinition[] = [
  {
    id: 'tetris',
    title: '테트리스',
    description: '클래식 블록 퍼즐 게임. 줄을 채워 점수를 올리세요!',
    component: TetrisGame,
  },
  {
    id: 'snake',
    title: '스네이크',
    description: '사과를 먹으며 길어지는 뱀. 벽과 몸을 피하세요!',
    component: SnakeGame,
  },
  {
    id: 'breakout',
    title: '브레이크아웃',
    description: '패들로 공을 튕겨 벽돌을 모두 부수세요!',
    component: BreakoutGame,
  },
  {
    id: '2048',
    title: '2048',
    description: '같은 숫자를 합쳐 2048 타일을 만드세요!',
    component: Game2048,
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return games.find((game) => game.id === id);
}
