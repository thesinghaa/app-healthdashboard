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
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Header slides down
      tl.from('.home-header', { y: -40, opacity: 0, duration: 0.5 })
        // Brand name rises up
        .from('.home-state-name', { y: 16, opacity: 0, duration: 0.55 }, '-=0.25')
        .from('.home-state-sub',  { y: 10, opacity: 0, duration: 0.45 }, '-=0.35')
        // Stat pills pop in with stagger
        .from('.hs-pill', { y: 12, opacity: 0, duration: 0.4, stagger: 0.07 }, '-=0.3')
        // Legend fades in
        .from('.hl-item', { x: 10, opacity: 0, duration: 0.35, stagger: 0.06 }, '-=0.25')
        // Division cards stagger up
        .from('.division-card', { y: 40, opacity: 0, duration: 0.55, stagger: 0.12 }, '-=0.1')
        // Programme tiles stagger inside cards
        .from('.prog-card', { y: 14, opacity: 0, duration: 0.35, stagger: 0.025 }, '-=0.35');

      // Subtle continuous pulse on critical stat value
      gsap.to('.hs-red .hs-val', {
        opacity: 0.65, duration: 1.4, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.8,
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
