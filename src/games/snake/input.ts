import type { SnakeAction } from './engine/gameLoop';

const KEY_MAP: Record<string, SnakeAction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
  p: 'pause',
  P: 'pause',
  Escape: 'pause',
};

const NO_REPEAT_ACTIONS = new Set<SnakeAction>(['pause']);

export function setupKeyboard(onAction: (action: SnakeAction) => void): () => void {
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

const SWIPE_THRESHOLD = 30;

export function setupSwipe(
  element: HTMLElement,
  onAction: (action: SnakeAction) => void,
): () => void {
  let startX = 0;
  let startY = 0;

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      onAction(dx > 0 ? 'right' : 'left');
    } else {
      onAction(dy > 0 ? 'down' : 'up');
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

export type TouchAction = SnakeAction;
