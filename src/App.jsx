import { useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './styles/index.css';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import KDProgrammePage from './pages/KDProgrammePage';
import KDIndicatorDetail from './pages/KDIndicatorDetail';

export default function App() {
  const [view, setView] = useState({
    page: 'home', program: null, division: null, indicator: null,
  });

  const pageRef  = useRef(null);
  const sheenRef = useRef(null);
  const viewRef  = useRef(view);
  viewRef.current = view;

  /* ── Glassmorphism flip transition ───────────────────────────────
     Phase 1 (0.35s): page rotates Y 0→90° (edge-on), sheen rises
     Midpoint: state swaps while page is invisible at 90°
     Phase 2 (0.38s): page rotates Y -90→0°, sheen drops
  ─────────────────────────────────────────────────────────────── */
  const flipTo = useCallback((newView) => {
    const page  = pageRef.current;
    const sheen = sheenRef.current;
    if (!page) { setView(newView); return; }

    gsap.killTweensOf([page, sheen]);

    /* Sheen rises during exit, drops during entry */
    gsap.to(sheen, {
      opacity: 1, duration: 0.28, ease: 'power2.in',
      onComplete: () =>
        gsap.to(sheen, { opacity: 0, duration: 0.32, ease: 'power2.out', delay: 0.05 }),
    });

    /* Exit — rotate page away */
    gsap.to(page, {
      rotateY: 90,
      scale: 0.96,
      duration: 0.35,
      ease: 'power2.in',
      transformOrigin: '50% 50%',
      onComplete: () => {
        /* Swap content while page is edge-on (invisible) */
        setView(newView);
        /* Entry — new content rotates in */
        gsap.fromTo(page,
          { rotateY: -90, scale: 0.96 },
          { rotateY: 0, scale: 1, duration: 0.38, ease: 'power2.out', transformOrigin: '50% 50%' },
        );
      },
    });
  }, []);

  const goToDetail = useCallback((program, division) => {
    flipTo({ page: 'kd-list', program, division, indicator: null });
  }, [flipTo]);

  const goToIndicator = useCallback((indicator) => {
    flipTo({ ...viewRef.current, page: 'kd-indicator', indicator });
  }, [flipTo]);

  const goHome = useCallback(() => {
    flipTo({ page: 'home', program: null, division: null, indicator: null });
  }, [flipTo]);

  const goBack = useCallback(() => {
    const cur = viewRef.current;
    if (cur.page === 'kd-indicator') {
      flipTo({ ...cur, page: 'kd-list', indicator: null });
    } else {
      goHome();
    }
  }, [flipTo, goHome]);

  const renderPage = () => {
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
    return (
      <DetailPage
        program={view.program}
        division={view.division}
        onBack={goHome}
      />
    );
  };

  return (
    <div className="flip-stage">
      <div className="flip-page" ref={pageRef}>
        {renderPage()}
      </div>
      {/* Frosted glass sheen — visible only during the flip midpoint */}
      <div className="glass-flip-sheen" ref={sheenRef} />
    </div>
  );
}
