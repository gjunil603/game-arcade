import type { BreakoutAction } from './engine/gameLoop';

const KEY_DOWN_MAP: Record<string, BreakoutAction> = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  a: 'moveLeft',
  A: 'moveLeft',
  d: 'moveRight',
  D: 'moveRight',
};

const KEY_UP_MAP: Record<string, BreakoutAction> = {
  ArrowLeft: 'moveLeftEnd',
  ArrowRight: 'moveRightEnd',
  a: 'moveLeftEnd',
  A: 'moveLeftEnd',
  d: 'moveRightEnd',
  D: 'moveRightEnd',
};

const NO_REPEAT = new Set<BreakoutAction>(['pause', 'launch']);
const TAP_THRESHOLD = 10;

interface PointerState {
  startX: number;
  startY: number;
  moved: boolean;
}

export function setupKeyboard(onAction: (action: BreakoutAction) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (!event.repeat) onAction('launch');
      return;
    }

    if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
      event.preventDefault();
      if (!event.repeat) onAction('pause');
      return;
    }

    const action = KEY_DOWN_MAP[event.key];
    if (!action) return;
    if (event.repeat && NO_REPEAT.has(action)) return;

    event.preventDefault();
    onAction(action);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const action = KEY_UP_MAP[event.key];
    if (!action) return;
    event.preventDefault();
    onAction(action);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}

export function setupTouchPaddle(
  element: HTMLElement,
  onMove: (clientX: number) => void,
  onTap: () => void,
): () => void {
  const pointers = new Map<number, PointerState>();

  const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a')) return;

    pointers.set(event.pointerId, {
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    });
    element.setPointerCapture(event.pointerId);
    onMove(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const pointer = pointers.get(event.pointerId);
    if (!pointer) return;

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;
    if (Math.hypot(dx, dy) > TAP_THRESHOLD) {
      pointer.moved = true;
    }

    onMove(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent) => {
    const pointer = pointers.get(event.pointerId);
    if (pointer && !pointer.moved) onTap();
    pointers.delete(event.pointerId);
  };

  element.addEventListener('pointerdown', handlePointerDown);
  element.addEventListener('pointermove', handlePointerMove);
  element.addEventListener('pointerup', handlePointerUp);
  element.addEventListener('pointercancel', handlePointerUp);

  return () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    element.removeEventListener('pointermove', handlePointerMove);
    element.removeEventListener('pointerup', handlePointerUp);
    element.removeEventListener('pointercancel', handlePointerUp);
  };
}

export type TouchAction = BreakoutAction;
