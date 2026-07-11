import { Link } from 'react-router-dom';
import type { GameDefinition } from '../games/types';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: GameDefinition;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.thumbnail} aria-hidden="true">
        {game.id === 'tetris'
          ? '🧱'
          : game.id === 'snake'
            ? '🐍'
            : game.id === 'breakout'
              ? '🏓'
              : game.id === '2048'
                ? '🔢'
                : game.id === 'flappy'
                  ? '🐦'
                  : '🎮'}
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{game.title}</h2>
        <p className={styles.description}>{game.description}</p>
        <Link to={`/games/${game.id}`} className={styles.playButton}>
          플레이
        </Link>
      </div>
    </article>
  );
}
