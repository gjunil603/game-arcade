import { GameCard } from '../components/GameCard';
import { Layout } from '../components/Layout';
import { games } from '../games/registry';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <Layout>
      <section className={styles.hero}>
        <h1 className={styles.heading}>Game Arcade</h1>
        <p className={styles.subtitle}>클래식 게임을 브라우저에서 즐겨보세요</p>
      </section>
      <div className={styles.grid}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </Layout>
  );
}
