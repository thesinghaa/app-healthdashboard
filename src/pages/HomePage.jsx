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

export default function HomePage({ onSelectProgram }) {
  const rootRef = useRef(null);
  const summary = getSummary();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.home-header', { y: -24, opacity: 0, duration: 0.5, ease: 'power3.out' });
      gsap.from('.division-card', {
        y: 36, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.25,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleProgramClick = (program, division) => {
    gsap.to(rootRef.current, {
      opacity: 0, y: -12, duration: 0.26, ease: 'power2.in',
      onComplete: () => onSelectProgram(program, division),
    });
  };

  return (
    <div className="home-root" ref={rootRef}>

      {/* ── Compact header ──────────────────────────────────────────── */}
      <div className="home-header">
        <div className="home-header-inner">

          <div className="home-brand">
            <span className="home-state-name">Arunachal Pradesh</span>
            <span className="home-state-sub">
              National Health Mission · Programme Dashboard · NFHS-5 &amp; NPCC Apr 2026
            </span>
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

          <div className="home-legend">
            <span className="hl-item"><span className="hl-dot hl-red" />Immediate Attention</span>
            <span className="hl-item"><span className="hl-dot hl-yellow" />Under Review</span>
            <span className="hl-item"><span className="hl-dot hl-green" />On Track</span>
          </div>

        </div>
      </div>

      {/* ── Divisions grid ──────────────────────────────────────────── */}
      <div className="home-grid">
        <div className="divisions-grid">
          {DIVISIONS.map(div => (
            <DivisionCard key={div.id} division={div} onProgramClick={handleProgramClick} />
          ))}
        </div>
        <p className="grid-footnote">
          Red = critical gap requiring officer intervention &nbsp;·&nbsp;
          Yellow = below benchmark, monitoring needed &nbsp;·&nbsp;
          Green = on track or improved.
          Source: NFHS-5 (2019-21) IIPS Mumbai / MoHFW &nbsp;·&nbsp;
          NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026.
        </p>
      </div>

    </div>
  );
}

function DivisionCard({ division, onProgramClick }) {
  const sorted = [...division.programs].sort(
    (a, b) => STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order,
  );
  const counts = { red: 0, yellow: 0, green: 0 };
  division.programs.forEach(p => counts[p.status]++);

  return (
    <div className="division-card">
      <div className="division-header">
        <div className="div-tag-wrap">
          <span className="div-tag">{division.label}</span>
          <span className="div-name">{division.fullName}</span>
        </div>
        <div className="div-counts">
          {counts.red    > 0 && <span className="count-pill cp-red">{counts.red} critical</span>}
          {counts.yellow > 0 && <span className="count-pill cp-yellow">{counts.yellow} caution</span>}
          {counts.green  > 0 && <span className="count-pill cp-green">{counts.green} on track</span>}
        </div>
      </div>

      <div className="prog-grid">
        {sorted.map(prog => (
          <button
            key={prog.id}
            className={`prog-card s-${prog.status}`}
            onClick={() => onProgramClick(prog, division)}
            title={`View ${prog.name} indicators and priority actions`}
          >
            <div className="prog-card-row">
              <span className="prog-name">{prog.name}</span>
              <span className="prog-arrow">→</span>
            </div>
            {prog.statusReason && (
              <span className="prog-reason">{prog.statusReason}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
