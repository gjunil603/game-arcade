import type { TetrisAction } from './engine/gameLoop';

const KEY_MAP: Record<string, TetrisAction> = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowUp: 'rotate',
  ArrowDown: 'softDrop',
  ' ': 'hardDrop',
  p: 'pause',
  P: 'pause',
  Escape: 'pause',
};

const NO_REPEAT_ACTIONS = new Set<TetrisAction>(['pause', 'hardDrop', 'rotate']);

export function setupKeyboard(onAction: (action: TetrisAction) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    const action = KEY_MAP[event.key];
    if (!action) return;
    if (event.repeat && NO_REPEAT_ACTIONS.has(action)) return;

    event.preventDefault();
    onAction(action);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

export type TouchAction = TetrisAction;
