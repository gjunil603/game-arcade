import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function Layout({ children, title, showBack = false }: LayoutProps) {
  return (
    <div className={`${styles.layout}${showBack ? ` ${styles.gameLayout}` : ''}`}>
      <header className={`${styles.header}${showBack ? ` ${styles.gameHeader}` : ''}`}>
        {showBack ? (
          <Link to="/" className={styles.backLink}>
            ← 로비
          </Link>
        ) : (
          <Link to="/" className={styles.logo}>
            Game Arcade
          </Link>
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
      </header>
      <main className={`${styles.main}${showBack ? ` ${styles.gameMain}` : ''}`}>{children}</main>
    </div>
  );
}
