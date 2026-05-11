import { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import Plot from 'react-plotly.js';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ── Sheet config ────────────────────────────────────────────────── */
const SHEET_ID = '1vsCSdPZpBK5SQw9gppRLEEKDLhj19DHk';
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

const MONTH_ORDER = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const MONTH_SHORT  = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const DISTRICTS    = [
  'Changlang','Dibang Valley','East Kameng','Anjaw','East Siang','Kamle',
  'Kra Daadi','Kurung Kumey','Leparada','Lohit','Longding',
  'Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai',
  'Pakke Kessang','Papum Pare','Shi Yomi','Siang','Tawang','Tirap',
  'Upper Siang','Upper Subansiri','West Kameng','West Siang',
];

/* ── Status helpers ──────────────────────────────────────────────── */
function kdStatus(kd) {
  if (kd.achievement == null || kd.target == null) return 'neutral';
  const gap = kd.lowerIsBetter ? kd.target - kd.achievement : kd.achievement - kd.target;
  if (gap >= 0)    return 'achieved';
  if (gap >= -10)  return 'close';
  return 'gap';
}

const S_COLOR = { achieved:'#059669', close:'#D97706', gap:'#DC2626', neutral:'#94A3B8' };
const S_LABEL = { achieved:'Achieved', close:'Near Target', gap:'Gap', neutral:'No Data' };
const S_BG    = { achieved:'#ECFDF5', close:'#FFFBEB',    gap:'#FEF2F2', neutral:'#F8FAFC' };

function fmt(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 100000) return `${(n/100000).toFixed(1)}L`;
  if (n >= 1000)   return `${(n/1000).toFixed(1)}K`;
  return Number(n).toLocaleString();
}

/* ── CSV parser (handles quoted commas) ──────────────────────────── */
function parseCSV(text) {
  return text.trim().split('\n').map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"')              { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else                         { cur += ch; }
    }
    cols.push(cur.trim());
    return cols;
  });
}

/* ── HMIS fetch + parse ──────────────────────────────────────────── */
async function fetchHMIS(hmisCode, hmisCat) {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.replace(/"/g,'').trim());
  const COL = {
    year:  headers.findIndex(h => /^year$/i.test(h)),
    month: headers.findIndex(h => /^month$/i.test(h)),
    cat:   headers.findIndex(h => /^category$/i.test(h)),
    code:  headers.findIndex(h => /data item code/i.test(h)),
    name:  headers.findIndex(h => /data item name/i.test(h)),
  };
  const distCols = {};
  DISTRICTS.forEach(d => {
    const idx = headers.findIndex(h => h.toLowerCase() === d.toLowerCase());
    if (idx >= 0) distCols[d] = idx;
  });

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < 6) continue;
    const catMatch = r[COL.cat]?.replace(/"/g,'').match(/^(M\d+)/);
    if (!catMatch) continue;
    if (hmisCat && catMatch[1] !== hmisCat) continue;
    const code = r[COL.code]?.replace(/"/g,'').trim().replace(/\.$/, '');
    if (code !== hmisCode) continue;

    const distTotals = {};
    DISTRICTS.forEach(d => {
      const raw = r[distCols[d]]?.replace(/"/g,'').replace(/,/g,'').trim();
      distTotals[d] = parseFloat(raw) || 0;
    });
    const stateTotal = Object.values(distTotals).reduce((s, v) => s + v, 0);

    out.push({
      year:  r[COL.year]?.replace(/"/g,'').trim(),
      month: r[COL.month]?.replace(/"/g,'').trim(),
      code, stateTotal, distTotals,
    });
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════
   PLOTLY ACHIEVEMENT CHART — sunburst showing FY / NFHS-5 / NFHS-4
   ══════════════════════════════════════════════════════════════════ */
function PlotlyAchievementChart({ indicator, status, nfhsRows }) {
  /* Normalise to 0-100 scale */
  const achievement = indicator?.achievement;
  const target      = indicator?.target;
  const unit        = indicator?.unit ?? '%';
  const isPercent   = unit === '%';

  function normPct(val) {
    if (val == null) return null;
    if (isPercent) return Math.min(Math.max(val, 0), 100);
    if (target) return Math.min(Math.max((val / target) * 100, 0), 100);
    return null;
  }

  const achNorm = normPct(achievement);
  const achPct  = achNorm ?? 0;

  /* NFHS context */
  const nfhs5Row = nfhsRows?.find(r => r.unit === '%' && r.nfhs5 != null);
  const nfhs4Row = nfhsRows?.find(r => r.unit === '%' && r.nfhs4 != null);
  const n5Pct    = nfhs5Row?.nfhs5 != null ? Math.min(Math.max(nfhs5Row.nfhs5, 0), 100) : null;
  const n4Pct    = nfhs4Row?.nfhs4 != null ? Math.min(Math.max(nfhs4Row.nfhs4, 0), 100) : null;

  const stColor = S_COLOR[status] || S_COLOR.neutral;

  /* Center annotation values */
  const centerVal = achievement != null
    ? (isPercent ? `${Number(achievement).toFixed(1)}%` : fmt(achievement))
    : '—';
  const targetStr = target != null
    ? (isPercent ? `target ${target}%` : `target ${fmt(target)}`)
    : '';

  /* Build sunburst data */
  let ids, labels, parents, values, colors, hovertemplates;

  if (n5Pct == null) {
    /* Simplified single-ring: just FY branch */
    ids     = ['root', 'fy-a', 'fy-r'];
    labels  = ['', `${achPct.toFixed(1)}%`, ''];
    parents = ['', 'root', 'root'];
    values  = [100, achPct, 100 - achPct];
    colors  = ['rgba(0,0,0,0)', stColor, '#E2E8F0'];
    hovertemplates = [
      '<extra></extra>',
      `<b>FY 2025-26 Achieved</b><br>${indicator?.achievedLabel ?? centerVal}<extra></extra>`,
      `<b>Gap to target</b><br>${targetStr}<extra></extra>`,
    ];
  } else {
    /* Full three-branch sunburst */
    ids     = ['root', 'fy', 'n5', 'n4', 'fy-a', 'fy-r', 'n5-a', 'n5-r', 'n4-a', 'n4-r'];
    labels  = [
      '',
      'FY 2025-26', 'NFHS-5', 'NFHS-4',
      `${achPct.toFixed(1)}%`, '',
      `${n5Pct.toFixed(1)}%`, '',
      `${(n4Pct ?? 0).toFixed(1)}%`, '',
    ];
    parents = ['', 'root', 'root', 'root', 'fy', 'fy', 'n5', 'n5', 'n4', 'n4'];
    values  = [
      300, 100, 100, 100,
      achPct, 100 - achPct,
      n5Pct, 100 - n5Pct,
      n4Pct ?? 50, n4Pct != null ? 100 - n4Pct : 50,
    ];
    colors = [
      'rgba(0,0,0,0)',
      stColor, '#60A5FA', '#94A3B8',
      stColor, '#E2E8F0',
      '#60A5FA', '#E2E8F0',
      '#94A3B8', '#E2E8F0',
    ];
    hovertemplates = [
      '<extra></extra>',
      `<b>FY 2025-26</b><extra></extra>`,
      `<b>NFHS-5</b><extra></extra>`,
      `<b>NFHS-4</b><extra></extra>`,
      `<b>FY 2025-26 Achieved</b><br>${indicator?.achievedLabel ?? centerVal}<extra></extra>`,
      `<b>Gap to target</b><br>${targetStr}<extra></extra>`,
      `<b>NFHS-5</b><br>${nfhs5Row?.nfhs5}${nfhs5Row?.unit ?? ''}<extra></extra>`,
      `<b>NFHS-5 Remaining</b><extra></extra>`,
      `<b>NFHS-4</b><br>${nfhs4Row?.nfhs4 ?? '—'}${nfhs4Row?.unit ?? ''}<extra></extra>`,
      `<b>NFHS-4 Remaining</b><extra></extra>`,
    ];
  }

  const trace = {
    type: 'sunburst',
    ids,
    labels,
    parents,
    values,
    branchvalues: 'total',
    marker: { colors },
    hovertemplate: hovertemplates,
    textfont: { family: "'Inter', sans-serif", size: 13 },
    insidetextorientation: 'radial',
    leaf: { opacity: 0.92 },
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor:  'transparent',
    margin: { t: 10, b: 10, l: 10, r: 10 },
    height: 420,
    annotations: [{
      x: 0.5, y: 0.5,
      xref: 'paper', yref: 'paper',
      text: `<b>${centerVal}</b><br><span style="font-size:11px;color:#94A3B8">${targetStr}</span>`,
      showarrow: false,
      font: {
        family: "'JetBrains Mono', monospace",
        size: 28,
        color: achNorm != null ? stColor : '#CBD5E1',
      },
      align: 'center',
    }],
  };

  const config = { displayModeBar: false, responsive: true };

  return (
    <div className="sunburst-wrap">
      <Plot
        data={[trace]}
        layout={layout}
        config={config}
        style={{ width: '100%' }}
        useResizeHandler
      />
      {/* Legend row */}
      <div className="sb-legend">
        <div className="sb-leg-item">
          <span className="sb-leg-swatch" style={{ background: stColor }} />
          <span><strong>FY 2025-26:</strong> {indicator?.achievedLabel ?? '—'}</span>
        </div>
        {n5Pct != null && (
          <div className="sb-leg-item">
            <span className="sb-leg-swatch" style={{ background: '#60A5FA' }} />
            <span><strong>NFHS-5:</strong> {nfhs5Row?.nfhs5}{nfhs5Row?.unit}&ensp;
              <span className="sb-leg-caption">{nfhs5Row?.label?.slice(0, 46)}</span>
            </span>
          </div>
        )}
        {n4Pct != null && (
          <div className="sb-leg-item">
            <span className="sb-leg-swatch" style={{ background: '#94A3B8' }} />
            <span><strong>NFHS-4:</strong> {nfhs4Row?.nfhs4}{nfhs4Row?.unit}</span>
          </div>
        )}
        {target != null && (
          <div className="sb-leg-item">
            <span className="sb-leg-tick" />
            <span><strong>Target:</strong> {indicator?.targetLabel ?? target}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Custom tooltip ──────────────────────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ncd-tooltip">
      <div className="ncd-tip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="ncd-tip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span className="ncd-tip-val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main page component
   ══════════════════════════════════════════════════════════════════ */
export default function KDIndicatorDetail({ indicator, program, division, onBack }) {
  const wrapRef = useRef(null);
  const [rawRows,    setRawRows]    = useState(null);
  const [hmisError,  setHmisError]  = useState(null);
  const [hmisLoading,setHmisLoading]= useState(false);

  const st       = kdStatus(indicator ?? {});
  const stColor  = S_COLOR[st];

  /* HMIS fetch */
  useEffect(() => {
    if (!indicator?.hmisCode) return;
    setHmisLoading(true);
    setHmisError(null);
    fetchHMIS(indicator.hmisCode, indicator.hmisCat)
      .then(setRawRows)
      .catch(e => setHmisError(e.message))
      .finally(() => setHmisLoading(false));
  }, [indicator?.hmisCode, indicator?.hmisCat]);

  /* Monthly state trend (by year) */
  const trendData = useMemo(() => {
    if (!rawRows?.length) return [];
    const yearMap = {};
    rawRows.forEach(r => {
      if (!yearMap[r.year]) yearMap[r.year] = {};
      const moIdx = MONTH_ORDER.findIndex(m => m.toLowerCase() === r.month.toLowerCase());
      const moKey = moIdx >= 0 ? MONTH_SHORT[moIdx] : r.month.slice(0,3);
      yearMap[r.year][moKey] = (yearMap[r.year][moKey] ?? 0) + r.stateTotal;
    });
    const years = Object.keys(yearMap).sort();
    return MONTH_SHORT.map(mo => {
      const row = { month: mo };
      years.forEach(yr => { row[yr] = yearMap[yr]?.[mo] ?? 0; });
      return row;
    }).filter(row => years.some(yr => row[yr] > 0));
  }, [rawRows]);

  /* District breakdown (most recent year) — all districts, no slice limit */
  const distData = useMemo(() => {
    if (!rawRows?.length) return [];
    const latestYear = [...new Set(rawRows.map(r => r.year))].sort().at(-1);
    const distMap = {};
    rawRows.filter(r => r.year === latestYear).forEach(r => {
      Object.entries(r.distTotals).forEach(([d, v]) => {
        distMap[d] = (distMap[d] ?? 0) + v;
      });
    });
    return Object.entries(distMap)
      .map(([district, value]) => ({ district, value }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [rawRows]);

  const years = useMemo(() =>
    rawRows ? [...new Set(rawRows.map(r => r.year))].sort() : [],
  [rawRows]);

  /* NFHS rows */
  const nfhsRows = (program?.nfhsData ?? []).filter(d => d.nfhs4 != null || d.nfhs5 != null);

  /* GSAP entry */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.kdi-section', {
        y: 20, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out',
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [indicator?.no]);

  const handleBack = () => {
    gsap.to(wrapRef.current, {
      opacity: 0, y: -12, duration: 0.24, ease: 'power2.in', onComplete: onBack,
    });
  };

  const YEAR_COLORS = ['#0A7B6C', '#B45309', '#7C3AED'];

  return (
    <div className="ncd-root" ref={wrapRef}>

      {/* ── Topbar ───────────────────────────────────────────────── */}
      <div className="ncd-topbar">
        <div className="ncd-topbar-inner">
          <button className="back-btn" onClick={handleBack}>
            <span className="back-chevron">←</span> Back
          </button>
          <div className="detail-breadcrumb">
            <span className="detail-div-tag">{division?.label}</span>
            <span style={{ color:'#CBD5E1', fontSize:13 }}>›</span>
            <span className="detail-prog-name">{program?.name}</span>
            <span style={{ color:'#CBD5E1', fontSize:13 }}>›</span>
            <span style={{
              fontFamily:"'Inter',sans-serif", fontSize:13, fontWeight:600,
              color:'#475569', maxWidth:280, overflow:'hidden',
              textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>
              {indicator?.indicator}
            </span>
          </div>
          <div className="ncd-source-tag">FY 2025-26 · NHM Arunachal Pradesh</div>
        </div>
      </div>

      <div className="ncd-content">

        {/* ── KD meta strip ────────────────────────────────────────── */}
        <div className="kdi-section">
          <div className="kdi-meta-strip">
            <span className="kdi-no-badge" style={{ background:`${stColor}18`, color:stColor }}>
              KD {indicator?.no}
            </span>
            <span className="kdi-type-pill">{indicator?.type}</span>
            <span className="kdi-source-tag">Source: {indicator?.source}</span>
            <div className="kdi-name">{indicator?.indicator}</div>
            {indicator?.statement && (
              <div className="kdi-statement">{indicator.statement}</div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            PLOTLY ACHIEVEMENT SUNBURST
            ════════════════════════════════════════════════════════════ */}
        <div className="kdi-section">
          <div className="ncd-card kdi-dial-card">
            <div className="ncd-card-header">
              <h3>Achievement Overview — FY 2025-26</h3>
              <span className="ncd-card-note">
                Inner ring: time periods (FY 25-26 / NFHS-5 / NFHS-4)&ensp;&middot;&ensp;Outer ring: achieved vs gap
              </span>
            </div>
            <PlotlyAchievementChart
              indicator={indicator}
              status={st}
              nfhsRows={nfhsRows}
            />
          </div>
        </div>

        {/* ── Target vs Achievement details ────────────────────────── */}
        <div className="kdi-section">
          <div className="ncd-card">
            <div className="kdi-numbers">
              <div className="kdi-number-block">
                <div className="kdi-num-label">Target</div>
                <div className="kdi-target-num">
                  {indicator?.targetLabel ?? (indicator?.target != null ? `${indicator.target}${indicator?.unit ?? ''}` : '—')}
                </div>
              </div>
              <div className="kdi-number-block" style={{ flex: 1 }}>
                <div className="kdi-num-label">Achievement (FY 2025-26)</div>
                <div className="kdi-ach-num" style={{ color: stColor }}>
                  {indicator?.achievedLabel ?? (indicator?.achievement != null ? `${indicator.achievement}${indicator?.unit ?? ''}` : '—')}
                </div>
              </div>
              <div className="kdi-number-block">
                <div className="kdi-num-label">Status</div>
                <div className="kdi-status-chip" style={{ background: S_BG[st], color: stColor }}>
                  {S_LABEL[st]}
                </div>
              </div>
            </div>
            {indicator?.numerator != null && indicator?.denominator != null && (
              <div className="kdi-count-row">
                <span className="kdi-count-label">Numerator</span>
                <span className="kdi-count-val">{fmt(indicator.numerator)}</span>
                <span className="kdi-count-sep">/</span>
                <span className="kdi-count-label">Denominator</span>
                <span className="kdi-count-val">{fmt(indicator.denominator)}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── HMIS Monthly Trend ────────────────────────────────────── */}
        {indicator?.hmisCode && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>HMIS Monthly Trend</h3>
                <span className="ncd-card-note">
                  Code {indicator.hmisCode} · All 25 districts · State total
                </span>
              </div>

              {hmisLoading && (
                <div className="hmis-loading">
                  <div className="hmis-spinner" style={{ borderTopColor: stColor }} />
                  Loading HMIS data…
                </div>
              )}

              {hmisError && (
                <div className="hmis-error-card">
                  <div className="hmis-error-title">Unable to load HMIS data</div>
                  <div className="hmis-error-msg">{hmisError}</div>
                </div>
              )}

              {!hmisLoading && !hmisError && trendData.length > 0 && (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={trendData} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
                    <defs>
                      {years.map((yr, i) => (
                        <linearGradient key={yr} id={`kdi-grad-${yr}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={YEAR_COLORS[i % 3]} stopOpacity={0.22} />
                          <stop offset="95%" stopColor={YEAR_COLORS[i % 3]} stopOpacity={0.01} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={fmt} />
                    <Tooltip content={<ChartTip />} />
                    {years.map((yr, i) => (
                      <Area key={yr}
                        type="monotone"
                        dataKey={yr}
                        name={yr}
                        stroke={YEAR_COLORS[i % 3]}
                        fill={`url(#kdi-grad-${yr})`}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {!hmisLoading && !hmisError && trendData.length === 0 && rawRows !== null && (
                <div className="kd-empty-state">
                  No monthly HMIS data found for code {indicator.hmisCode}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── District breakdown ────────────────────────────────────── */}
        {distData.length > 0 && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>District Performance</h3>
                <span className="ncd-card-note">
                  HMIS · {years.at(-1)} cumulative · all districts
                </span>
              </div>
              {(() => {
                const sunLabels  = ['Arunachal Pradesh', ...distData.map(d => d.district)];
                const sunParents = ['', ...distData.map(() => 'Arunachal Pradesh')];
                const sunValues  = [
                  distData.reduce((s, d) => s + d.value, 0),
                  ...distData.map(d => d.value),
                ];
                const distTrace = {
                  type: 'sunburst',
                  labels: sunLabels,
                  parents: sunParents,
                  values: sunValues,
                  branchvalues: 'total',
                  marker: {
                    colorscale: [
                      [0, `${stColor}40`],
                      [1, stColor],
                    ],
                    colors: sunValues,
                    coloraxis: 'coloraxis',
                  },
                  hovertemplate: '<b>%{label}</b><br>%{value:,}<extra></extra>',
                  textfont: { family: "'Inter', sans-serif", size: 11 },
                  insidetextorientation: 'radial',
                  leaf: { opacity: 0.9 },
                };
                const distLayout = {
                  paper_bgcolor: 'transparent',
                  plot_bgcolor:  'transparent',
                  margin: { t: 10, b: 10, l: 10, r: 10 },
                  height: 380,
                  coloraxis: { showscale: false },
                };
                return (
                  <Plot
                    data={[distTrace]}
                    layout={distLayout}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                );
              })()}
            </div>
          </div>
        )}

        {/* ── NFHS Baseline table ───────────────────────────────────── */}
        {nfhsRows.length > 0 && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>NFHS Baseline — {program?.name}</h3>
                <span className="ncd-card-note">NFHS-4 (2015-16) vs NFHS-5 (2019-21) · Arunachal Pradesh</span>
              </div>
              <div className="kdi-nfhs-table">
                {nfhsRows.map((d, i) => {
                  const diff = d.nfhs4 != null && d.nfhs5 != null
                    ? (d.nfhs5 - d.nfhs4).toFixed(1) : null;
                  const improved = diff != null
                    ? (d.lowerIsBetter ? d.nfhs5 < d.nfhs4 : d.nfhs5 > d.nfhs4) : null;
                  const diffColor = improved == null ? '#94A3B8' : improved ? '#059669' : '#DC2626';
                  return (
                    <div key={i} className="kdi-nfhs-row">
                      <div className="kdi-nfhs-label">{d.label}</div>
                      <div className="kdi-nfhs-vals">
                        <span className="nfhs-val nfhs4">
                          {d.nfhs4 != null ? `${d.nfhs4}${d.unit}` : '—'}
                        </span>
                        <span className="nfhs-arrow">→</span>
                        <span className="nfhs-val nfhs5">
                          {d.nfhs5 != null ? `${d.nfhs5}${d.unit}` : '—'}
                        </span>
                        {diff != null && (
                          <span className="nfhs-diff" style={{ color: diffColor }}>
                            {improved ? '↑' : '↓'} {parseFloat(diff) > 0 ? '+' : ''}{diff}{d.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="nfhs-source-note">
                Source: NFHS-4 (2015-16) &amp; NFHS-5 (2019-21) State Fact Sheet — Arunachal Pradesh, IIPS Mumbai.
              </div>
            </div>
          </div>
        )}

      </div>

      <footer className="detail-footer">
        Sources: NHM Key Deliverables FY 2025-26 — NPCC Meeting, Arunachal Pradesh, April 2026.
        HMIS Monthly Data (Apr 2024–Dec 2025). NFHS-5 (2019-21) State Fact Sheet — Arunachal Pradesh.
        Ministry of Health &amp; Family Welfare, Govt. of India.
      </footer>
    </div>
  );
}
