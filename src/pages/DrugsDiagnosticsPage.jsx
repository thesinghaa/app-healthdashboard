// HSS / Drugs & Diagnostics — Current Status
// Charts: react-plotly.js (gauges · radar · treemap · dumbbell · stacked bar)
// Animations: GSAP timeline
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Plot from 'react-plotly.js';

/* ── Palette ─────────────────────────────────────────────────────── */
const C_TEAL   = '#0E9E8A';
const C_AMBER  = '#F59E0B';
const C_RED    = '#E53E3E';
const C_NAVY   = '#1A1F36';
const C_SLATE  = '#475569';
const C_GREEN  = '#10B981';

// IPHS band colours: aspirant → progressive → compliant
const B1 = '#F87171'; // <25%
const B2 = '#FCA5A5'; // 25-50%
const B3 = '#FCD34D'; // 50-69%
const B4 = '#A7F3D0'; // 70-79%
const B5 = '#10B981'; // >80%

/* ── Plotly shared config ────────────────────────────────────────── */
const PC = { displayModeBar: false, responsive: true };
const BL = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { family: "'Inter','DM Sans',sans-serif", size: 12, color: C_SLATE },
  autosize: true,
};

/* ── Source data ─────────────────────────────────────────────────── */
const DRUG_AVAIL = [
  { facility: 'DH',      iphs: 381, edl: 298, common: 216, stock: 16.12 },
  { facility: 'CHC',     iphs: 300, edl: 302, common: 202, stock: 12.20 },
  { facility: 'AAM-PHC', iphs: 172, edl: 123, common: 112, stock: 24.00 },
  { facility: 'AAM-SHC', iphs: 106, edl: 75,  common: 72,  stock: 21.56 },
];

const EML_COMPLIANCE = [
  { facility: 'DH',      pct: 57 },
  { facility: 'CHC',     pct: 67 },
  { facility: 'AAM-PHC', pct: 65 },
  { facility: 'AAM-SHC', pct: 68 },
];

const DIAG_TESTS = [
  { facility: 'AAM-SHC', fdsi: 14,  jan25: 5,  jan26: 7,  gap: 7  },
  { facility: 'AAM-PHC', fdsi: 63,  jan25: 8,  jan26: 18, gap: 45 },
  { facility: 'CHC',     fdsi: 97,  jan25: 13, jan26: 30, gap: 67 },
  { facility: 'DH',      fdsi: 134, jan25: 55, jan26: 68, gap: 66 },
];

const NQAS_DATA = [
  { facility: 'DH',       total: 20,  certified: 1,  pct: 5.0  },
  { facility: 'CHC',      total: 57,  certified: 0,  pct: 0    },
  { facility: 'AAM PHC',  total: 127, certified: 2,  pct: 1.6  },
  { facility: 'AAM UPHC', total: 6,   certified: 0,  pct: 0    },
  { facility: 'AAM SHC',  total: 289, certified: 23, pct: 7.96 },
];

const IPHS_FACILITY = [
  { facility: 'DH',  lt25: 5,  p25_50: 15,  p50_69: 1,   p70_79: 0,  gt80: 1 },
  { facility: 'CHC', lt25: 19, p25_50: 35,  p50_69: 2,   p70_79: 0,  gt80: 0 },
  { facility: 'PHC', lt25: 26, p25_50: 83,  p50_69: 22,  p70_79: 0,  gt80: 0 },
  { facility: 'SHC', lt25: 24, p25_50: 156, p50_69: 162, p70_79: 49, gt80: 9 },
];

const IPHS_DOMAIN = [
  { domain: 'Diagnostic',     lt25: 50.0, p25_50: 18.0, compliant: 10.0 },
  { domain: 'Drugs',          lt25: 20.6, p25_50: 57.3, compliant: 1.6  },
  { domain: 'Human Resource', lt25: 4.25, p25_50: 20.3, compliant: 44.0 },
  { domain: 'Infrastructure', lt25: 15.7, p25_50: 27.9, compliant: 3.3  },
  { domain: 'Governance',     lt25: 34.7, p25_50: 21.1, compliant: 10.5 },
  { domain: 'Services',       lt25: 31.0, p25_50: 25.4, compliant: 15.2 },
];

/* ════════════════════════════════════════════════════════════════════
   CHART COMPONENTS
   ════════════════════════════════════════════════════════════════════ */

/* ── 1. Four animated gauge dials — Stock Availability ──────────── */
function StockGauges() {
  const TARGETS = [16.12, 12.20, 24.00, 21.56];
  const LABELS  = ['DH', 'CHC', 'AAM-PHC', 'AAM-SHC'];
  const COLORS  = [C_RED, C_RED, C_AMBER, C_AMBER];

  const [vals, setVals] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const obj = { t: 0 };
    const tw = gsap.to(obj, {
      t: 1, duration: 1.6, ease: 'power3.out',
      onUpdate() {
        setVals(TARGETS.map(v => Math.round(v * obj.t * 10) / 10));
      },
    });
    return () => tw.kill();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '8px 0' }}>
      {LABELS.map((name, i) => {
        const data = [{
          type: 'indicator',
          mode: 'gauge+number',
          value: vals[i],
          title: { text: `<b>${name}</b>`, font: { size: 13, color: C_NAVY, family: "'Inter',sans-serif" } },
          number: { suffix: '%', font: { size: 22, color: COLORS[i], family: "'Playfair Display',Georgia,serif" } },
          gauge: {
            axis: { range: [0, 100], tickfont: { size: 8, color: '#94A3B8' }, nticks: 5, tickcolor: '#E2E8F0' },
            bar: { color: COLORS[i], thickness: 0.44 },
            bgcolor: '#FAFAFA',
            borderwidth: 0,
            steps: [
              { range: [0,  30], color: 'rgba(248,113,113,0.10)' },
              { range: [30, 60], color: 'rgba(245,158,11,0.07)'  },
              { range: [60,100], color: 'rgba(16,185,129,0.06)'  },
            ],
            threshold: { line: { color: '#94A3B8', width: 2 }, thickness: 0.72, value: 50 },
          },
          domain: { x: [0, 1], y: [0, 1] },
        }];

        const layout = {
          ...BL,
          height: 190,
          margin: { t: 24, b: 16, l: 14, r: 14 },
        };

        return (
          <div key={name} style={{
            background: 'rgba(250,250,252,0.7)',
            borderRadius: 10,
            border: '1px solid rgba(226,232,240,0.7)',
            padding: '6px 4px 2px',
          }}>
            <Plot data={data} layout={layout} config={PC}
              useResizeHandler style={{ width: '100%', height: '190px' }} />
          </div>
        );
      })}
    </div>
  );
}

/* ── 2. Radar — EML Compliance across facility types ────────────── */
function EMLRadar() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 320); return () => clearTimeout(t); }, []);

  const facs  = EML_COMPLIANCE.map(d => d.facility);
  const theta = [...facs, facs[0]];
  const rAct  = ready ? [...EML_COMPLIANCE.map(d => d.pct), EML_COMPLIANCE[0].pct] : Array(5).fill(0);
  const rRef  = ready ? Array(5).fill(80)  : Array(5).fill(0);

  const data = [
    {
      type: 'scatterpolar', mode: 'lines', name: '80% IPHS Target',
      r: rRef, theta,
      line: { color: '#CBD5E1', width: 2, dash: 'dot' },
      fill: 'none', hoverinfo: 'skip',
    },
    {
      type: 'scatterpolar', mode: 'lines+markers', name: 'EML Compliance',
      r: rAct, theta,
      fill: 'toself',
      fillcolor: 'rgba(245,158,11,0.18)',
      line: { color: C_AMBER, width: 2.5 },
      marker: { size: 9, color: C_AMBER, line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{theta}</b><br>%{r}% compliant<extra></extra>',
    },
  ];

  const layout = {
    ...BL, height: 270,
    polar: {
      radialaxis: {
        range: [0, 100], ticksuffix: '%',
        tickfont: { size: 9 }, gridcolor: '#E2E8F0', linecolor: '#E2E8F0',
      },
      angularaxis: { tickfont: { size: 12, color: C_NAVY } },
      bgcolor: 'transparent',
    },
    showlegend: true,
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.1, font: { size: 11 } },
    margin: { t: 20, b: 44, l: 40, r: 40 },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '270px' }} />
  );
}

/* ── 3. Dumbbell chart — Diagnostic tests progress vs target ─────── */
function DiagDumbbell() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 280); return () => clearTimeout(t); }, []);

  const facs = DIAG_TESTS.map(d => d.facility);

  // One line trace per facility connecting Jan25 → Jan26
  const lines = facs.map((fac, i) => ({
    type: 'scatter', mode: 'lines',
    x: ready ? [DIAG_TESTS[i].jan25, DIAG_TESTS[i].jan26] : [0, 0],
    y: [fac, fac],
    line: { color: '#94A3B8', width: 3 },
    showlegend: false, hoverinfo: 'skip',
  }));

  const data = [
    ...lines,
    {
      type: 'scatter', mode: 'markers', name: 'FDSI Target',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.fdsi) : facs.map(() => 0),
      marker: { symbol: 'diamond', size: 14, color: '#E2E8F0', line: { color: '#94A3B8', width: 2 } },
      hovertemplate: '<b>%{y}</b><br>FDSI Target: %{x} tests<extra></extra>',
    },
    {
      type: 'scatter', mode: 'markers', name: 'Jan 2025 (actual)',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.jan25) : facs.map(() => 0),
      marker: { size: 14, color: C_RED, symbol: 'circle', line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{y}</b><br>Jan 2025: %{x} tests<extra></extra>',
    },
    {
      type: 'scatter', mode: 'markers', name: 'Jan 2026 (actual)',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.jan26) : facs.map(() => 0),
      marker: { size: 14, color: C_AMBER, symbol: 'circle', line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{y}</b><br>Jan 2026: %{x} tests<extra></extra>',
    },
  ];

  const layout = {
    ...BL, height: 240,
    margin: { t: 12, b: 50, l: 85, r: 24 },
    xaxis: {
      title: { text: 'Number of diagnostic test types available', font: { size: 11 } },
      gridcolor: '#EDE9E1', gridwidth: 1, zeroline: false,
    },
    yaxis: { showgrid: false, tickfont: { size: 12 } },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.3, font: { size: 11 } },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '240px' }} />
  );
}

/* ── 4. Treemap — NQAS certification coverage ────────────────────── */
function NQASTreemap() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const certPct = ready ? ['', ...NQAS_DATA.map(d => d.pct)] : Array(6).fill(0);

  const data = [{
    type: 'treemap',
    ids:     ['root', ...NQAS_DATA.map(d => d.facility)],
    labels:  ['499 Facilities', ...NQAS_DATA.map(d => `${d.facility}\n${d.total} fac · ${d.pct.toFixed(1)}%`)],
    parents: ['', ...NQAS_DATA.map(() => 'root')],
    values:  [0,  ...NQAS_DATA.map(d => d.total)],
    marker: {
      colors: certPct,
      colorscale: [[0, '#FEE2E2'], [0.3, '#FEF3C7'], [0.7, '#D1FAE5'], [1, '#6EE7B7']],
      showscale: true,
      cmin: 0, cmax: 10,
      colorbar: {
        title: { text: '% Certified', font: { size: 10 } },
        ticksuffix: '%', len: 0.6, thickness: 10, x: 1.01,
        tickfont: { size: 9 },
      },
    },
    textinfo: 'label',
    textfont: { size: 13, family: "'Inter',sans-serif" },
    hovertemplate: '<b>%{label}</b><br>Total: %{value} facilities<extra></extra>',
    pathbar: { visible: false },
    tiling: { packing: 'squarify', squarifyratio: 1 },
  }];

  const layout = { ...BL, height: 280, margin: { t: 12, b: 12, l: 8, r: 64 } };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '280px' }} />
  );
}

/* ── 5. 100% stacked bar — IPHS facility compliance bands ────────── */
function IPHSFacilityChart() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 240); return () => clearTimeout(t); }, []);

  const facs   = IPHS_FACILITY.map(d => d.facility);
  const totals = IPHS_FACILITY.map(d => d.lt25 + d.p25_50 + d.p50_69 + d.p70_79 + d.gt80);
  const pct    = (key) => IPHS_FACILITY.map((d, i) =>
    ready ? +(d[key] / totals[i] * 100).toFixed(1) : 0
  );

  const data = [
    { type: 'bar', name: 'Aspirant <25%',      orientation: 'h', y: facs, x: pct('lt25'),   marker: { color: B1 }, hovertemplate: '<b>%{y}</b> · <25%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: 'Aspirant 25–50%',    orientation: 'h', y: facs, x: pct('p25_50'), marker: { color: B2 }, hovertemplate: '<b>%{y}</b> · 25-50%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: 'Progressive 50–69%', orientation: 'h', y: facs, x: pct('p50_69'), marker: { color: B3 }, hovertemplate: '<b>%{y}</b> · 50-69%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: 'Progressive 70–79%', orientation: 'h', y: facs, x: pct('p70_79'), marker: { color: B4 }, hovertemplate: '<b>%{y}</b> · 70-79%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: 'Compliant >80%',     orientation: 'h', y: facs, x: pct('gt80'),   marker: { color: B5 }, hovertemplate: '<b>%{y}</b> · >80%: %{x:.1f}%<extra></extra>' },
  ];

  const layout = {
    ...BL, height: 240,
    margin: { t: 12, b: 58, l: 55, r: 16 },
    barmode: 'stack', bargap: 0.3,
    xaxis: { range: [0, 100], ticksuffix: '%', gridcolor: '#EDE9E1' },
    yaxis: { showgrid: false, tickfont: { size: 12 } },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.32, font: { size: 10 } },
    transition: { duration: 700, easing: 'cubic-in-out' },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '240px' }} />
  );
}

/* ── 6. Radar — IPHS domain compliance shape ─────────────────────── */
function IPHSDomainRadar() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t); }, []);

  const domains  = IPHS_DOMAIN.map(d => d.domain);
  const theta    = [...domains, domains[0]];
  const aspirant = IPHS_DOMAIN.map(d => +(d.lt25 + d.p25_50).toFixed(1));
  const compliant = IPHS_DOMAIN.map(d => d.compliant);

  const r1 = ready ? [...aspirant,  aspirant[0]]  : Array(domains.length + 1).fill(0);
  const r2 = ready ? [...compliant, compliant[0]] : Array(domains.length + 1).fill(0);

  const data = [
    {
      type: 'scatterpolar', mode: 'lines+markers', name: 'Aspirant (<50%)',
      r: r1, theta,
      fill: 'toself', fillcolor: 'rgba(239,68,68,0.12)',
      line: { color: C_RED, width: 2 },
      marker: { size: 8, color: C_RED, line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{theta}</b><br>Aspirant: %{r}%<extra></extra>',
    },
    {
      type: 'scatterpolar', mode: 'lines+markers', name: 'Compliant (>80%)',
      r: r2, theta,
      fill: 'toself', fillcolor: 'rgba(16,185,129,0.22)',
      line: { color: C_GREEN, width: 2.5 },
      marker: { size: 9, color: C_GREEN, line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{theta}</b><br>Compliant: %{r}%<extra></extra>',
    },
  ];

  const layout = {
    ...BL, height: 320,
    polar: {
      radialaxis: {
        range: [0, 100], ticksuffix: '%',
        tickfont: { size: 9 }, gridcolor: '#E2E8F0', linecolor: '#CBD5E1', angle: 90,
      },
      angularaxis: { tickfont: { size: 11, color: C_NAVY } },
      bgcolor: 'transparent',
    },
    showlegend: true,
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.08, font: { size: 11 } },
    margin: { t: 20, b: 52, l: 44, r: 44 },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '320px' }} />
  );
}

/* ════════════════════════════════════════════════════════════════════
   UI HELPERS
   ════════════════════════════════════════════════════════════════════ */

function StatTile({ label, value, sub, accent, large }) {
  return (
    <div className="dd-stat-tile">
      <div className="dd-stat-val" style={{ color: accent || C_NAVY, fontSize: large ? 28 : 22 }}>
        {value}
      </div>
      <div className="dd-stat-lbl">{label}</div>
      {sub && <div className="dd-stat-sub">{sub}</div>}
    </div>
  );
}

function SectionBand({ title, subtitle, color }) {
  return (
    <div className="dd-section-band" style={{ borderLeftColor: color }}>
      <span className="dd-section-title" style={{ color }}>{title}</span>
      <span className="hrh-cs-src">{subtitle}</span>
    </div>
  );
}

/* ── Top-of-page 3-pillar headline strip ─────────────────────────── */
function PillarStrip() {
  const pillars = [
    { label: 'FDSI',          stat: '<25%',  sub: 'Stock availability across facilities', color: C_RED,   bg: '#FFF0F0', border: '#FED7D7' },
    { label: 'NQAS',          stat: '5.21%', sub: 'Facilities NQAS certified',            color: C_AMBER, bg: '#FFFBEB', border: '#FDE68A' },
    { label: 'IPHS Compliant',stat: '2%',    sub: 'Facilities scoring >80%',              color: C_RED,   bg: '#FFF0F0', border: '#FED7D7' },
  ];
  return (
    <div className="dd-pillar-strip">
      {pillars.map((p) => (
        <div key={p.label} className="dd-pillar-card"
          style={{ background: p.bg, borderColor: p.border }}>
          <div className="dd-pillar-label">{p.label}</div>
          <div className="dd-pillar-stat" style={{ color: p.color }}>{p.stat}</div>
          <div className="dd-pillar-sub">{p.sub}</div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════ */
export default function DrugsDiagnosticsPage({ division, onBack }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Set initial state immediately so there's no single-frame flash
    gsap.set(root.querySelectorAll('.dd-section'), { opacity: 0, y: 22 });
    gsap.set(root.querySelectorAll('.detail-card'), { opacity: 0, y: 14, scale: 0.97 });
    gsap.set(root.querySelectorAll('.dd-stat-tile'), { opacity: 0, scale: 0.82, y: 6 });
    gsap.set(root.querySelectorAll('.dd-pillar-card'), { opacity: 0, y: 18, scale: 0.94 });
    gsap.set(root.querySelectorAll('.dd-section-band'), { opacity: 0, x: -18 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25 })
      .to(root.querySelectorAll('.dd-pillar-card'),
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.09, ease: 'back.out(1.5)' }, '-=0.05')
      .to(root.querySelectorAll('.dd-section'),
        { opacity: 1, y: 0, duration: 0.46, stagger: 0.07 }, '-=0.2')
      .to(root.querySelectorAll('.dd-section-band'),
        { opacity: 1, x: 0, duration: 0.36, stagger: 0.1 }, '<0.1')
      .to(root.querySelectorAll('.detail-card'),
        { opacity: 1, y: 0, scale: 1, duration: 0.38, stagger: 0.06 }, '<0.05')
      .to(root.querySelectorAll('.dd-stat-tile'),
        { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'back.out(1.7)' }, '<0.1');

    return () => tl.kill();
  }, []);

  return (
    <div className="ncd-root" ref={rootRef}>

      {/* ── Topbar ────────────────────────────────────────────── */}
      <div className="ncd-topbar">
        <div className="ncd-topbar-inner">
          <button className="back-btn" onClick={onBack}>
            <span className="back-chevron">←</span> Back
          </button>
          <div className="detail-breadcrumb">
            <span className="detail-div-tag">{division?.label}</span>
            <span className="detail-prog-name">Drugs &amp; Diagnostics</span>
          </div>
          <div className="status-pill st-red">Critical</div>
        </div>
      </div>

      <div className="ncd-content">

        {/* Page header + 3-pillar strip */}
        <div className="dd-section">
          <div className="kd-prog-header" style={{ marginBottom: 16 }}>
            <div className="kd-prog-header-left">
              <div className="kd-prog-name">Drugs &amp; Diagnostics</div>
              <div className="kd-prog-summary">
                Free Drug Service Initiative · National Quality Assurance Standards · IPHS Compliance
              </div>
            </div>
            <div className="status-pill st-red" style={{ flexShrink: 0 }}>Immediate Attention Required</div>
          </div>
          <PillarStrip />
        </div>

        {/* ══ SECTION 1: FDSI ══════════════════════════════════ */}
        <div className="dd-section">
          <SectionBand
            title="Free Drug Service Initiative (FDSI)"
            subtitle="HSS · NHM NPCC 2025-26 · Slides 2 & 4"
            color="#D97706"
          />
        </div>

        {/* Stock gauges + EML radar */}
        <div className="dd-section detail-two-col">

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Stock Availability by Facility</h3>
              <span className="detail-card-note">As reported by state · DVDMS Dashboard</span>
            </div>
            <StockGauges />
            <div className="dd-challenge-box">
              <div className="dd-challenge-title">Critical Finding</div>
              <div className="dd-challenge-item">All facilities below 25% — no facility near the 50% DVDMS benchmark</div>
              <div className="dd-challenge-item">No centralized procurement system; DVDMS not onboarded for drug distribution</div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>IPHS EML Compliance — Radar</h3>
              <span className="detail-card-note">% of IPHS Essential Medicines listed &amp; available · 80% target shown</span>
            </div>
            <EMLRadar />
            <div className="dd-stat-grid" style={{ marginTop: 14 }}>
              <StatTile label="EDL Notified" value="2024"  accent={C_TEAL}  />
              <StatTile label="Warehouses"   value="30"    accent={C_TEAL}  />
              <StatTile label="Active RCs"   value="86"    sub="State reported" accent={C_AMBER} />
              <StatTile label="DVDMS RCs"    value="5"     sub="of 86 active"   accent={C_RED}   />
            </div>
          </div>
        </div>

        {/* Diagnostic tests dumbbell */}
        <div className="dd-section">
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Diagnostic Tests — Progress vs FDSI Mandate</h3>
              <span className="detail-card-note">
                Each row: progress Jan 2025 → Jan 2026 (line) vs FDSI target (◆). Hover for exact values.
              </span>
            </div>
            <DiagDumbbell />
            <div className="dd-ratio-band">
              <div className="dd-ratio-item">
                <div className="dd-ratio-val" style={{ color: C_RED }}>1 : 1</div>
                <div className="dd-ratio-lbl">State Avg<br />Patient : Test</div>
              </div>
              <div className="dd-ratio-divider" />
              <div className="dd-ratio-item">
                <div className="dd-ratio-val" style={{ color: C_TEAL }}>1 : 3</div>
                <div className="dd-ratio-lbl">National<br />Average</div>
              </div>
              <div className="dd-ratio-divider" />
              <div className="dd-ratio-item">
                <div className="dd-ratio-val" style={{ color: C_RED }}>67</div>
                <div className="dd-ratio-lbl">Largest Gap<br />(CHC)</div>
              </div>
              <div className="dd-ratio-divider" />
              <div className="dd-ratio-item">
                <div className="dd-ratio-val" style={{ color: C_AMBER }}>+3–10</div>
                <div className="dd-ratio-lbl">YoY Tests<br />Improvement</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: NQAS ══════════════════════════════════ */}
        <div className="dd-section">
          <SectionBand
            title="National Quality Assurance Standards (NQAS)"
            subtitle="HSS · NHM NPCC 2025-26 · Slides 7 & 8"
            color={C_TEAL}
          />
        </div>

        <div className="dd-section detail-two-col">

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Certification Coverage — Treemap</h3>
              <span className="detail-card-note">Box size = total facilities · Colour = % certified (red→green)</span>
            </div>
            <NQASTreemap />
            <div className="dd-nqas-summary">
              <div className="dd-nqas-big">
                <div className="dd-nqas-pct">5.21%</div>
                <div className="dd-nqas-label">Overall certified</div>
              </div>
              <div className="dd-nqas-detail">
                <div>State certified: <strong>15</strong></div>
                <div>National certified: <strong>11</strong></div>
                <div>Recertification due: <strong>0</strong></div>
                <div>Last SQAC: <strong>Feb 2026</strong></div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Quality Ecosystem</h3>
              <span className="detail-card-note">Assessors, certifications &amp; quality programs</span>
            </div>
            <div className="dd-stat-grid" style={{ marginTop: 12 }}>
              <StatTile label="Internal Assessors" value="99"  accent={C_TEAL}  />
              <StatTile label="External Assessors" value="19"  accent={C_TEAL}  />
              <StatTile label="LaQshya Certified"  value="7"   sub="4 LR · 3 Maternity OT" accent={C_AMBER} />
              <StatTile label="Kayakalp"           value="25"  sub="compliant FY 2024-25"   accent={C_AMBER} />
              <StatTile label="MusQan Certified"   value="Nil" accent={C_RED} />
              <StatTile label="Ayushman Assessors" value="0"   accent={C_RED} />
            </div>
            <div className="dd-challenge-box" style={{ marginTop: 16, background: '#F0FFF4', borderColor: '#C6F6D5' }}>
              <div className="dd-challenge-title" style={{ color: '#276749' }}>NQAS Pipeline</div>
              <div className="dd-challenge-item" style={{ color: '#1C4532' }}>
                87 internal assessments done · 23 scored &gt;70% → eligible for NQAS push
              </div>
              <div className="dd-challenge-item" style={{ color: '#1C4532' }}>
                IA Training: 1 batch (Aug 2023) + Refresher (May 2025)
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION 3: IPHS COMPLIANCE ═══════════════════════ */}
        <div className="dd-section">
          <SectionBand
            title="IPHS Compliance"
            subtitle="IPHS Dashboard · 20 March 2026 · Slides 10 & 11"
            color="#7C3AED"
          />
        </div>

        <div className="dd-section detail-two-col">

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Compliance Band by Facility Type</h3>
              <span className="detail-card-note">609 facilities assessed · Aspirant → Progressive → Compliant</span>
            </div>
            <IPHSFacilityChart />
            <div className="dd-iphs-callout">
              <span style={{ color: C_RED, fontWeight: 700 }}>Only 2% fully compliant</span>
              &nbsp;(1 DH + 9 SHC) &nbsp;·&nbsp; 59% remain in Aspirant band (&lt;50%) &nbsp;·&nbsp;
              No facility shortfall in rural areas (HDI 2022-23)
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Domain Compliance Shape — Radar</h3>
              <span className="detail-card-note">Aspirant vs Compliant · All 6 IPHS domains · Mar 2026</span>
            </div>
            <IPHSDomainRadar />
            <div className="dd-iphs-callout">
              <span style={{ color: C_GREEN, fontWeight: 700 }}>Human Resource leads at 44%</span>
              &nbsp;compliant &nbsp;·&nbsp;
              <span style={{ color: C_RED, fontWeight: 700 }}>Drugs worst at 1.6%</span>
              &nbsp;·&nbsp; Minor gains in Diagnostics, Governance &amp; Services vs MTR 2025
            </div>
          </div>
        </div>

      </div>

      <footer className="detail-footer">
        Sources: NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026 ·
        IPHS Dashboard 20 March 2026 · FDSI Review 2025-26 · NQAS Status Report.
      </footer>
    </div>
  );
}
