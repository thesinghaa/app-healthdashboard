import { useState } from 'react';
import './styles/index.css';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import KDProgrammePage from './pages/KDProgrammePage';
import KDIndicatorDetail from './pages/KDIndicatorDetail';

export default function App() {
  const [view, setView] = useState({
    page: 'home',
    program: null,
    division: null,
    indicator: null,
  });

  const goToDetail = (program, division) => {
    // All divisions now have KD data — always go to kd-list
    setView({ page: 'kd-list', program, division, indicator: null });
    window.scrollTo(0, 0);
  };

  const goToIndicator = (indicator) => {
    setView((prev) => ({ ...prev, page: 'kd-indicator', indicator }));
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setView({ page: 'home', program: null, division: null, indicator: null });
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (view.page === 'kd-indicator') {
      setView((prev) => ({ ...prev, page: 'kd-list', indicator: null }));
      window.scrollTo(0, 0);
    } else if (view.page === 'kd-list' || view.page === 'detail') {
      goHome();
    } else {
      goHome();
    }
  };

  if (view.page === 'home') {
    return <HomePage onSelectProgram={goToDetail} />;
  }

  if (view.page === 'kd-list') {
    return (
      <KDProgrammePage
        program={view.program}
        division={view.division}
        onBack={goHome}
        onSelectIndicator={goToIndicator}
      />
    );
  }

  if (view.page === 'kd-indicator') {
    return (
      <KDIndicatorDetail
        indicator={view.indicator}
        program={view.program}
        division={view.division}
        onBack={goBack}
      />
    );
  }

  // 'detail' — legacy fallback, kept for any non-KD programmes
  return (
    <DetailPage
      program={view.program}
      division={view.division}
      onBack={goHome}
    />
  );
}
