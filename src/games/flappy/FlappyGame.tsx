import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlappyEngine, type FlappyState } from './engine/gameLoop';
import { setupKeyboard, setupTap, type TouchAction } from './input';
import { renderBoard } from './renderer';
import styles from './FlappyGame.module.css';

const initialHud: FlappyState = {
  bird: { x: 80, y: 320, vy: 0, radius: 14 },
  pipes: [],
  status: 'ready',
  score: 0,
  highScore: 0,
};

export function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FlappyEngine | null>(null);
  const [hud, setHud] = useState<FlappyState>(initialHud);

  const dispatch = useCallback((action: TouchAction) => {
    engineRef.current?.dispatch(action);
    if (engineRef.current) setHud(engineRef.current.getState());
  }, []);

  const restart = useCallback(() => {
    engineRef.current?.reset();
    if (engineRef.current) setHud(engineRef.current.getState());
  }, []);

  useEffect(() => {
    const engine = new FlappyEngine();
    engineRef.current = engine;

    let lastTime = performance.now();
    let frameId = 0;
    let lastHudKey = '';
    let running = true;

    const updateHud = (state: FlappyState) => {
      const key = `${state.score}|${state.highScore}|${state.status}`;
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

    const wrapper = boardWrapperRef.current;
    const cleanupTap = wrapper
      ? setupTap(wrapper, () => {
          const status = engine.getState().status;
          if (status === 'gameOver' || status === 'paused') return;
          engine.dispatch('flap');
          updateHud(engine.getState());
        })
      : () => {};

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      cleanupKeyboard();
      cleanupTap();
      engineRef.current = null;
    };
  }, []);

  const showPause = hud.status === 'paused';
  const showGameOver = hud.status === 'gameOver';
  const showReady = hud.status === 'ready';

  return (
    <div className={`${styles.container} game-shell game-shell--flappy`}>
      <div className={`${styles.gameArea} game-area`}>
        <div className={`${styles.boardWrapper} game-board-wrap`} ref={boardWrapperRef}>
          <canvas ref={canvasRef} className={`${styles.board} game-board`} aria-label="플래피 버드 보드" />
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
          {showReady && (
            <div className={styles.overlay} style={{ background: 'transparent', pointerEvents: 'none' }}>
              <p className={styles.overlayHint} style={{ marginTop: 'auto', marginBottom: '5rem' }}>
                Space / 탭으로 시작
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
            <span className={styles.statLabel}>최고</span>
            <span className={styles.statValue}>{hud.highScore.toLocaleString()}</span>
          </div>
          <div className={`${styles.controlsHelp} controls-help`}>
            <p>Space / ↑ / W 점프</p>
            <p>P / Esc 일시정지</p>
            <p>모바일: 탭 또는 버튼</p>
          </div>
        </aside>
      </div>

      {!showGameOver && (
        <div className={`${styles.touchControls} game-touch game-touch--flappy`}>
          <button
            type="button"
            className={`${styles.touchButton} ${styles.touchFlap} touch-btn`}
            onClick={() => {
              if (hud.status === 'paused') dispatch('pause');
              else dispatch('flap');
            }}
          >
            {hud.status === 'paused' ? '▶ 계속' : hud.status === 'ready' ? '🚀 시작' : '🪽 점프'}
          </button>
          {hud.status === 'playing' && (
            <button
              type="button"
              className={`${styles.touchButton} touch-btn`}
              onClick={() => dispatch('pause')}
            >
              ⏸ 일시정지
            </button>
          )}
        </div>
      )}
    </div>
  );
}
