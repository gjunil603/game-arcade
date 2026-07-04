import { Navigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getGameById } from '../games/registry';

export function GamePage() {
  const { id } = useParams<{ id: string }>();
  const game = id ? getGameById(id) : undefined;

  if (!game) {
    return <Navigate to="/" replace />;
  }

  const GameComponent = game.component;

  return (
    <Layout title={game.title} showBack>
      <GameComponent />
    </Layout>
  );
}
