import { useState } from 'react';
import './styles/index.css';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import NCDDetailPage from './pages/NCDDetailPage';

export default function App() {
  const [view, setView] = useState({ page: 'home', program: null, division: null });

  const goToDetail = (program, division) => {
    if (division && division.id === 'rch') {
      setView({ page: 'rch', program, division });
      window.scrollTo(0, 0);
    } else {
      setView({ page: 'detail', program, division });
      window.scrollTo(0, 0);
    }
  };

  const goHome = () => {
    setView({ page: 'home', program: null, division: null });
  };

  if (view.page === 'rch') {
    return <NCDDetailPage program={view.program} onBack={goHome} />;
  }

  return view.page === 'home'
    ? <HomePage onSelectProgram={goToDetail} />
    : <DetailPage program={view.program} division={view.division} onBack={goHome} />;
}
