import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DIVISIONS, STATUS_CONFIG } from '../data/programs';

gsap.registerPlugin(ScrollToPlugin);

// State-level headline indicators shown on the landing page
const STATE_SNAPSHOT = [
  { label: 'Infant Mortality Rate',   value: '12.9', unit: 'per 1,000 LB', note: '↓ from 23 in NFHS-4',    good: true  },
  { label: 'Institutional Births',    value: '79.2%', unit: '',             note: '↑ from 52.3% in NFHS-4', good: true  },
  { label: 'Child Anaemia',           value: '56.6%', unit: '',             note: '↑ worsened from 50.7%',   good: false },
  { label: 'Full Immunisation',       value: '64.9%', unit: '',             note: '↑ from 38.2% in NFHS-4', good: true  },
  { label: 'Hypertension (Men)',      value: '33.1%', unit: '',             note: 'NFHS-5 — no prior data',  good: false },
];

export default function HomePage({ onSelectProgram }) {
  const rootRef   = useRef(null);
  const countRefs = useRef([]);

  // ── Entrance animations ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.lp-stamp',        { y: 18, opacity: 0, duration: 0.6 })
        .from('.lp-state-name',   { y: 50, opacity: 0, duration: 0.75 }, '-=0.2')
        .from('.lp-title-line',   { y: 44, opacity: 0, duration: 0.75, stagger: 0.1 }, '-=0.4')
        .from('.lp-desc',         { y: 20, opacity: 0, duration: 0.65 }, '-=0.3')
        .from('.lp-snapshot-item',{ y: 24, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.3')
        .from('.lp-divider-line', { scaleX: 0, duration: 0.6, transformOrigin: 'left' }, '-=0.2')
        .from('.lp-meta-item',    { y: 16, opacity: 0, duration: 0.45, stagger: 0.06 }, '-=0.3')
        .from('.lp-cta-btn',      { y: 14, opacity: 0, duration: 0.45 }, '-=0.2')
        .from('.lp-scroll-hint',  { opacity: 0, duration: 0.4 });

      gsap.to('.lp-scroll-arrow', {
        y: 6, repeat: -1, yoyo: true, duration: 1.1, ease: 'power1.inOut', delay: 2.4,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // ── Grid cards scroll-in ─────────────────────────────────────────────────────
  useEffect(() => {
    const cards = document.querySelectorAll('.division-card');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          gsap.fromTo(e.target,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          );
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.07 });
    cards.forEach(c => io.observe(c));
    return () => io.disconnect();
  }, []);

  const handleEnter = () => {
    gsap.to(window, {
      scrollTo: { y: '#program-grid', offsetY: -20 },
      duration: 1.1, ease: 'power3.inOut',
    });
  };

  const handleProgramClick = (program, division) => {
    gsap.to('.home-root', {
      opacity: 0, y: -14, duration: 0.28, ease: 'power2.in',
      onComplete: () => onSelectProgram(program, division),
    });
  };

  return (
    <div className="home-root" ref={rootRef}>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — Landing Hero
          ════════════════════════════════════════════════════════════════ */}
      <section className="lp-section">
        <div className="lp-grid-bg"  aria-hidden="true" />
        <div className="lp-glow"     aria-hidden="true" />

        <div className="lp-inner">

          {/* Provenance stamp */}
          <div className="lp-stamp">
            <span className="lp-stamp-gov">Government of India</span>
            <span className="lp-stamp-sep">·</span>
            <span>National Health Mission</span>
            <span className="lp-stamp-sep">·</span>
            <span>Arunachal Pradesh</span>
          </div>

          {/* State + title */}
          <h1 className="lp-state-name">Arunachal Pradesh</h1>
          <div className="lp-title-block">
            <span className="lp-title-line">State Health Programme</span>
            <span className="lp-title-line lp-title-accent">Performance Dashboard</span>
          </div>

          {/* What this is */}
          <p className="lp-desc">
            This dashboard aggregates National Family Health Survey data (NFHS-4 2015-16 and NFHS-5 2019-21)
            with NHM NPCC programme performance data (April 2026) across all 28 programme areas under
            RCH, NDCP, NCD, and HSS divisions — for use by state and district health officers in evidence-based
            programme prioritisation and decision-making.
          </p>

          {/* State at a glance */}
          <div className="lp-snapshot">
            <p className="lp-snapshot-label">State at a Glance — NFHS-5 (2019-21)</p>
            <div className="lp-snapshot-row">
              {STATE_SNAPSHOT.map(s => (
                <div className="lp-snapshot-item" key={s.label}>
                  <div className={`lp-snap-value ${s.good ? 'snap-good' : 'snap-bad'}`}>{s.value}</div>
                  {s.unit && <div className="lp-snap-unit">{s.unit}</div>}
                  <div className="lp-snap-label">{s.label}</div>
                  <div className={`lp-snap-note ${s.good ? 'note-good' : 'note-bad'}`}>{s.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="lp-divider-line" />

          {/* Coverage metadata */}
          <div className="lp-meta-row">
            {[
              { v: '28', l: 'Districts' },
              { v: '28', l: 'Programmes Mapped' },
              { v: '4',  l: 'NHM Divisions' },
              { v: 'NFHS-5', l: 'Latest Survey Round · 2019-21' },
              { v: 'Apr 2026', l: 'NPCC Programme Data' },
            ].map(({ v, l }) => (
              <div className="lp-meta-item" key={l}>
                <span className="lp-meta-val">{v}</span>
                <span className="lp-meta-label">{l}</span>
              </div>
            ))}
          </div>

          <button className="lp-cta-btn" onClick={handleEnter}>
            View Programme Overview
            <span className="lp-cta-arrow">→</span>
          </button>

          <div className="lp-scroll-hint">
            <span className="lp-scroll-text">Scroll to programme grid</span>
            <span className="lp-scroll-arrow">↓</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — Programme Grid
          ════════════════════════════════════════════════════════════════ */}
      <section className="grid-section" id="program-grid">

        <div className="grid-header">
          <div>
            <p className="grid-eyebrow">NHM Programme Performance · Arunachal Pradesh · April 2026</p>
            <h2 className="grid-title">
              Programme Status Overview
            </h2>
            <p className="grid-subtitle">
              Each programme is assessed against NFHS-5 outcome data and NHM NPCC April 2026 programme
              performance. Status is ranked — programmes requiring immediate officer attention are listed first
              within each division. Click any programme to view indicators, observations, and priority actions.
            </p>
          </div>
          <div className="grid-legend">
            <div className="legend-row">
              <span className="legend-dot ld-red" />
              <div>
                <div className="legend-title">Immediate Attention</div>
                <div className="legend-sub">Critical gap — officer intervention required</div>
              </div>
            </div>
            <div className="legend-row">
              <span className="legend-dot ld-yellow" />
              <div>
                <div className="legend-title">Under Review</div>
                <div className="legend-sub">Below target — monitoring needed</div>
              </div>
            </div>
            <div className="legend-row">
              <span className="legend-dot ld-green" />
              <div>
                <div className="legend-title">On Track</div>
                <div className="legend-sub">Significant improvement or meeting benchmarks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="divisions-grid">
          {DIVISIONS.map(div => (
            <DivisionCard key={div.id} division={div} onProgramClick={handleProgramClick} />
          ))}
        </div>

        <p className="grid-footnote">
          Status classification is data-driven: Red = critical performance gap requiring officer-level intervention based on
          NFHS-5 outcome data or NHM NPCC April 2026 programme gaps. Yellow = below national benchmarks, monitoring needed.
          Green = on track or significant improvement recorded. Source: NFHS-4 (2015-16), NFHS-5 (2019-21) — IIPS Mumbai /
          Ministry of Health &amp; Family Welfare, Govt. of India. NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026.
        </p>
      </section>
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
            title={`Click to view ${prog.name} indicators and priority actions`}
          >
            <div className="prog-card-top">
              <span className="prog-dot" />
              <span className="prog-arrow">→</span>
            </div>
            <span className="prog-name">{prog.name}</span>
            {prog.statusReason && (
              <span className="prog-reason">{prog.statusReason}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
