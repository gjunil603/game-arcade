import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games/:id" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
