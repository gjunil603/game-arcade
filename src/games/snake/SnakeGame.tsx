import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SnakeEngine, type SnakeState } from './engine/gameLoop';
import { setupKeyboard, setupSwipe, type TouchAction } from './input';
import { renderBoard } from './renderer';
import styles from './SnakeGame.module.css';

const initialHud: SnakeState = {
  snake: [],
  food: { x: 0, y: 0 },
  direction: 'right',
  score: 0,
  highScore: 0,
  paused: false,
  gameOver: false,
  won: false,
};

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SnakeEngine | null>(null);
  const [hud, setHud] = useState<SnakeState>(initialHud);

  const dispatch = useCallback((action: TouchAction) => {
    engineRef.current?.dispatch(action);
    if (engineRef.current) setHud(engineRef.current.getState());
  }, []);

  const restart = useCallback(() => {
    engineRef.current?.reset();
    if (engineRef.current) setHud(engineRef.current.getState());
  }, []);

  useEffect(() => {
    const engine = new SnakeEngine();
    engineRef.current = engine;
    setHud(engine.getState());

    let lastTime = performance.now();
    let frameId = 0;
    let lastHudKey = '';
    let running = true;

    const syncHud = (state: SnakeState) => {
      const key = `${state.score}|${state.snake.length}|${state.highScore}|${state.paused}|${state.gameOver}|${state.won}`;
      if (key === lastHudKey) return;
      lastHudKey = key;
      setHud(state);
    };

    const loop = (time: number) => {
      if (!running) return;

      const delta = time - lastTime;
      lastTime = time;
      engine.tick(delta);

      const state = engine.getState();
      const canvas = canvasRef.current;
      if (canvas) {
        renderBoard(canvas, state.snake, state.food.x >= 0 ? state.food : null);
      }

      syncHud(state);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    const cleanupKeyboard = setupKeyboard((action) => {
      engine.dispatch(action);
      setHud(engine.getState());
    });

    const wrapper = boardWrapperRef.current;
    const cleanupSwipe = wrapper ? setupSwipe(wrapper, (action) => {
      engine.dispatch(action);
      setHud(engine.getState());
    }) : () => {};

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      cleanupKeyboard();
      cleanupSwipe();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className={`${styles.container} game-shell game-shell--snake`}>
      <div className={`${styles.gameArea} game-area`}>
        <div className={styles.boardWrapper} ref={boardWrapperRef}>
          <canvas ref={canvasRef} className={`${styles.board} game-board`} aria-label="스네이크 보드" />
          {hud.paused && !hud.gameOver && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>일시정지</p>
              <p className={styles.overlayHint}>P 또는 Esc로 계속</p>
            </div>
          )}
          {hud.gameOver && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>{hud.won ? '승리!' : '게임 오버'}</p>
              <p className={styles.overlayHint}>
                {hud.won
                  ? `보드를 가득 채웠습니다! 점수: ${hud.score.toLocaleString()}`
                  : `점수: ${hud.score.toLocaleString()}`}
              </p>
              <div className={styles.overlayActions}>
                <button type="button" className={styles.primaryButton} onClick={restart}>
                  재시작
                </button>
                <Link to="/" className={styles.secondaryButton}>
                  로비로
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className={`${styles.sidebar} game-sidebar`}>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>점수</span>
            <span className={styles.statValue}>{hud.score.toLocaleString()}</span>
          </div>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>길이</span>
            <span className={styles.statValue}>{hud.snake.length}</span>
          </div>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>최고</span>
            <span className={styles.statValue}>{hud.highScore.toLocaleString()}</span>
          </div>
          <div className={`${styles.controlsHelp} controls-help`}>
            <p>↑↓←→ / WASD 이동</p>
            <p>모바일: 스와이프</p>
            <p>P / Esc 일시정지</p>
          </div>
        </aside>
      </div>

      <div className={`${styles.touchControls} game-touch`}>
        <button type="button" className={`${styles.touchButton} ${styles.touchUp} touch-btn`} onClick={() => dispatch('up')}>
          ↑
        </button>
        <button type="button" className={`${styles.touchButton} ${styles.touchLeft} touch-btn`} onClick={() => dispatch('left')}>
          ←
        </button>
        <button type="button" className={`${styles.touchButton} ${styles.touchRight} touch-btn`} onClick={() => dispatch('right')}>
          →
        </button>
        <button type="button" className={`${styles.touchButton} ${styles.touchDown} touch-btn`} onClick={() => dispatch('down')}>
          ↓
        </button>
        <button type="button" className={`${styles.touchButton} ${styles.touchPause} touch-btn`} onClick={() => dispatch('pause')}>
          ⏸ 일시정지
        </button>
      </div>
    </div>
  );
}
