import type { Direction } from './engine/types';

const KEY_MAP: Record<string, Direction> = {
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
};

const SWIPE_THRESHOLD = 30;

export function setupKeyboard(onMove: (direction: Direction) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    const direction = KEY_MAP[event.key];
    if (!direction || event.repeat) return;

    event.preventDefault();
    onMove(direction);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

export function setupSwipe(
  element: HTMLElement,
  onMove: (direction: Direction) => void,
): () => void {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  const handleTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a')) {
      tracking = false;
      return;
    }

    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!tracking) return;
    tracking = false;

    const target = event.target as HTMLElement;
    if (target.closest('button, a')) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      onMove(dx > 0 ? 'right' : 'left');
    } else {
      onMove(dy > 0 ? 'down' : 'up');
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}
