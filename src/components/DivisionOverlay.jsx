import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { STATUS_CONFIG } from '../data/programs';

const STATUS_CLASS = {
  red:    'status-critical',
  yellow: 'status-caution',
  green:  'status-on-track',
};

const STATUS_PILL = {
  red:    { cls: 'st-red',    label: 'Critical'  },
  yellow: { cls: 'st-yellow', label: 'Caution'   },
  green:  { cls: 'st-green',  label: 'On Track'  },
};

const GRID_CLASS = {
  rch:  'div-grid-2col',
  ndcp: 'div-grid-2col',
  ncd:  'div-grid-3col',
  hss:  'div-grid-1col',
};

export default function DivisionOverlay({ division, expandFrom, onBack, onSelectProgram }) {
  const overlayRef = useRef(null);

  const sorted = [...division.programs].sort(
    (a, b) => STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order,
  );

  const counts = { red: 0, yellow: 0, green: 0 };
  division.programs.forEach(p => counts[p.status]++);

  /* ── Enter animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = overlayRef.current;

      /* Lock initial states before first paint */
      gsap.set('.div-topbar',   { y: -20, opacity: 0 });
      gsap.set('.div-prog-card', { y: 36,  opacity: 0 });

      gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        /* 1 — zoom card → full screen */
        .to(el, {
          top: 0, left: 0, width: '100vw', height: '100vh',
          borderRadius: 0, duration: 0.52,
        })
        /* 2 — slide-in topbar */
        .to('.div-topbar', {
          y: 0, opacity: 1, duration: 0.30, ease: 'power2.out',
        }, '-=0.06')
        /* 3 — stagger cards in */
        .to('.div-prog-card', {
          y: 0, opacity: 1, duration: 0.38, stagger: 0.055, ease: 'power3.out',
        }, '-=0.12');
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  /* ── Exit animation ──────────────────────────────────────────────── */
  const handleBack = () => {
    const el = overlayRef.current;
    gsap.timeline({ onComplete: onBack })
      .to('.div-prog-card', {
        y: -14, opacity: 0, duration: 0.15, stagger: 0.02, ease: 'power2.in',
      })
      .to('.div-topbar', {
        y: -16, opacity: 0, duration: 0.13, ease: 'power2.in',
      }, '-=0.12')
      .to(el, {
        top: expandFrom.top, left: expandFrom.left,
        width: expandFrom.width, height: expandFrom.height,
        borderRadius: 20, duration: 0.44, ease: 'power3.inOut',
        overflow: 'hidden',
      }, '-=0.05');
  };

  const handleProgClick = (prog) => {
    gsap.to(overlayRef.current, {
      opacity: 0, scale: 0.97, duration: 0.22, ease: 'power2.in',
      onComplete: () => onSelectProgram(prog, division),
    });
  };

  return (
    <div
      ref={overlayRef}
      className="div-overlay"
      style={{
        position: 'fixed',
        top:    expandFrom.top,
        left:   expandFrom.left,
        width:  expandFrom.width,
        height: expandFrom.height,
        borderRadius: 20,
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Teal gradient background — matches page */}
      <div className="div-overlay-bg" />

      <div className="div-overlay-content">

        {/* ── Sticky topbar ──────────────────────────────────────────── */}
        <div className="div-topbar">
          <button className="div-back-btn" onClick={handleBack}>
            <span className="div-back-arrow">←</span> Dashboard
          </button>
          <div className="div-topbar-center">
            <span className="div-tag">{division.label}</span>
            <span className="div-topbar-name">{division.fullName}</span>
          </div>
          <div className="div-counts">
            {counts.red    > 0 && <span className="count-pill cp-red">{counts.red} critical</span>}
            {counts.yellow > 0 && <span className="count-pill cp-yellow">{counts.yellow} caution</span>}
            {counts.green  > 0 && <span className="count-pill cp-green">{counts.green} on track</span>}
          </div>
        </div>

        {/* ── Programme grid ──────────────────────────────────────────── */}
        <div className={`div-prog-grid ${GRID_CLASS[division.id] || 'div-grid-2col'}`}>
          {sorted.map(prog => (
            <button
              key={prog.id}
              className={`div-prog-card ${STATUS_CLASS[prog.status]}`}
              onClick={() => handleProgClick(prog)}
            >
              {/* Header row */}
              <div className="dpc-header">
                <span className="dpc-name">{prog.name}</span>
                <span className={`status-pill ${STATUS_PILL[prog.status].cls}`}>
                  {STATUS_PILL[prog.status].label}
                </span>
              </div>

              {/* One-liner status reason */}
              {prog.statusReason && (
                <p className="dpc-reason">{prog.statusReason}</p>
              )}

              {/* Key metrics chips */}
              {prog.keyMetrics && prog.keyMetrics.length > 0 && (
                <div className="dpc-metrics">
                  {prog.keyMetrics.slice(0, 3).map((m, i) => (
                    <div key={i} className="dpc-metric">
                      <span className="dpm-val">{m.value}</span>
                      <span className="dpm-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA footer */}
              <div className="dpc-footer">
                <span className="dpc-cta">View Full Details →</span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
