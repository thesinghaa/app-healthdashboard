// CurrentStatusDetailPage.jsx
// 3rd-layer page — full Current Status view for a programme
// Opened when user clicks the "Current Status" button on a programme card

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import CurrentStatusSection from './CurrentStatusSection';

export default function CurrentStatusDetailPage({ program, division, onBack }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wrapRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' },
      );
      gsap.from('.csd-hero, .csd-content > *', {
        y: 24, opacity: 0, duration: 0.42,
        stagger: 0.06, ease: 'power3.out', delay: 0.12,
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [program?.id]);

  return (
    <div className="csd-root" ref={wrapRef}>

      {/* ── Topbar ─────────────────────────────────────────────── */}
      <div className="app-topbar">
        <div className="app-topbar-inner">
          <button className="app-back-btn" onClick={onBack}>
            <span className="app-back-arrow">←</span> Back
          </button>
          <div className="app-breadcrumb">
            <span className="app-tag" style={{ background: '#FF5500' }}>
              {division?.label}
            </span>
            <span className="app-bc-sep">›</span>
            <span className="app-bc-prog">{program?.name}</span>
            <span className="app-bc-sep">›</span>
            <span className="app-bc-current">Current Status</span>
          </div>
        </div>
      </div>

      {/* ── Orange hero header ──────────────────────────────────── */}
      <div className="csd-hero">
        <div className="csd-hero-inner">
          <div className="csd-hero-eyebrow">Current Status</div>
          <h1 className="csd-hero-title">{program?.name}</h1>
          <div className="csd-hero-sub">
            SDG &amp; Disease Elimination · MoHFW NPCC May 2026 · Arunachal Pradesh
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="csd-content">
        <CurrentStatusSection program={program} />
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="detail-footer">
        Source: MoHFW NPCC Meeting, Arunachal Pradesh, May 2026. NHM AP FY 2025-26 NPCC Document.
      </footer>
    </div>
  );
}
