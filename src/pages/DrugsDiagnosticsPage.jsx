// HSS / Drugs & Diagnostics
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Plot from 'react-plotly.js';

const C_TEAL  = '#0E9E8A';
const C_AMBER = '#F59E0B';
const C_RED   = '#E53E3E';
const C_NAVY  = '#1A1F36';
const C_SLATE = '#475569';
const C_GREEN = '#10B981';

const PC = { displayModeBar: false, responsive: true };
const BL = {
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { family: "'Inter','DM Sans',sans-serif", size: 12, color: C_SLATE },
  autosize: true,
};

const DRUG_AVAIL = [
  { facility: 'DH',      stock: 16.12 },
  { facility: 'CHC',     stock: 12.20 },
  { facility: 'AAM-PHC', stock: 24.00 },
  { facility: 'AAM-SHC', stock: 21.56 },
];

const DIAG_TESTS = [
  { facility: 'AAM-SHC', fdsi: 14,  jan25: 5,  jan26: 7  },
  { facility: 'AAM-PHC', fdsi: 63,  jan25: 8,  jan26: 18 },
  { facility: 'CHC',     fdsi: 97,  jan25: 13, jan26: 30 },
  { facility: 'DH',      fdsi: 134, jan25: 55, jan26: 68 },
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

/* ── 1. Drug Stock — Plotly horizontal bar ───────────────────────── */
function StockBar() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 160); return () => clearTimeout(t); }, []);

  const facs = DRUG_AVAIL.map(d => d.facility);
  const vals = ready ? DRUG_AVAIL.map(d => d.stock) : facs.map(() => 0);

  const data = [
    {
      type: 'bar', orientation: 'h',
      y: facs, x: vals,
      marker: {
        color: DRUG_AVAIL.map(d => d.stock < 20 ? C_RED : C_AMBER),
        line: { width: 0 },
      },
      text: ready ? DRUG_AVAIL.map(d => `${d.stock}%`) : [],
      textposition: 'outside',
      textfont: { size: 12, color: C_SLATE, family: "'JetBrains Mono',monospace" },
      hovertemplate: '<b>%{y}</b><br>%{x:.2f}% in stock<extra></extra>',
    },
    {
      type: 'scatter', mode: 'lines', name: '50% benchmark',
      x: [50, 50], y: [facs[0], facs[facs.length - 1]],
      line: { color: '#94A3B8', width: 1.5, dash: 'dot' },
      hoverinfo: 'skip',
    },
  ];

  const layout = {
    ...BL, height: 210,
    margin: { t: 10, b: 32, l: 80, r: 64 },
    xaxis: {
      range: [0, 60], ticksuffix: '%',
      gridcolor: '#EDE9E1', zeroline: false,
      tickfont: { size: 11 },
    },
    yaxis: { showgrid: false, tickfont: { size: 12 } },
    bargap: 0.38,
    showlegend: false,
    annotations: [{
      x: 50, y: -0.22, xref: 'x', yref: 'paper',
      text: '50% target', showarrow: false,
      font: { size: 10, color: '#94A3B8' },
    }],
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '210px' }} />
  );
}

/* ── 2. Diagnostic tests — dumbbell ─────────────────────────────── */
function DiagDumbbell() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 260); return () => clearTimeout(t); }, []);

  const facs = DIAG_TESTS.map(d => d.facility);
  const lines = facs.map((fac, i) => ({
    type: 'scatter', mode: 'lines',
    x: ready ? [DIAG_TESTS[i].jan25, DIAG_TESTS[i].jan26] : [0, 0],
    y: [fac, fac],
    line: { color: '#CBD5E1', width: 3 },
    showlegend: false, hoverinfo: 'skip',
  }));

  const data = [
    ...lines,
    {
      type: 'scatter', mode: 'markers', name: 'FDSI Target',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.fdsi) : facs.map(() => 0),
      marker: { symbol: 'diamond', size: 13, color: '#E2E8F0', line: { color: '#94A3B8', width: 2 } },
      hovertemplate: '<b>%{y}</b><br>FDSI Target: %{x} tests<extra></extra>',
    },
    {
      type: 'scatter', mode: 'markers', name: 'Jan 2025',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.jan25) : facs.map(() => 0),
      marker: { size: 13, color: C_RED, line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{y}</b><br>Jan 2025: %{x} tests<extra></extra>',
    },
    {
      type: 'scatter', mode: 'markers', name: 'Jan 2026',
      y: facs, x: ready ? DIAG_TESTS.map(d => d.jan26) : facs.map(() => 0),
      marker: { size: 13, color: C_AMBER, line: { color: '#fff', width: 1.5 } },
      hovertemplate: '<b>%{y}</b><br>Jan 2026: %{x} tests<extra></extra>',
    },
  ];

  const layout = {
    ...BL, height: 230,
    margin: { t: 12, b: 46, l: 82, r: 18 },
    xaxis: {
      title: { text: 'Test types available', font: { size: 11 } },
      gridcolor: '#EDE9E1', zeroline: false,
    },
    yaxis: { showgrid: false, tickfont: { size: 12 } },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.28, font: { size: 11 } },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '230px' }} />
  );
}

/* ── 3. NQAS — treemap ───────────────────────────────────────────── */
function NQASTreemap() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  const certPct = ready ? ['', ...NQAS_DATA.map(d => d.pct)] : Array(6).fill(0);

  const data = [{
    type: 'treemap',
    ids:     ['root', ...NQAS_DATA.map(d => d.facility)],
    labels:  ['499 Facilities', ...NQAS_DATA.map(d => `${d.facility}\n${d.total} · ${d.pct.toFixed(1)}%`)],
    parents: ['', ...NQAS_DATA.map(() => 'root')],
    values:  [0,  ...NQAS_DATA.map(d => d.total)],
    marker: {
      colors: certPct,
      colorscale: [[0, '#FEE2E2'], [0.3, '#FEF3C7'], [0.7, '#D1FAE5'], [1, '#6EE7B7']],
      showscale: true,
      cmin: 0, cmax: 10,
      colorbar: {
        title: { text: '% Certified', font: { size: 10 } },
        ticksuffix: '%', len: 0.65, thickness: 10, x: 1.01,
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

/* ── 4. IPHS — stacked horizontal bar ───────────────────────────── */
function IPHSBar() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 240); return () => clearTimeout(t); }, []);

  const facs   = IPHS_FACILITY.map(d => d.facility);
  const totals = IPHS_FACILITY.map(d => d.lt25 + d.p25_50 + d.p50_69 + d.p70_79 + d.gt80);
  const pct    = key => IPHS_FACILITY.map((d, i) =>
    ready ? +(d[key] / totals[i] * 100).toFixed(1) : 0
  );

  const data = [
    { type: 'bar', name: '<25%',   orientation: 'h', y: facs, x: pct('lt25'),   marker: { color: '#F87171' }, hovertemplate: '<b>%{y}</b> · <25%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: '25–50%', orientation: 'h', y: facs, x: pct('p25_50'), marker: { color: '#FCA5A5' }, hovertemplate: '<b>%{y}</b> · 25-50%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: '50–69%', orientation: 'h', y: facs, x: pct('p50_69'), marker: { color: '#FCD34D' }, hovertemplate: '<b>%{y}</b> · 50-69%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: '70–79%', orientation: 'h', y: facs, x: pct('p70_79'), marker: { color: '#A7F3D0' }, hovertemplate: '<b>%{y}</b> · 70-79%: %{x:.1f}%<extra></extra>' },
    { type: 'bar', name: '>80%',   orientation: 'h', y: facs, x: pct('gt80'),   marker: { color: C_GREEN  }, hovertemplate: '<b>%{y}</b> · >80%: %{x:.1f}%<extra></extra>' },
  ];

  const layout = {
    ...BL, height: 230,
    margin: { t: 12, b: 52, l: 50, r: 16 },
    barmode: 'stack', bargap: 0.32,
    xaxis: { range: [0, 100], ticksuffix: '%', gridcolor: '#EDE9E1' },
    yaxis: { showgrid: false, tickfont: { size: 12 } },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.34, font: { size: 10 } },
  };

  return (
    <Plot data={data} layout={layout} config={PC}
      useResizeHandler style={{ width: '100%', height: '230px' }} />
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
    gsap.set(root.querySelectorAll('.dd2-card'), { opacity: 0, y: 16 });
    gsap.set(root.querySelectorAll('.dd2-kpi'), { opacity: 0, scale: 0.92, y: 10 });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.22 })
      .to(root.querySelectorAll('.dd2-kpi'),
        { opacity: 1, scale: 1, y: 0, duration: 0.36, stagger: 0.08, ease: 'back.out(1.4)' }, '-=0.05')
      .to(root.querySelectorAll('.dd2-card'),
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, '-=0.1');
    return () => tl.kill();
  }, []);

  const kpis = [
    { label: 'Drug Stock Availability', value: '<25%',  sub: 'All facilities · DVDMS 50% target', color: C_RED,   bg: '#FFF5F5', border: '#FED7D7' },
    { label: 'NQAS Certified',          value: '5.21%', sub: '26 of 499 facilities certified',    color: C_AMBER, bg: '#FFFBEB', border: '#FDE68A' },
    { label: 'IPHS Compliant',          value: '2%',    sub: '10 of 609 facilities above 80%',    color: C_RED,   bg: '#FFF5F5', border: '#FED7D7' },
  ];

  return (
    <div className="ncd-root" ref={rootRef}>

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

        <div className="dd2-page-header">
          <div className="kd-prog-name">Drugs &amp; Diagnostics</div>
          <div className="kd-prog-summary">
            Free Drug Service Initiative · NQAS · IPHS Compliance · NHM Arunachal Pradesh 2025-26
          </div>
        </div>

        {/* 3 headline KPIs */}
        <div className="dd2-kpi-strip">
          {kpis.map(k => (
            <div key={k.label} className="dd2-kpi"
              style={{ background: k.bg, borderColor: k.border }}>
              <div className="dd2-kpi-label">{k.label}</div>
              <div className="dd2-kpi-val" style={{ color: k.color }}>{k.value}</div>
              <div className="dd2-kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Row 1: Drug stock + Diagnostics */}
        <div className="detail-two-col dd2-row">

          <div className="dd2-card detail-card">
            <div className="detail-card-header">
              <h3>Drug Stock Availability</h3>
              <span className="detail-card-note">% IPHS essential drugs in stock · DVDMS 2025-26</span>
            </div>
            <StockBar />
            <div className="dd2-stat-row">
              <div className="dd2-stat"><span style={{ color: C_TEAL }}>EDL 2024</span><span>notified</span></div>
              <div className="dd2-stat"><span style={{ color: C_TEAL }}>30</span><span>warehouses</span></div>
              <div className="dd2-stat"><span style={{ color: C_AMBER }}>86</span><span>active RCs</span></div>
              <div className="dd2-stat"><span style={{ color: C_RED }}>5 / 86</span><span>on DVDMS</span></div>
            </div>
          </div>

          <div className="dd2-card detail-card">
            <div className="detail-card-header">
              <h3>Diagnostic Tests Progress</h3>
              <span className="detail-card-note">Jan 2025 → Jan 2026 vs FDSI mandate (◆)</span>
            </div>
            <DiagDumbbell />
            <div className="dd2-note">
              State avg 1:1 patient-to-test ratio vs national 1:3 &mdash;
              YoY improvement of +3 to +10 tests per facility type
            </div>
          </div>

        </div>

        {/* Row 2: NQAS treemap + IPHS stacked bar */}
        <div className="detail-two-col dd2-row">

          <div className="dd2-card detail-card">
            <div className="detail-card-header">
              <h3>NQAS Certification Coverage</h3>
              <span className="detail-card-note">Box size = total facilities · Colour = % certified</span>
            </div>
            <NQASTreemap />
            <div className="dd2-stat-row">
              <div className="dd2-stat"><span style={{ color: C_TEAL }}>99</span><span>int. assessors</span></div>
              <div className="dd2-stat"><span style={{ color: C_TEAL }}>87</span><span>IA done</span></div>
              <div className="dd2-stat"><span style={{ color: C_AMBER }}>23</span><span>eligible &gt;70%</span></div>
              <div className="dd2-stat"><span style={{ color: C_AMBER }}>7</span><span>LaQshya</span></div>
            </div>
          </div>

          <div className="dd2-card detail-card">
            <div className="detail-card-header">
              <h3>IPHS Compliance Bands</h3>
              <span className="detail-card-note">609 facilities · Aspirant → Progressive → Compliant</span>
            </div>
            <IPHSBar />
            <div className="dd2-note">
              Only <strong>2%</strong> fully compliant (&gt;80%) &mdash;
              59% remain in Aspirant band (&lt;50%) across all facility types
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
