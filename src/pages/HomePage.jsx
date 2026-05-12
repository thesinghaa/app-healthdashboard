import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DIVISIONS, STATUS_CONFIG } from '../data/programs';

function getSummary() {
  let total = 0, red = 0, yellow = 0, green = 0;
  DIVISIONS.forEach(div => {
    div.programs.forEach(p => {
      total++;
      if (p.status === 'red') red++;
      else if (p.status === 'yellow') yellow++;
      else green++;
    });
  });
  return { total, red, yellow, green };
}

const BODY_CLASS = {
  rch:  'rch-body',
  ndcp: 'ndcp-body',
  ncd:  'ncd-body',
  hss:  'hss-body',
};

const STATUS_TEXT = { red: 'Critical', yellow: 'Caution', green: 'On Track' };

const STATUS_CLASS = {
  red:    'status-critical',
  yellow: 'status-caution',
  green:  'status-on-track',
};

export default function HomePage({ onSelectProgram, onSelectDivision }) {
  const rootRef = useRef(null);
  const summary = getSummary();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.glass-navbar', { y: -32, opacity: 0, duration: 0.55 })
        .from('.home-state-name', { y: 12, opacity: 0, duration: 0.45 }, '-=0.25')
        .from('.home-state-sub',  { y: 8,  opacity: 0, duration: 0.38 }, '-=0.30')
        .from('.hs-pill', { y: 10, opacity: 0, duration: 0.38, stagger: 0.07 }, '-=0.25')
        .from('.home-meta', { x: 8, opacity: 0, duration: 0.32 }, '-=0.20')
        .from('.bento-card', { y: 28, opacity: 0, duration: 0.50, stagger: 0.09 }, '-=0.10');

      gsap.to('.hs-red .hs-val', {
        opacity: 0.65, duration: 1.4, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.5,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleProgramClick = (program, division) => onSelectProgram(program, division);
  const handleDivisionSelect = (division) => onSelectDivision(division);

  return (
    <div className="home-root" ref={rootRef}>

      {/* Layer 0: background dot grid */}
      <div className="home-bg-gradient" />

      {/* Layer 1: dashboard content */}
      <div className="home-content">

        {/* Header with teal waves + floating glass pill */}
        <div className="home-header">
          <div className="header-waves">
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 0.55 }}>
              <path d="M0,80 C240,110 480,40 720,70 C960,100 1200,50 1440,80 L1440,130 L0,130 Z" fill="#7EDDD0"/>
            </svg>
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 0.45 }}>
              <path d="M0,95 C180,55 360,115 540,85 C720,55 900,105 1080,78 C1260,52 1380,96 1440,88 L1440,130 L0,130 Z" fill="#2DC4AD"/>
            </svg>
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 0.35 }}>
              <path d="M0,108 C300,75 600,120 900,98 C1100,80 1300,110 1440,102 L1440,130 L0,130 Z" fill="#0E9E8A"/>
            </svg>
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 0.25 }}>
              <path d="M0,118 C360,95 720,125 1080,112 C1260,105 1380,120 1440,118 L1440,130 L0,130 Z" fill="#0A7B6C"/>
            </svg>
          </div>

          <div className="home-header-inner">
            <div className="glass-navbar">
              <div className="home-brand">
                <span className="home-state-name">Arunachal Pradesh</span>
                <span className="home-state-sub">Health Dashboard Demo</span>
              </div>

              <div className="home-summary">
                <div className="hs-pill hs-total">
                  <span className="hs-val">{summary.total}</span>
                  <span className="hs-lbl">Programmes</span>
                </div>
                <div className="hs-pill hs-red">
                  <span className="hs-val">{summary.red}</span>
                  <span className="hs-lbl">Critical</span>
                </div>
                <div className="hs-pill hs-yellow">
                  <span className="hs-val">{summary.yellow}</span>
                  <span className="hs-lbl">Caution</span>
                </div>
                <div className="hs-pill hs-green">
                  <span className="hs-val">{summary.green}</span>
                  <span className="hs-lbl">On Track</span>
                </div>
              </div>

              <div className="home-meta">
                <span className="home-meta-label">Data source</span>
                <span className="home-meta-value">HMIS · NFHS-5 · Apr 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div className="home-grid">
          <div className="dashboard-grid">
            {DIVISIONS.map(div => (
              <BentoCard
                key={div.id}
                division={div}
                onProgramClick={handleProgramClick}
                onSelectDivision={(division) => handleDivisionSelect(division)}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

function BentoCard({ division, onProgramClick, onSelectDivision }) {

  const sorted = [...division.programs].sort(
    (a, b) => STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order,
  );
  const counts = { red: 0, yellow: 0, green: 0 };
  division.programs.forEach(p => counts[p.status]++);
  const bodyClass = BODY_CLASS[division.id] || 'rch-body';
  const isHSS = division.id === 'hss';
  const isRCH = division.id === 'rch';

  const handleExpand = (e) => {
    e.stopPropagation();
    onSelectDivision(division);
  };

  return (
    <div className={`bento-card card-${division.id} ${counts.red >= 2 ? 'bento-card--urgent' : counts.red === 1 ? 'bento-card--warning' : 'bento-card--ok'}`}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="card-header">
        <span className="card-wm" aria-hidden="true">{division.label}</span>
        <div className="card-accent-bar" aria-hidden="true" />

        <div className="card-header-body">
          <div className="card-header-row1">
            <span className="div-mono-tag">{division.label}</span>
            <span className="div-name">{division.fullName}</span>
            <div className="div-counts">
              {counts.red    > 0 && <span className="count-pill cp-red">{counts.red}</span>}
              {counts.yellow > 0 && <span className="count-pill cp-yellow">{counts.yellow}</span>}
              {counts.green  > 0 && <span className="count-pill cp-green">{counts.green}</span>}
            </div>
          </div>
        </div>

        <button
          className="div-expand-btn"
          onClick={handleExpand}
          title={`Expand ${division.fullName}`}
          aria-label={`Expand ${division.fullName}`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M1 5V1H5"           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12H8"         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1L5.5 5.5"       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M12 12L7.5 7.5"     stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Programme rows ────────────────────────────────────────── */}
      <div className={`card-body ${bodyClass}`}>
        {sorted.map(prog => {
          const featured = isRCH && prog.status === 'green';
          return (
            <button
              key={prog.id}
              className={`programme-row ${STATUS_CLASS[prog.status]}${featured ? ' row-featured' : ''}`}
              onClick={() => onProgramClick(prog, division)}
              title={`View ${prog.name} indicators and priority actions`}
            >
              {isHSS && (
                <svg className="hss-cross-bg" width="60" height="60" viewBox="0 0 80 80">
                  <rect x="30" y="5" width="20" height="70" rx="4" fill="currentColor"/>
                  <rect x="5"  y="30" width="70" height="20" rx="4" fill="currentColor"/>
                </svg>
              )}
              <div className="prog-name-row">
                <span className="programme-title">{prog.name}</span>
                <span className={`status-label sl-${prog.status}`}>
                  {STATUS_TEXT[prog.status]}
                </span>
              </div>
              {prog.keyMetric && (
                <span className="prog-key-metric">{prog.keyMetric}</span>
              )}
              {prog.statusReason && (
                <span className="programme-desc">{prog.statusReason}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
