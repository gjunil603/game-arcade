import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Game2048Engine, type Game2048State } from './engine/gameLoop';
import type { Direction } from './engine/types';
import { setupKeyboard, setupSwipe } from './input';
import { renderBoard } from './renderer';
import styles from './Game2048.module.css';

const initialHud: Game2048State = {
  grid: [],
  score: 0,
  highScore: 0,
  gameOver: false,
  won: false,
  keepPlaying: false,
};

export function Game2048() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Game2048Engine | null>(null);
  const [hud, setHud] = useState<Game2048State>(initialHud);

  const renderAndSync = useCallback((engine: Game2048Engine) => {
    const state = engine.getState();
    const canvas = canvasRef.current;
    if (canvas) renderBoard(canvas, state.grid);
    setHud(state);
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      const engine = engineRef.current;
      if (!engine) return;
      engine.dispatch(direction);
      renderAndSync(engine);
    },
    [renderAndSync],
  );

  const restart = useCallback(() => {
    engineRef.current?.reset();
    if (engineRef.current) renderAndSync(engineRef.current);
  }, [renderAndSync]);

  const keepPlaying = useCallback(() => {
    engineRef.current?.dispatch('keepPlaying');
    if (engineRef.current) renderAndSync(engineRef.current);
  }, [renderAndSync]);

  useEffect(() => {
    const engine = new Game2048Engine();
    engineRef.current = engine;
    renderAndSync(engine);

    const cleanupKeyboard = setupKeyboard(handleMove);
    const wrapper = boardWrapperRef.current;
    const cleanupSwipe = wrapper ? setupSwipe(wrapper, handleMove) : () => {};

    return () => {
      cleanupKeyboard();
      cleanupSwipe();
      engineRef.current = null;
    };
  }, [handleMove, renderAndSync]);

  const showWin = hud.won && !hud.keepPlaying;
  const showGameOver = hud.gameOver && !showWin;

  return (
    <div className={`${styles.container} game-shell game-shell--game2048`}>
      <div className={`${styles.gameArea} game-area`}>
        <div className={`${styles.boardWrapper} game-board-wrap`} ref={boardWrapperRef}>
          <canvas ref={canvasRef} className={`${styles.board} game-board`} aria-label="2048 보드" />
          {showWin && (
            <div className={styles.overlay}>
              <p className={styles.overlayTitle}>승리!</p>
              <p className={styles.overlayHint}>
                {hud.gameOver
                  ? '2048 타일을 만들었지만 더 이상 움직일 수 없습니다!'
                  : '2048 타일을 만들었습니다!'}
              </p>
              <div className={styles.overlayActions}>
                <button type="button" className={styles.primaryButton} onClick={keepPlaying}>
                  계속하기
                </button>
                <button type="button" className={styles.secondaryButton} onClick={restart}>
                  재시작
                </button>
              </div>
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
            <p>↑↓←→ / WASD 이동</p>
            <p>모바일: 스와이프</p>
            <p>같은 숫자를 합쳐 2048!</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
