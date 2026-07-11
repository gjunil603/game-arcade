import type { FlappyAction } from './engine/types';

export type TouchAction = FlappyAction;

export function setupKeyboard(onAction: (action: TouchAction) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;

    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
      event.preventDefault();
      onAction('flap');
      return;
    }

    if (event.key === 'p' || event.key === 'P' || event.key === 'Escape') {
      event.preventDefault();
      onAction('pause');
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

export function setupTap(element: HTMLElement, onFlap: () => void): () => void {
  const handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a')) return;
    event.preventDefault();
    onFlap();
  };

  element.addEventListener('pointerdown', handlePointerDown);
  return () => element.removeEventListener('pointerdown', handlePointerDown);
}
