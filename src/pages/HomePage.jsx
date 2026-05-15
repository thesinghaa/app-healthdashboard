import { useEffect, useRef, useState, useCallback } from 'react';
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

const STATUS_TEXT = { red: 'Critical', yellow: 'Caution', green: 'On Track' };
const STATUS_CLS  = { red: 'sl-red',   yellow: 'sl-yellow', green: 'sl-green' };

const DIV_CHIP = {
  rch:  '#FF5500',
  ndcp: '#C2410C',
  ncd:  '#92400E',
  hss:  '#B45309',
  hrh:  '#1A1610',
};

const DIV_DESC = {
  rch:  'Maternal health, immunisation, nutrition, and child care across all districts.',
  ndcp: 'TB elimination, vector-borne disease, leprosy, AIDS, and AMR surveillance.',
  ncd:  'Hypertension, diabetes, cancer screening, mental health, and tobacco control.',
  hss:  'Health & Wellness Centres, digital health ID, quality assurance, and workforce.',
  hrh:  'Workforce availability, productivity, and staffing across all key health cadres.',
};

/* Programme names exactly as listed in PIP Proposals slide (NPCC Apr 2026) */
const PROG_META = {
  /* ── RCH ── */
  'maternal-health':   { code: 'MH',      label: 'Maternal Health'           },
  'jsy':               { code: 'JSY',     label: 'JSY'                       },
  'cac':               { code: 'CAC',     label: 'CAC'                       },
  'pcpndt':            { code: 'PCPNDT',  label: 'PCPNDT'                    },
  'child-health':      { code: 'RBSK',    label: 'Child Health'              },
  'immunization':      { code: 'UIP',     label: 'Immunization'              },
  'adolescent-health': { code: 'RKSK',    label: 'Adolescent Health'         },
  'family-planning':   { code: 'FP',      label: 'Family Planning'           },
  'nutrition':         { code: 'Poshan',  label: 'Nutrition'                 },
  /* ── NDCP ── */
  'nvhcp':   { code: 'NVHCP',   label: 'NVHCP'                   },
  'tb':      { code: 'NTEP',    label: 'TB Mukt Bharat Abhiyan'  },
  'nlep':    { code: 'NLEP',    label: 'NLEP'                    },
  'ncvbdcp': { code: 'NCVBDCP', label: 'NCVBDCP'                 },
  'idsp':    { code: 'IDSP',    label: 'IDSP'                    },
  'nscaem':  { code: 'NSCAEM',  label: 'NSCAEM and Blood Cell'   },
  /* ── NCD ── */
  'np-ncd':  { code: 'NP-NCD',  label: 'NP-NCD'   },
  'pmndp':   { code: 'PMNDP',   label: 'PMNDP'    },
  'nppc':    { code: 'NPPC',    label: 'NPPC'     },
  'nmhp':    { code: 'NMHP',    label: 'NMHP'     },
  'nphce':   { code: 'NPHCE',   label: 'NPHCE'    },
  'npcbvi':  { code: 'NPCBVI',  label: 'NPCBVI'   },
  'nppcd':   { code: 'NPPCD',   label: 'NPPCD'    },
  'nohp':    { code: 'NOHP',    label: 'NOHP'     },
  'niddcp':  { code: 'NIDDCP',  label: 'NIDDCP'   },
  'ntcp':    { code: 'NTCP',    label: 'NTCP'     },
  'npcchh':  { code: 'NPCCHH',  label: 'NPCCHH'   },
  /* ── HSS ── */
  'hss-urban': { code: 'HSS-U', label: 'HSS-Urban' },
  'hss-rural': { code: 'HSS-R', label: 'HSS-Rural' },
  /* ── HRH ── */
  'mpw':             { code: 'MPW',    label: 'MPW (F+M)'               },
  'staff-nurse':     { code: 'SN',     label: 'Staff Nurse'             },
  'cho':             { code: 'CHO',    label: 'Comm. Health Officer'    },
  'lab-tech':        { code: 'LT',     label: 'Lab Technicians'         },
  'pharmacist':      { code: 'Pharma', label: 'Pharmacists'             },
  'medical-officer': { code: 'MO',     label: 'Medical Officers (MBBS)' },
  'specialist':      { code: 'Spec',   label: 'Clinical Specialists'    },
};

const TOTAL = DIVISIONS.length;


export default function HomePage({ onSelectProgram, onSelectDivision }) {
  const rootRef     = useRef(null);
  const viewportRef = useRef(null);
  const [active, setActive]  = useState(0);
  const [query, setQuery]    = useState('');
  const activeRef   = useRef(0);
  const isAnimating = useRef(false);
  const touchStartX = useRef(null);
  const mouseStartX = useRef(null);
  const summary = getSummary();

  /* ── Init + entry animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = viewportRef.current?.querySelectorAll('[data-carousel-card]');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.set(card, { rotateY: i === 0 ? 0 : 90, opacity: i === 0 ? 1 : 0 });
        });
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.glass-navbar',        { y: -32, opacity: 0, duration: 0.55 })
        .from('.home-state-name',     { y: 12,  opacity: 0, duration: 0.45 }, '-=0.25')
        .from('.home-state-sub',      { y: 8,   opacity: 0, duration: 0.38 }, '-=0.30')
        .from('.hs-pill',             { y: 10,  opacity: 0, duration: 0.38, stagger: 0.07 }, '-=0.25')
        .from('.hl-item',             { x: 8,   opacity: 0, duration: 0.32, stagger: 0.06 }, '-=0.20')
        .from('.carousel-stage',      { y: 24,  opacity: 0, duration: 0.50 }, '-=0.15');

      gsap.to('.hs-red .hs-val', {
        opacity: 0.65, duration: 1.4, repeat: -1, yoyo: true, ease: 'power1.inOut', delay: 1.5,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ── Navigation ── */
  const goTo = useCallback((targetIndex, { preserveQuery = false } = {}) => {
    if (isAnimating.current) return;
    const n   = ((targetIndex % TOTAL) + TOTAL) % TOTAL;
    const cur = activeRef.current;
    if (n === cur) return;

    const cards = viewportRef.current?.querySelectorAll('[data-carousel-card]');
    if (!cards) return;

    const forward = targetIndex >= cur;
    isAnimating.current = true;
    gsap.set(cards[n], { rotateY: forward ? -90 : 90, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        activeRef.current = n;
        setActive(n);
        if (!preserveQuery) setQuery('');
      },
    });
    tl.to(cards[cur], { rotateY: forward ? 90 : -90, opacity: 0, duration: 0.35, ease: 'power2.in' });
    tl.to(cards[n],   { rotateY: 0, opacity: 1,                   duration: 0.35, ease: 'power2.out' }, '-=0.05');
  }, []);

  const goNext = useCallback(() => goTo(activeRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(activeRef.current - 1), [goTo]);

  /* ── Global search: auto-navigate to first matching division ── */
  useEffect(() => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const idx = DIVISIONS.findIndex(div =>
      div.programs.some(prog => {
        const meta = PROG_META[prog.id] || {};
        return (
          prog.name.toLowerCase().includes(q) ||
          (meta.code  || '').toLowerCase().includes(q) ||
          (meta.label || '').toLowerCase().includes(q) ||
          (prog.keyMetric || '').toLowerCase().includes(q)
        );
      })
    );
    if (idx !== -1 && idx !== activeRef.current) {
      goTo(idx, { preserveQuery: true });
    }
  }, [query, goTo]);

  /* ── Swipe ── */
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) goNext(); if (dx > 50) goPrev();
    touchStartX.current = null;
  };
  const onMouseDown = (e) => { mouseStartX.current = e.clientX; };
  const onMouseUp   = (e) => {
    if (mouseStartX.current === null) return;
    const dx = e.clientX - mouseStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
    mouseStartX.current = null;
  };

  /* ── Search filter ── */
  const matchesProg = (prog) => {
    if (!query.trim()) return true;
    const q   = query.toLowerCase();
    const meta = PROG_META[prog.id] || {};
    return (
      prog.name.toLowerCase().includes(q) ||
      (meta.code  || '').toLowerCase().includes(q) ||
      (meta.label || '').toLowerCase().includes(q) ||
      (prog.keyMetric || '').toLowerCase().includes(q)
    );
  };

  return (
    <div className="home-root" ref={rootRef}>
      <div className="home-bg-gradient" />
      <div className="home-content">

        {/* ── Navbar — unchanged ── */}
        <div className="home-header">
          <div className="header-waves">
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 1 }}>
              <defs>
                <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#FF5500" stopOpacity="0.22"/>
                  <stop offset="50%"  stopColor="#FF7733" stopOpacity="0.16"/>
                  <stop offset="100%" stopColor="#FF5500" stopOpacity="0.22"/>
                </linearGradient>
              </defs>
              <path d="M0,60 C240,100 480,30 720,65 C960,100 1200,40 1440,72 L1440,130 L0,130 Z" fill="url(#wg1)"/>
            </svg>
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 1 }}>
              <defs>
                <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#C2410C" stopOpacity="0.18"/>
                  <stop offset="50%"  stopColor="#FF5500" stopOpacity="0.24"/>
                  <stop offset="100%" stopColor="#C2410C" stopOpacity="0.18"/>
                </linearGradient>
              </defs>
              <path d="M0,88 C180,50 360,110 540,80 C720,50 900,100 1080,74 C1260,48 1380,92 1440,84 L1440,130 L0,130 Z" fill="url(#wg2)"/>
            </svg>
            <svg viewBox="0 0 1440 130" preserveAspectRatio="none" style={{ opacity: 1 }}>
              <path d="M0,108 C300,82 600,120 900,100 C1100,84 1300,112 1440,104 L1440,130 L0,130 Z" fill="rgba(255,85,0,0.30)"/>
            </svg>
          </div>
          <div className="home-header-inner">
            <div className="glass-navbar">
              <div className="home-brand">
                <span className="home-state-name">Arunachal Pradesh</span>
                <span className="home-state-sub">Health Dashboard Demo</span>
              </div>
              <div className="home-summary">
                <div className="hs-pill hs-total"><span className="hs-val">{summary.total}</span><span className="hs-lbl">Programmes</span></div>
                <div className="hs-pill hs-red"><span className="hs-val">{summary.red}</span><span className="hs-lbl">Critical</span></div>
                <div className="hs-pill hs-yellow"><span className="hs-val">{summary.yellow}</span><span className="hs-lbl">Caution</span></div>
                <div className="hs-pill hs-green"><span className="hs-val">{summary.green}</span><span className="hs-lbl">On Track</span></div>
              </div>
              <div className="home-legend">
                <span className="hl-item"><span className="hl-dot hl-red" />Immediate Attention</span>
                <span className="hl-item"><span className="hl-dot hl-yellow" />Under Review</span>
                <span className="hl-item"><span className="hl-dot hl-green" />On Track</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="home-grid">
          <div className="carousel-area">

            {/* Stage */}
            <div className="carousel-stage">

              {/* Column: search bar + card row */}
              <div className="carousel-column">

                {/* Search bar */}
                <div className="carousel-search-top">
                  <div className="cc-search-wrap">
                    <span className="cc-search-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input
                      className="cc-search"
                      type="text"
                      placeholder="Search programmes, short codes…"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      aria-label="Search programmes"
                    />
                  </div>
                </div>

                {/* Card row: tall glass swipe buttons flanking the viewport */}
                <div className="carousel-card-stage">

                  <button className="carousel-arrow carousel-arrow--prev" onClick={goPrev} aria-label="Previous">‹</button>

              <div
                className="carousel-viewport"
                ref={viewportRef}
                onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}   onMouseUp={onMouseUp}
              >
                {DIVISIONS.map((div, i) => {
                  const sorted = [...div.programs].sort(
                    (a, b) => STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order,
                  );
                  const counts = { red: 0, yellow: 0, green: 0 };
                  div.programs.forEach(p => counts[p.status]++);
                  const chip = DIV_CHIP[div.id] || '#FF5500';
                  const visible = sorted.filter(matchesProg);

                  return (
                    <div key={div.id} className="carousel-card" data-carousel-card={i}>

                      {/* Header */}
                      <div className="cc-header" style={{ borderLeftColor: chip }}>
                        <div className="cc-header-left">
                          <span className="cc-tag" style={{ color: chip }}>{div.label} · DIVISION</span>
                          <h2 className="cc-name">{div.fullName}</h2>
                          <p className="cc-desc">{DIV_DESC[div.id]}</p>
                        </div>
                        <div className="cc-header-right">
                          <div className="div-counts">
                            {counts.red    > 0 && <span className="count-pill cp-red">{counts.red} Critical</span>}
                            {counts.yellow > 0 && <span className="count-pill cp-yellow">{counts.yellow} Caution</span>}
                            {counts.green  > 0 && <span className="count-pill cp-green">{counts.green} On Track</span>}
                          </div>
                          <button
                            className="div-expand-btn"
                            onClick={e => { e.stopPropagation(); onSelectDivision(div); }}
                            title={`Expand ${div.fullName}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M1 5V1H5"       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 8V12H8"     stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M1 1L5.5 5.5"   stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                              <path d="M12 12L7.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Programme grid */}
                      <div className="cc-body">
                        {visible.length === 0 && (
                          <div className="cc-no-results">No programmes match "{query}"</div>
                        )}
                        {visible.map((prog, idx) => {
                          const meta = PROG_META[prog.id] || { code: prog.name, label: prog.name };
                          const barColor = prog.status === 'red' ? '#E53E3E' : prog.status === 'yellow' ? '#D97706' : '#FF5500';
                          return (
                            <button
                              key={prog.id}
                              className={`cc-row programme-row cc-row--${prog.status}`}
                              onClick={() => onSelectProgram(prog, div)}
                              title={`View ${meta.label}`}
                            >
                              <div className="cc-row-top">
                                <div className="cc-row-left">
                                  <span className="prog-number">{String(idx + 1).padStart(2, '0')}</span>
                                  <span className="programme-title">{meta.label}</span>
                                </div>
                                <div className="cc-row-right">
                                  {prog.keyMetric && <span className="prog-key-metric">{prog.keyMetric}</span>}
                                  <span className={STATUS_CLS[prog.status]}>{STATUS_TEXT[prog.status]}</span>
                                </div>
                              </div>
                              {prog.statusReason && <p className="prog-subtitle">{prog.statusReason}</p>}
                              {prog.achievement != null && (
                                <div className="cc-hrh-progress">
                                  <div className="cc-hrh-bar" style={{ width: `${prog.achievement}%`, background: barColor }} />
                                  {prog.target != null && (
                                    <div className="cc-hrh-target-line" style={{ left: `${prog.target}%` }} />
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

                  <button className="carousel-arrow carousel-arrow--next" onClick={goNext} aria-label="Next">›</button>

                </div>{/* end carousel-card-stage */}

              </div>{/* end carousel-column */}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
