import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TetrisEngine, type TetrisState } from './engine/gameLoop';
import { setupKeyboard, type TouchAction } from './input';
import { renderBoard, renderNextPiece } from './renderer';
import styles from './TetrisGame.module.css';

const initialHud: TetrisState = {
  board: [],
  activePiece: null,
  nextPiece: 'I',
  ghostPiece: null,
  score: 0,
  level: 1,
  lines: 0,
  paused: false,
  gameOver: false,
};

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<TetrisEngine | null>(null);
  const [hud, setHud] = useState<TetrisState>(initialHud);

  const syncState = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    setHud(engine.getState());
  }, []);

  const dispatch = useCallback(
    (action: TouchAction) => {
      engineRef.current?.dispatch(action);
      syncState();
    },
    [syncState],
  );

  const restart = useCallback(() => {
    engineRef.current?.reset();
    syncState();
  }, [syncState]);

  useEffect(() => {
    const engine = new TetrisEngine();
    engineRef.current = engine;
    setHud(engine.getState());

    let lastTime = performance.now();
    let frameId = 0;

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      engine.tick(delta);

      const state = engine.getState();
      const canvas = canvasRef.current;
      const nextCanvas = nextCanvasRef.current;

      if (canvas) {
        renderBoard(canvas, state.board, state.activePiece, state.ghostPiece);
      }

      if (nextCanvas) {
        renderNextPiece(nextCanvas, state.nextPiece);
      }

      setHud(state);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    const cleanupKeyboard = setupKeyboard((action) => {
      engine.dispatch(action);
      setHud(engine.getState());
    });

    return () => {
      cancelAnimationFrame(frameId);
      cleanupKeyboard();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>
        <div className={styles.boardWrapper}>
          <canvas ref={canvasRef} className={styles.board} aria-label="테트리스 보드" />
          {hud.paused && !hud.gameOver && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>일시정지</p>
              <p className={styles.overlayHint}>P 또는 Esc로 계속</p>
            </div>
          )}
          {hud.gameOver && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>게임 오버</p>
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

        <aside className={styles.sidebar}>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>점수</span>
            <span className={styles.statValue}>{hud.score.toLocaleString()}</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>레벨</span>
            <span className={styles.statValue}>{hud.level}</span>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statLabel}>줄</span>
            <span className={styles.statValue}>{hud.lines}</span>
          </div>
          <div className={styles.nextBlock}>
            <span className={styles.statLabel}>다음</span>
            <canvas ref={nextCanvasRef} className={styles.nextCanvas} aria-label="다음 블록" />
          </div>
          <div className={styles.controlsHelp}>
            <p>← → 이동</p>
            <p>↑ 회전</p>
            <p>↓ 소프트 드롭</p>
            <p>Space 하드 드롭</p>
            <p>P / Esc 일시정지</p>
          </div>
        </aside>
      </div>

      <div className={styles.touchControls}>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('moveLeft')}>
          ←
        </button>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('rotate')}>
          ↻
        </button>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('moveRight')}>
          →
        </button>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('softDrop')}>
          ↓
        </button>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('hardDrop')}>
          ⬇
        </button>
        <button type="button" className={styles.touchButton} onClick={() => dispatch('pause')}>
          ⏸
        </button>
      </div>
    </div>
  );
}
