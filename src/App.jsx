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
     1. Current page rotates away on Y axis (0 → 90deg)
     2. Frosted glass sheen peaks at the edge-on midpoint
     3. State swaps while page is invisible (at 90deg)
     4. New page flips in from -90deg → 0
  ─────────────────────────────────────────────────────────────── */
  const flipTo = useCallback((newView) => {
    const page  = pageRef.current;
    const sheen = sheenRef.current;
    if (!page) { setView(newView); return; }

    gsap.killTweensOf([page, sheen]);

    const tl = gsap.timeline({ defaults: { transformOrigin: '50% 50%' } });

    /* Exit: page sweeps right, sheen rises */
    tl.to(page,  { rotateY: 90, scale: 0.97, duration: 0.30, ease: 'power2.in' }, 0)
      .to(sheen, { opacity: 1,               duration: 0.22, ease: 'power2.in' }, 0)

    /* Midpoint: swap content */
      .add(() => setView(newView), 0.30)

    /* Entry: new page sweeps in from left, sheen drops */
      .fromTo(page,
        { rotateY: -90, scale: 0.97 },
        { rotateY: 0, scale: 1, duration: 0.32, ease: 'power2.out' },
        0.30,
      )
      .to(sheen, { opacity: 0, duration: 0.24, ease: 'power2.out' }, 0.30);

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
