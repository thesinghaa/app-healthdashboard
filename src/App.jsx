import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

export default function App() {
  const [view, setView] = useState({ page: 'home', program: null, division: null });

  const goToDetail = (program, division) => {
    setView({ page: 'detail', program, division });
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView({ page: 'home', program: null, division: null });
  };

  return view.page === 'home'
    ? <HomePage onSelectProgram={goToDetail} />
    : <DetailPage program={view.program} division={view.division} onBack={goHome} />;
}
