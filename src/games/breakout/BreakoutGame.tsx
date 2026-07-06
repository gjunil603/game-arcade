import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BreakoutEngine, type BreakoutState } from './engine/gameLoop';
import { setupKeyboard, setupTouchPaddle, type TouchAction } from './input';
import { renderBoard } from './renderer';
import styles from './BreakoutGame.module.css';

const initialHud: BreakoutState = {
  ball: { x: 0, y: 0, vx: 0, vy: 0, radius: 7 },
  paddle: { x: 0, y: 0, width: 80, height: 14 },
  bricks: [],
  status: 'ready',
  score: 0,
  level: 1,
  lives: 3,
  highScore: 0,
};

export function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<BreakoutEngine | null>(null);
  const [hud, setHud] = useState<BreakoutState>(initialHud);

  const syncHud = useCallback((state: BreakoutState) => {
    setHud(state);
  }, []);

  const dispatch = useCallback(
    (action: TouchAction) => {
      engineRef.current?.dispatch(action);
      if (engineRef.current) syncHud(engineRef.current.getState());
    },
    [syncHud],
  );

  const restart = useCallback(() => {
    engineRef.current?.reset();
    if (engineRef.current) setHud(engineRef.current.getState());
  }, []);

  useEffect(() => {
    const engine = new BreakoutEngine();
    engineRef.current = engine;

    let lastTime = performance.now();
    let frameId = 0;
    let lastHudKey = '';
    let running = true;

    const updateHud = (state: BreakoutState) => {
      const key = `${state.score}|${state.level}|${state.lives}|${state.highScore}|${state.status}`;
      if (key === lastHudKey) return;
      lastHudKey = key;
      setHud(state);
    };

    setHud(engine.getState());

    const loop = (time: number) => {
      if (!running) return;

      const delta = time - lastTime;
      lastTime = time;
      engine.tick(delta);

      const state = engine.getState();
      const canvas = canvasRef.current;
      if (canvas) renderBoard(canvas, state);

      updateHud(state);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    const cleanupKeyboard = setupKeyboard((action) => {
      engine.dispatch(action);
      updateHud(engine.getState());
    });

    const canvas = canvasRef.current;

    const cleanupTouch = canvas
      ? setupTouchPaddle(
          canvas,
          (clientX) => {
            const status = engine.getState().status;
            if (status === 'gameOver' || status === 'paused' || status === 'levelClear') return;
            engine.setPaddleFromTouch(clientX, canvas.getBoundingClientRect());
            updateHud(engine.getState());
          },
          () => {
            const status = engine.getState().status;
            if (status !== 'ready') return;
            engine.dispatch('launch');
            updateHud(engine.getState());
          },
        )
      : () => {};

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      cleanupKeyboard();
      cleanupTouch();
      engineRef.current = null;
    };
  }, []);

  const showPause = hud.status === 'paused';
  const showGameOver = hud.status === 'gameOver';
  const showLevelClear = hud.status === 'levelClear';
  const showReady = hud.status === 'ready';

  return (
    <div className={`${styles.container} game-shell game-shell--breakout`}>
      <div className={`${styles.gameArea} game-area`}>
        <div className={`${styles.boardWrapper} game-board-wrap`} ref={boardWrapperRef}>
          <canvas ref={canvasRef} className={`${styles.board} game-board`} aria-label="브레이크아웃 보드" />
          {showPause && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>일시정지</p>
              <p className={styles.overlayHint}>P 또는 Esc로 계속</p>
            </div>
          )}
          {showGameOver && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>게임 오버</p>
              <p className={styles.overlayHint}>점수: {hud.score.toLocaleString()}</p>
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
          {showLevelClear && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>레벨 클리어!</p>
              <p className={styles.overlayHint}>레벨 {hud.level} 완료</p>
            </div>
          )}
          {showReady && !showGameOver && (
            <div className={styles.overlay} style={{ background: 'transparent', pointerEvents: 'none' }}>
              <p className={styles.overlayHint} style={{ marginTop: 'auto', marginBottom: '4rem' }}>
                Space 또는 탭으로 공 발사
              </p>
            </div>
          )}
        </div>

        <aside className={`${styles.sidebar} game-sidebar`}>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>점수</span>
            <span className={styles.statValue}>{hud.score.toLocaleString()}</span>
          </div>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>레벨</span>
            <span className={styles.statValue}>{hud.level}</span>
          </div>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>생명</span>
            <span className={styles.statValue}>{'❤'.repeat(hud.lives) || '0'}</span>
          </div>
          <div className={`${styles.statBlock} stat-block`}>
            <span className={styles.statLabel}>최고</span>
            <span className={styles.statValue}>{hud.highScore.toLocaleString()}</span>
          </div>
          <div className={`${styles.controlsHelp} controls-help`}>
            <p>← → / A D 패들 이동</p>
            <p>Space 공 발사</p>
            <p>P / Esc 일시정지</p>
            <p>모바일: 드래그 + 탭</p>
          </div>
        </aside>
      </div>

      {!showLevelClear && !showGameOver && (
        <div className={`${styles.touchControls} game-touch game-touch--breakout`}>
          <button
            type="button"
            className={`${styles.touchButton} touch-btn`}
            onPointerDown={() => dispatch('moveLeft')}
            onPointerUp={() => dispatch('moveLeftEnd')}
            onPointerLeave={() => dispatch('moveLeftEnd')}
            onPointerCancel={() => dispatch('moveLeftEnd')}
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.touchButton} touch-btn`}
            onPointerDown={() => dispatch('moveRight')}
            onPointerUp={() => dispatch('moveRightEnd')}
            onPointerLeave={() => dispatch('moveRightEnd')}
            onPointerCancel={() => dispatch('moveRightEnd')}
          >
            →
          </button>
          <button
            type="button"
            className={`${styles.touchButton} ${styles.touchLaunch} touch-btn touch-launch`}
            onClick={() => {
              if (hud.status === 'ready') dispatch('launch');
              else if (hud.status === 'playing') dispatch('pause');
              else if (hud.status === 'paused') dispatch('pause');
            }}
          >
            {hud.status === 'ready' ? '🚀 발사' : hud.status === 'paused' ? '▶ 계속' : '⏸'}
          </button>
        </div>
      )}
    </div>
  );
}
