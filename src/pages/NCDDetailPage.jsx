import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { arc as d3Arc } from 'd3-shape';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, Line,
} from 'recharts';
import { ResponsiveHeatMap }   from '@nivo/heatmap';
import { ICR_MONTHLY, ICR_CUMULATIVE, PREGNANCY_NCD } from '../data/ncdData';
import '../styles/ncd.css';

/* ── Google Sheets config ─────────────────────────────────────────── */
const SHEET_ID    = '1vsCSdPZpBK5SQw9gppRLEEKDLhj19DHk';
const API_KEY     = import.meta.env.VITE_SHEETS_API_KEY ?? '';
const SHEET_NAME  = 'Sheet1';
const DATA_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1vsCSdPZpBK5SQw9gppRLEEKDLhj19DHk/edit?usp=sharing&ouid=108879603367948604821&rtpof=true&sd=true';
const TARGET_POP  = 55235; // total 30+ target population — update if sheet provides this

const DISTRICTS = [
  'Changlang','Dibang Valley','East Kameng','Anjaw','East Siang',
  'Kamle','Kra Daadi','Kurung Kumey','Leparada','Lohit','Longding',
  'Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai',
  'Pakke Kessang','Papum Pare','Shi Yomi','Siang','Tawang',
  'Tirap','Upper Siang','Upper Subansiri','West Kameng','West Siang',
];

/* ── Month normaliser ────────────────────────────────────────────── */
const MONTH_MAP = {
  '1':'Jan','01':'Jan',january:'Jan',jan:'Jan',
  '2':'Feb','02':'Feb',february:'Feb',feb:'Feb',
  '3':'Mar','03':'Mar',march:'Mar',mar:'Mar',
  '4':'Apr','04':'Apr',april:'Apr',apr:'Apr',
  '5':'May','05':'May',may:'May',
  '6':'Jun','06':'Jun',june:'Jun',jun:'Jun',
  '7':'Jul','07':'Jul',july:'Jul',jul:'Jul',
  '8':'Aug','08':'Aug',august:'Aug',aug:'Aug',
  '9':'Sep','09':'Sep',september:'Sep',sept:'Sep',sep:'Sep',
  '10':'Oct',october:'Oct',oct:'Oct',
  '11':'Nov',november:'Nov',nov:'Nov',
  '12':'Dec',december:'Dec',dec:'Dec',
};
const MONTH_ORDER = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

function toMonthShort(val) {
  const k = String(val ?? '').toLowerCase().trim();
  return MONTH_MAP[k] ?? k.slice(0, 3).replace(/^\w/, c => c.toUpperCase());
}

/* ── Keyword matcher on Data Item Name ───────────────────────────── */
function matchMetric(name) {
  const n = String(name ?? '').toLowerCase();
  if (n.includes('enrol') || n.includes('register'))                            return 'enrolled';
  if (n.includes('cbac'))                                                       return 'cbac';
  if (n.includes('fully') && n.includes('screen'))                              return 'fullyScreened';
  if (n.includes('partial') && n.includes('screen'))                            return 'partialScreened';
  if (n.includes('cervical'))                                                   return 'referredCervical';
  if ((n.includes('secondary') || n.includes('2nd')) && n.includes('refer'))   return 'referredSecondary';
  if (n.includes('refer'))                                                      return 'referredScreen';
  if (n.includes('screen') || n.includes('1st'))                               return 'screened1st';
  if (n.includes('exam'))                                                       return 'examined';
  if (n.includes('diagn'))                                                      return 'diagnosed';
  if (n.includes('treat'))                                                      return 'underTreatment';
  if (n.includes('follow'))                                                     return 'followUp';
  return null;
}

/* ── Fetch and parse new sheet structure ─────────────────────────── */
async function fetchNcdData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
  }
  const { values = [] } = await res.json();
  if (values.length < 2) throw new Error('Empty sheet');

  const headers = values[0].map(h => String(h ?? '').trim());

  // Locate metadata columns
  const col = {
    year:  headers.findIndex(h => /^year$/i.test(h)),
    month: headers.findIndex(h => /^month$/i.test(h)),
    name:  headers.findIndex(h => /data item name/i.test(h) || /item name/i.test(h)),
  };

  // Locate district columns
  const distCols = {};
  DISTRICTS.forEach(d => {
    const idx = headers.findIndex(h => h.toLowerCase() === d.toLowerCase());
    if (idx >= 0) distCols[d] = idx;
  });

  // Sum a data row across all districts
  const sumDistricts = row =>
    DISTRICTS.reduce((acc, d) => acc + (parseFloat(row[distCols[d]] ?? 0) || 0), 0);

  // Group rows by Year–Month key
  const byMonth = {};
  for (let i = 1; i < values.length; i++) {
    const row       = values[i];
    const metricKey = matchMetric(row[col.name]);
    if (!metricKey) continue;

    const yr  = String(row[col.year] ?? '').trim();
    const mo  = toMonthShort(row[col.month]);
    const key = `${yr}-${mo}`;

    if (!byMonth[key]) byMonth[key] = { year: yr, month: mo };
    byMonth[key][metricKey] = (byMonth[key][metricKey] ?? 0) + sumDistricts(row);
  }

  const monthly = Object.values(byMonth)
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));

  // Cumulative — sum each metric across all months
  const METRIC_KEYS = [
    'enrolled','cbac','screened1st','fullyScreened','partialScreened',
    'referredScreen','referredCervical','referredSecondary',
    'examined','diagnosed','underTreatment','followUp',
  ];
  const totals = {};
  METRIC_KEYS.forEach(k => {
    totals[k] = monthly.reduce((a, m) => a + (m[k] ?? 0), 0);
  });

  const coveragePct = parseFloat((totals.enrolled / TARGET_POP * 100).toFixed(1));
  const cumulative = {
    targetPopulation:     TARGET_POP,
    totalEnrolled:        totals.enrolled,
    totalCBAC:            totals.cbac,
    totalScreened:        totals.screened1st,
    totalFullyScreened:   totals.fullyScreened,
    totalPartialScreened: totals.partialScreened,
    totalReferred:        totals.referredScreen,
    totalExamined:        totals.examined,
    totalDiagnosed:       totals.diagnosed,
    totalUnderTreatment:  totals.underTreatment,
    referredCervical:     totals.referredCervical,
    referredSecondary:    totals.referredSecondary,
    coveragePct,
  };

  return { monthly, cumulative };
}

/* ── Colours ──────────────────────────────────────────────────────── */
const C = {
  tealDark:  '#0A7B6C',
  tealMid:   '#0E9E8A',
  tealLight: '#2DC4AD',
  tealPale:  '#7EDDD0',
  navy:      '#1A1F36',
  yellow:    '#F5C518',
  red:       '#C0392B',
  redLight:  '#E74C3C',
  orange:    '#E8821A',
  green:     '#0E9E8A',
  ink:       '#3D4966',
  inkFaint:  '#8892A4',
};

/* ── Nivo radial-bar cascade dial ────────────────────────────────── */
const RING_DEFS = [
  { key: 'enrolled',  label: 'Enrolled',        color: '#0A7B6C', denomKey: 'targetPopulation', denomLabel: 'of target pop',  monthlyKey: 'enrolled'       },
  { key: 'cbac',      label: 'CBAC Completed',   color: '#0E9E8A', denomKey: 'totalEnrolled',    denomLabel: 'of enrolled',    monthlyKey: 'cbac'           },
  { key: 'screened',  label: 'Screened',         color: '#2DC4AD', denomKey: 'totalEnrolled',    denomLabel: 'of enrolled',    monthlyKey: 'screened1st'    },
  { key: 'referred',  label: 'Referred',         color: '#D4A017', denomKey: 'totalScreened',    denomLabel: 'of screened',    monthlyKey: 'referredScreen' },
  { key: 'examined',  label: 'Examined',         color: '#E89020', denomKey: 'totalReferred',    denomLabel: 'of referred',    monthlyKey: 'examined'       },
  { key: 'diagnosed', label: 'Diagnosed',        color: '#E8821A', denomKey: 'totalExamined',    denomLabel: 'of examined',    monthlyKey: 'diagnosed'      },
  { key: 'treatment', label: 'Under Treatment',  color: '#27AE60', denomKey: 'totalDiagnosed',   denomLabel: 'of diagnosed',   monthlyKey: 'underTreatment' },
];

const RING_COUNT_KEYS = {
  enrolled:  'totalEnrolled',
  cbac:      'totalCBAC',
  screened:  'totalScreened',
  referred:  'totalReferred',
  examined:  'totalExamined',
  diagnosed: 'totalDiagnosed',
  treatment: 'totalUnderTreatment',
};

function buildRings(c) {
  return RING_DEFS.map(def => {
    const count = c[RING_COUNT_KEYS[def.key]] ?? 0;
    const denom = c[def.denomKey] ?? 1;
    const pct   = parseFloat((count / denom * 100).toFixed(1));
    return { ...def, count, pct };
  });
}

function getRingInsight(ring, rings, cumulative) {
  const idx   = rings.findIndex(r => r.key === ring.key);
  const prev  = idx > 0 ? rings[idx - 1] : null;
  const conv  = prev ? Math.round(ring.count / Math.max(prev.count, 1) * 100) : null;

  const map = {
    enrolled: () => ({
      headline: `${(100 - cumulative.coveragePct).toFixed(1)}% of target remains unenrolled`,
      detail: `${(cumulative.targetPopulation - ring.count).toLocaleString()} people aged 30+ are yet to be reached. Community outreach to uncovered blocks is the highest-leverage intervention.`,
      type: cumulative.coveragePct < 30 ? 'critical' : 'caution',
    }),
    cbac: () => ({
      headline: `${ring.pct}% of enrolled completed CBAC`,
      detail: `CBAC completion drives clinical referrals. Enrolled individuals without CBAC screening remain at unknown risk — health worker follow-up is needed.`,
      type: ring.pct < 60 ? 'caution' : 'positive',
    }),
    screened: () => ({
      headline: `${ring.pct}% of enrolled have been screened`,
      detail: `Enrolled individuals not yet screened represent the immediate priority list. First-contact screening drives all downstream clinical outcomes.`,
      type: ring.pct < 50 ? 'caution' : 'positive',
    }),
    referred: () => ({
      headline: `${ring.pct}% of screened were referred onward`,
      detail: `Referral rate reflects positive screening findings requiring secondary assessment. This rate depends on population disease burden and screening sensitivity thresholds.`,
      type: 'neutral',
    }),
    examined: () => ({
      headline: `${conv ?? ring.pct}% of referred attended clinical examination`,
      detail: `Drop-off between referral and examination is a key bottleneck. Transport barriers, appointment scheduling, and patient awareness are common causal factors.`,
      type: (conv ?? ring.pct) < 70 ? 'caution' : 'positive',
    }),
    diagnosed: () => ({
      headline: `${ring.pct}% of examined received a confirmed diagnosis`,
      detail: `Diagnosed cases represent confirmed NCD burden. This figure directly informs treatment resource planning and supply chain requirements.`,
      type: 'neutral',
    }),
    treatment: () => ({
      headline: `${conv ?? ring.pct}% of diagnosed are under treatment`,
      detail: `Treatment linkage is the strongest indicator in this cascade. This rate should be sustained and used as a model as enrollment scales up.`,
      type: (conv ?? ring.pct) > 80 ? 'positive' : 'caution',
    }),
  };

  return (map[ring.key] ?? (() => ({ headline: ring.label, detail: '', type: 'neutral' })))();
}

/* ── Default right panel (no ring selected) ─────────────────────── */
function DefaultPanel({ cumulative }) {
  const txLinkage = Math.round(
    cumulative.totalUnderTreatment / Math.max(cumulative.totalDiagnosed, 1) * 100,
  );
  const notEnrolled = (100 - cumulative.coveragePct).toFixed(1);
  return (
    <div className="ncd-default-panel">
      <div className="ncd-dp-eyebrow">NP-NCD Screening Coverage</div>
      <div className="ncd-dp-subtitle">Itanagar District · Apr 2025–Feb 2026</div>
      <p className="ncd-dp-summary">
        Only <strong>{cumulative.coveragePct}%</strong> of{' '}
        {cumulative.targetPopulation.toLocaleString()} target population (30+ years) enrolled.
        Treatment linkage is strong at <strong>{txLinkage}%</strong> of diagnosed — the critical
        gap is population reach: <strong>{notEnrolled}%</strong> still unreached.
      </p>
      <div className="ncd-dp-stats">
        {[
          { val: cumulative.totalDiagnosed.toLocaleString(),      lbl: 'Diagnosed',       color: '#C0392B' },
          { val: cumulative.totalUnderTreatment.toLocaleString(), lbl: 'Under Treatment', color: '#0E9E8A' },
          { val: cumulative.totalReferred.toLocaleString(),       lbl: 'Referred',        color: '#0A7B6C' },
          { val: cumulative.totalCBAC.toLocaleString(),           lbl: 'CBAC Done',       color: '#1A1F36' },
        ].map(({ val, lbl, color }) => (
          <div className="ncd-dp-stat" key={lbl}>
            <span className="ncd-dp-stat-val" style={{ color }}>{val}</span>
            <span className="ncd-dp-stat-lbl">{lbl}</span>
          </div>
        ))}
      </div>
      <div className="ncd-dp-prompt">
        <span>Click any ring to explore that stage</span>
        <span className="ncd-dp-arrow">→</span>
      </div>
    </div>
  );
}

/* ── Active ring right panel ─────────────────────────────────────── */
function ActiveRingPanel({ ring, rings, sparkData, trendDelta, cumulative }) {
  const insight  = getRingInsight(ring, rings, cumulative);
  const ringIdx  = rings.findIndex(r => r.key === ring.key) + 1;
  const peakVal  = sparkData.length ? Math.max(...sparkData.map(d => d.value)) : 0;
  const totalVal = sparkData.reduce((a, d) => a + d.value, 0);

  return (
    <div className="ncd-active-panel" key={ring.key}>
      {/* Header */}
      <div className="ncd-ap-header">
        <span className="ncd-ap-step" style={{ background: ring.color + '22', color: ring.color }}>
          STEP {ringIdx} / {rings.length}
        </span>
        <div className="ncd-ap-title-row">
          <h3 className="ncd-ap-title">{ring.label}</h3>
          <span className="ncd-ap-pct" style={{ color: ring.color }}>{ring.pct}%</span>
        </div>
        <div className="ncd-ap-meta">{ring.count.toLocaleString()} · {ring.denomLabel}</div>
      </div>

      {/* Stats row */}
      {sparkData.length > 0 && (
        <>
          <div className="ncd-ap-stats">
            {[
              { val: peakVal.toLocaleString(),   lbl: 'Peak' },
              { val: trendDelta?.avg.toLocaleString() ?? '—', lbl: 'Avg/mo' },
              { val: totalVal.toLocaleString(),  lbl: 'Total' },
              ...(trendDelta?.delta != null ? [{
                val: `${trendDelta.delta >= 0 ? '↑' : '↓'} ${Math.abs(trendDelta.delta)}%`,
                lbl: 'vs avg',
                color: trendDelta.delta >= 0 ? '#16a34a' : '#dc2626',
              }] : []),
            ].map(({ val, lbl, color }) => (
              <div className="ncd-ap-stat" key={lbl}>
                <span className="ncd-ap-stat-val" style={color ? { color } : {}}>{val}</span>
                <span className="ncd-ap-stat-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* Monthly area chart */}
          <div className="ncd-ap-chart">
            <div className="ncd-ap-chart-label">Monthly Trend</div>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={sparkData} margin={{ top: 4, right: 6, bottom: 0, left: -24 }}>
                <defs>
                  <linearGradient id={`apGrad${ring.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ring.color} stopOpacity={0.40} />
                    <stop offset="95%" stopColor={ring.color} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0F4F0" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#8892A4' }} />
                <YAxis tick={{ fontSize: 9, fill: '#8892A4' }} />
                <Tooltip content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div style={{ background: '#fff', border: `1px solid ${ring.color}55`, borderRadius: 6, padding: '3px 8px', fontSize: 11 }}>
                      <b>{label}</b>: {payload[0].value.toLocaleString()}
                    </div>
                  ) : null
                } />
                <Area
                  type="monotone" dataKey="value"
                  stroke={ring.color} fill={`url(#apGrad${ring.key})`}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: ring.color, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Insight chip */}
      <div className={`ncd-ap-insight ncd-ap-insight-${insight.type}`}>
        <div className="ncd-ap-insight-title">{insight.headline}</div>
        <div className="ncd-ap-insight-body">{insight.detail}</div>
      </div>
    </div>
  );
}

/* ── Ring geometry (module-level constants, computed once) ───────── */
const SVG_SZ    = 360;
const DIAL_CX   = 180;
const DIAL_CY   = 180;
const DIAL_BAND = 12;   /* ring thickness */
const DIAL_GAP  = 4;    /* gap between rings */
const DIAL_BASE = 62;   /* innermost ring inner radius — gives 124px clear center */

const RING_RADII = RING_DEFS.map((_, i) => ({
  inner: DIAL_BASE + i * (DIAL_BAND + DIAL_GAP),
  outer: DIAL_BASE + i * (DIAL_BAND + DIAL_GAP) + DIAL_BAND,
}));

/* Full-circle donut paths for background tracks (static, precomputed) */
const TRACK_PATHS = RING_RADII.map(({ inner, outer }) =>
  d3Arc()
    .innerRadius(inner)
    .outerRadius(outer)
    .startAngle(-Math.PI / 2)
    .endAngle(3 * Math.PI / 2)(),
);

/* ── Cascade Dial — D3 arc paths + GSAP draw animation ──────────── */
function CascadeDial({ cumulative, monthly }) {
  const [activeKey, setActiveKey] = useState(null);
  const [hoverKey,  setHoverKey]  = useState(null);

  const rings    = useMemo(() => buildRings(cumulative), [cumulative]);
  const ringKeys = useMemo(() => rings.map(r => r.key), [rings]);

  const activeRing = activeKey ? rings.find(r => r.key === activeKey) : null;
  const hoverRing  = hoverKey  ? rings.find(r => r.key === hoverKey)  : null;
  const focusRing  = activeRing ?? hoverRing;
  const focusKey   = activeKey ?? hoverKey;

  /* ── Sparkline + trend ─────────────────────────────────────────── */
  const sparkData = useMemo(() => {
    if (!activeRing || !monthly?.length) return [];
    return monthly.map(m => ({ month: m.month, value: m[activeRing.monthlyKey] ?? 0 }));
  }, [activeRing, monthly]);

  const trendDelta = useMemo(() => {
    if (sparkData.length < 2) return null;
    const avg  = sparkData.reduce((a, d) => a + d.value, 0) / sparkData.length;
    const last = sparkData[sparkData.length - 1].value;
    return {
      delta: avg > 0 ? parseFloat(((last - avg) / avg * 100).toFixed(1)) : null,
      avg: Math.round(avg),
    };
  }, [sparkData]);

  /* ── D3 arc draw animation (runs before first paint via useLayoutEffect) */
  useLayoutEffect(() => {
    const tweens = rings.map((ring, i) => {
      const { inner, outer } = RING_RADII[i];
      const arcGen = d3Arc()
        .innerRadius(inner)
        .outerRadius(outer)
        .cornerRadius(5)
        .startAngle(-Math.PI / 2);
      const state = { pct: 0 };
      return gsap.to(state, {
        pct: ring.pct,
        duration: 1.5,
        delay: i * 0.1,
        ease: 'power3.out',
        onUpdate() {
          const el = document.getElementById(`arc-fill-${ring.key}`);
          if (!el) return;
          const p = Math.max(0.01, Math.min(state.pct, 100));
          el.setAttribute(
            'd',
            arcGen.endAngle(-Math.PI / 2 + (p / 100) * 2 * Math.PI)() ?? '',
          );
        },
      });
    });
    return () => tweens.forEach(t => t.kill());
  }, [rings]);

  /* ── Keyboard nav ──────────────────────────────────────────────── */
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') { setActiveKey(null); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveKey(prev => {
          if (!prev) return ringKeys[0];
          return ringKeys[(ringKeys.indexOf(prev) + 1) % ringKeys.length];
        });
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveKey(prev => {
          if (!prev) return ringKeys[ringKeys.length - 1];
          return ringKeys[(ringKeys.indexOf(prev) - 1 + ringKeys.length) % ringKeys.length];
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [ringKeys]);

  return (
    <div className="ncd-cascade-wrap">

      {/* ── Dial column ────────────────────────────────────────────── */}
      <div className="ncd-dial-col">

        {/* SVG dial — D3 arc rings */}
        <svg
          width={SVG_SZ}
          height={SVG_SZ}
          viewBox={`0 0 ${SVG_SZ} ${SVG_SZ}`}
          className="ncd-dial-svg"
          style={{ overflow: 'visible' }}
          aria-label="NCD cascade funnel dial"
        >
          <defs>
            {/* Glow filter applied to active / hovered ring */}
            <filter id="arcGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Rings — translated to center */}
          <g transform={`translate(${DIAL_CX},${DIAL_CY})`}>
            {rings.map((ring, i) => {
              const isActive = activeKey === ring.key;
              const isHov    = !activeKey && hoverKey === ring.key;
              const isDimmed = !!focusKey && ring.key !== focusKey;
              const isFocus  = isActive || isHov;
              return (
                <g
                  key={ring.key}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveKey(prev => prev === ring.key ? null : ring.key)}
                  onMouseEnter={() => setHoverKey(ring.key)}
                  onMouseLeave={() => setHoverKey(null)}
                  role="button"
                  aria-label={`${ring.label}: ${ring.pct}%`}
                >
                  {/* Static background track */}
                  <path
                    d={TRACK_PATHS[i]}
                    fill="#EEF2F5"
                    opacity={isDimmed ? 0.18 : 0.72}
                    style={{ transition: 'opacity 0.22s ease' }}
                  />
                  {/* Animated fill arc — d attribute set by GSAP */}
                  <path
                    id={`arc-fill-${ring.key}`}
                    fill={ring.color}
                    opacity={isDimmed ? 0.10 : isFocus ? 1 : 0.82}
                    filter={isFocus ? 'url(#arcGlow)' : undefined}
                    style={{ transition: 'opacity 0.22s ease' }}
                  />
                </g>
              );
            })}
          </g>

          {/* Center text — SVG coordinates, inside clear area */}
          {focusRing ? (
            <g>
              <text x={DIAL_CX} y={DIAL_CY - 30} textAnchor="middle"
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, fontWeight: 700, fill: '#C8D0DC', letterSpacing: '0.10em' }}>
                STEP {rings.findIndex(r => r.key === focusRing.key) + 1} OF {rings.length}
              </text>
              <text x={DIAL_CX} y={DIAL_CY - 4} textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 700, fill: focusRing.color }}>
                {focusRing.pct}%
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 16} textAnchor="middle"
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, fill: '#3D4966' }}>
                {focusRing.label}
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 32} textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, fill: '#8892A4' }}>
                {focusRing.count.toLocaleString()}
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 48} textAnchor="middle"
                onClick={() => setActiveKey(null)}
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fill: '#C8D0DC', cursor: 'pointer' }}>
                ✕ clear
              </text>
            </g>
          ) : (
            <g>
              <text x={DIAL_CX} y={DIAL_CY + 8} textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, fill: '#0A7B6C' }}>
                {cumulative.coveragePct}%
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 26} textAnchor="middle"
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, fill: '#8892A4' }}>
                Coverage
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 44} textAnchor="middle"
                style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, fill: '#3D4966' }}>
                {cumulative.totalEnrolled.toLocaleString()}
              </text>
              <text x={DIAL_CX} y={DIAL_CY + 58} textAnchor="middle"
                style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fill: '#C8D0DC' }}>
                enrolled
              </text>
            </g>
          )}
        </svg>

        {/* Compact ring legend */}
        <div className="ncd-dial-legend">
          {rings.map((ring, i) => {
            const isActive = activeKey === ring.key;
            const isDimmed = !!focusKey && ring.key !== focusKey;
            return (
              <button
                key={ring.key}
                className="ncd-dlg-row"
                onClick={() => setActiveKey(prev => prev === ring.key ? null : ring.key)}
                onMouseEnter={() => setHoverKey(ring.key)}
                onMouseLeave={() => setHoverKey(null)}
                style={{
                  opacity: isDimmed ? 0.35 : 1,
                  background: isActive ? ring.color + '14' : 'transparent',
                  borderColor: isActive ? ring.color + '55' : 'transparent',
                  transition: 'opacity 0.22s ease, background 0.18s ease',
                }}
              >
                <span className="ncd-dlg-dot" style={{ background: ring.color }} />
                <span className="ncd-dlg-num" style={{ color: ring.color }}>{i + 1}</span>
                <span className="ncd-dlg-name">{ring.label}</span>
                <span className="ncd-dlg-pct" style={{ color: ring.color }}>{ring.pct}%</span>
                <div className="ncd-dlg-bar">
                  <div className="ncd-dlg-fill" style={{ width: `${Math.min(ring.pct, 100)}%`, background: ring.color }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Reset button — clears active selection */}
        {activeKey && (
          <button
            className="ncd-dial-reset"
            onClick={() => { setActiveKey(null); setHoverKey(null); }}
          >
            ↺ Reset dial
          </button>
        )}
      </div>

      {/* ── Right detail panel ─────────────────────────────────────── */}
      <div className="ncd-cascade-panel">
        {activeRing ? (
          <ActiveRingPanel
            ring={activeRing}
            rings={rings}
            sparkData={sparkData}
            trendDelta={trendDelta}
            cumulative={cumulative}
          />
        ) : (
          <DefaultPanel cumulative={cumulative} />
        )}
      </div>
    </div>
  );
}

/* ── Dynamic cascade from live cumulative ────────────────────────── */
function buildCascade(c) {
  const T = c.targetPopulation;
  const pct = (n, d) => d > 0 ? `${Math.round(n / d * 100)}%` : '—';
  return [
    { label: 'Target Population', count: T,                     pctOfTarget: 100,                      pctLabel: '100%',                                     color: C.navy,      note: 'Baseline'                                      },
    { label: 'Enrolled',          count: c.totalEnrolled,       pctOfTarget: c.totalEnrolled/T*100,    pctLabel: `${c.coveragePct}%`,                         color: C.tealDark,  note: `${c.coveragePct}% of target pop`                },
    { label: 'CBAC Completed',    count: c.totalCBAC,           pctOfTarget: c.totalCBAC/T*100,        pctLabel: pct(c.totalCBAC, c.totalEnrolled),           color: C.tealMid,   note: `${pct(c.totalCBAC, c.totalEnrolled)} of enrolled`  },
    { label: 'Screened (1st)',    count: c.totalScreened,       pctOfTarget: c.totalScreened/T*100,    pctLabel: pct(c.totalScreened, c.totalEnrolled),       color: C.tealLight, note: `${pct(c.totalScreened, c.totalEnrolled)} of enrolled` },
    { label: 'Referred',         count: c.totalReferred,       pctOfTarget: c.totalReferred/T*100,    pctLabel: pct(c.totalReferred, c.totalScreened),       color: '#D4A017',   note: `${pct(c.totalReferred, c.totalScreened)} of screened` },
    { label: 'Examined',         count: c.totalExamined,       pctOfTarget: c.totalExamined/T*100,    pctLabel: pct(c.totalExamined, c.totalReferred),       color: '#E89020',   note: `${pct(c.totalExamined, c.totalReferred)} of referred` },
    { label: 'Diagnosed',        count: c.totalDiagnosed,      pctOfTarget: c.totalDiagnosed/T*100,   pctLabel: pct(c.totalDiagnosed, c.totalExamined),      color: C.orange,    note: `${pct(c.totalDiagnosed, c.totalExamined)} of examined` },
    { label: 'Under Treatment',  count: c.totalUnderTreatment, pctOfTarget: c.totalUnderTreatment/T*100, pctLabel: pct(c.totalUnderTreatment, c.totalDiagnosed), color: C.green, note: `${pct(c.totalUnderTreatment, c.totalDiagnosed)} of diagnosed` },
  ];
}

/* ── Cascade bar ────────────────────────────────────────────────── */
function CascadeBar({ step }) {
  const widthPct = Math.max(step.pctOfTarget, 1.2);
  return (
    <div className="ncd-cascade-row">
      <div className="ncd-cascade-label">{step.label}</div>
      <div className="ncd-cascade-track">
        <div className="ncd-cascade-fill" style={{ width: `${widthPct}%`, background: step.color }}>
          <span className="ncd-cascade-count">{step.count.toLocaleString()}</span>
        </div>
      </div>
      <div className="ncd-cascade-meta">
        <span className="ncd-cascade-pct">{step.pctLabel}</span>
        <span className="ncd-cascade-note">{step.note}</span>
      </div>
    </div>
  );
}

/* ── Nivo Heatmap ────────────────────────────────────────────────── */
const HEATMAP_METRICS = [
  { key: 'enrolled',       label: 'Enrolled'        },
  { key: 'cbac',           label: 'CBAC Screened'   },
  { key: 'screened1st',    label: 'Screened (1st)'  },
  { key: 'fullyScreened',  label: 'Fully Screened'  },
  { key: 'referredScreen', label: 'Referred'        },
  { key: 'examined',       label: 'Examined'        },
  { key: 'diagnosed',      label: 'Diagnosed'       },
  { key: 'underTreatment', label: 'Under Treatment' },
  { key: 'followUp',       label: 'Follow-Up'       },
];

function buildHeatmapData(monthly) {
  return HEATMAP_METRICS.map(metric => {
    const values = monthly.map(m => m[metric.key] ?? 0);
    const rowMax = Math.max(...values, 1);
    return {
      id: metric.label,
      data: monthly.map((m, i) => ({
        x:   m.month,
        y:   Math.round((values[i] / rowMax) * 100),
        raw: values[i],
      })),
    };
  });
}

function HeatmapSection({ monthly }) {
  const data = buildHeatmapData(monthly);
  return (
    <section className="ncd-section">
      <div className="ncd-card">
        <div className="ncd-card-header">
          <h3>Monthly Activity Heatmap</h3>
          <span className="ncd-card-note">
            Each row colour-normalised independently · hover cells for exact count
          </span>
        </div>
        <div className="ncd-heatmap-wrap">
          <ResponsiveHeatMap
            data={data}
            margin={{ top: 28, right: 20, bottom: 8, left: 152 }}
            xInnerPadding={0.06}
            yInnerPadding={0.12}
            enableLabels={false}
            colors={{
              type:     'sequential',
              colors:   ['#F0FAFA', '#A8E4DC', '#2DC4AD', '#0E9E8A', '#0A7B6C'],
              minValue: 0,
              maxValue: 100,
            }}
            emptyColor="#F5F7FA"
            borderRadius={5}
            borderWidth={0}
            axisTop={{
              tickSize:     0,
              tickPadding:  7,
              tickRotation: 0,
              renderTick: ({ x, y, value }) => (
                <g transform={`translate(${x},${y - 6})`}>
                  <text
                    textAnchor="middle"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, fill: '#8892A4' }}
                  >
                    {value}
                  </text>
                </g>
              ),
            }}
            axisLeft={{
              tickSize:    0,
              tickPadding: 10,
              renderTick: ({ x, y, value }) => (
                <g transform={`translate(${x - 4},${y})`}>
                  <text
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, fill: '#3D4966' }}
                  >
                    {value}
                  </text>
                </g>
              ),
            }}
            axisRight={null}
            axisBottom={null}
            animate={true}
            motionConfig="gentle"
            tooltip={({ cell }) => (
              <div className="ncd-tooltip">
                <div className="ncd-tip-label">{cell.serieId} · {cell.data?.x}</div>
                <div className="ncd-tip-row">
                  <span>Count</span>
                  <span className="ncd-tip-val">{(cell.data?.raw ?? cell.value).toLocaleString()}</span>
                </div>
                <div className="ncd-tip-row" style={{ opacity: 0.65 }}>
                  <span>Row intensity</span>
                  <span className="ncd-tip-val">{cell.value}%</span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}

/* ── Recharts custom tooltip ─────────────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ncd-tooltip">
      <div className="ncd-tip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="ncd-tip-row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <span className="ncd-tip-val">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut (Recharts PieChart) ──────────────────────────────────── */
function Donut({ data, title }) {
  return (
    <div className="ncd-donut-wrap">
      <div className="ncd-donut-title">{title}</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={82} paddingAngle={3}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(v) => [v.toLocaleString(), '']} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e0d8cc' }} />
          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Insight card ────────────────────────────────────────────────── */
function InsightCard({ headline, body, type = 'default' }) {
  return (
    <div className={`ncd-insight-card ncd-insight-${type}`}>
      <div className="ncd-insight-headline">{headline}</div>
      <div className="ncd-insight-body">{body}</div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function NCDDetailPage({ onBack }) {
  const wrapRef = useRef(null);

  const [monthly,    setMonthly]    = useState(ICR_MONTHLY);
  const [cumulative, setCumulative] = useState(ICR_CUMULATIVE);
  const [isLive,     setIsLive]     = useState(false);
  const [fetchError, setFetchError] = useState(null);

  /* ── Live data fetch ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!API_KEY) return;
    fetchNcdData()
      .then(({ monthly: m, cumulative: c }) => {
        if (m.length)        setMonthly(m);
        if (c.totalEnrolled) { setCumulative(c); setIsLive(true); }
      })
      .catch(err => setFetchError(err.message));
  }, []);

  /* ── GSAP entrance ───────────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ncd-section',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out' },
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const handleBack = () => {
    gsap.to(wrapRef.current, {
      opacity: 0, y: -14, duration: 0.28, ease: 'power2.in',
      onComplete: onBack,
    });
  };

  /* ── Derived data ────────────────────────────────────────────────── */
  const cascade = buildCascade(cumulative);

  const screenQuality = [
    { name: 'Fully Screened',     value: cumulative.totalFullyScreened,   color: C.tealDark },
    { name: 'Partially Screened', value: cumulative.totalPartialScreened, color: C.tealPale },
  ];
  const referralBreakdown = [
    { name: 'Cervical Referral',  value: cumulative.referredCervical,  color: C.orange },
    { name: 'Secondary Referral', value: cumulative.referredSecondary, color: C.red    },
    { name: 'Other Referred',     value: Math.max(0, cumulative.totalReferred - cumulative.referredCervical - cumulative.referredSecondary), color: '#D4A017' },
  ];

  const notEnrolledPct = parseFloat((100 - cumulative.coveragePct).toFixed(1));

  return (
    <div className="ncd-root" ref={wrapRef}>

      {/* ── Sticky topbar ────────────────────────────────────────────── */}
      <div className="ncd-topbar">
        <div className="ncd-topbar-inner">
          <button className="back-btn" onClick={handleBack}>
            <span className="back-chevron">←</span> Back to Overview
          </button>
          <div className="detail-breadcrumb">
            <span className="ncd-badge">NCD</span>
            <span className="detail-prog-name">Non-Communicable Diseases</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isLive && (
              <span style={{
                fontSize: 10, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                background: 'rgba(14,158,138,0.12)', color: '#0A7B6C',
                border: '1px solid rgba(14,158,138,0.30)', borderRadius: 20,
                padding: '3px 10px', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                ● Live
              </span>
            )}
            {fetchError && (
              <span style={{
                fontSize: 10, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                color: '#C0392B', opacity: 0.7,
              }} title={fetchError}>
                Offline data
              </span>
            )}
            <a
              href={DATA_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                background: 'rgba(14,158,138,0.10)', color: '#0A7B6C',
                border: '1px solid rgba(14,158,138,0.30)', borderRadius: 6,
                padding: '4px 12px', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              View Data
            </a>
            <div className="ncd-source-tag">
              ICR Registry · All Districts · Apr 2025–Feb 2026
            </div>
          </div>
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <div className="ncd-content">

        {/* ── Section A: Hero — Cascade Dial Dashboard ───────────────── */}
        <section className="ncd-section ncd-hero-section">
          <div className="ncd-card ncd-hero-card-v2">
            <CascadeDial cumulative={cumulative} monthly={monthly} />
          </div>
        </section>

        {/* ── Section B: Screening Cascade ───────────────────────────── */}
        <section className="ncd-section">
          <div className="ncd-card">
            <div className="ncd-card-header">
              <h3>Care Pathway — Screening Cascade</h3>
              <span className="ncd-card-note">Width proportional to % of target population · % shown is of previous step</span>
            </div>
            <div className="ncd-cascade">
              {cascade.map(step => <CascadeBar key={step.label} step={step} />)}
            </div>
          </div>
        </section>

        {/* ── Section C: Monthly Enrollment Trend ────────────────────── */}
        <section className="ncd-section">
          <div className="ncd-card">
            <div className="ncd-card-header">
              <h3>Monthly Enrollment, Screening &amp; Diagnosis Trend</h3>
              <span className="ncd-card-note">ICR Registry · Itanagar · Apr 2025–Feb 2026</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthly} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.tealDark}  stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.tealDark}  stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="gradScreened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.tealLight} stopOpacity={0.30} />
                    <stop offset="95%" stopColor={C.tealLight} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="gradDiagnosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.orange}    stopOpacity={0.45} />
                    <stop offset="95%" stopColor={C.orange}    stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.inkFaint }} />
                <YAxis tick={{ fontSize: 11, fill: C.inkFaint }} />
                <Tooltip content={<ChartTip />} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="enrolled"    name="Enrolled"   stroke={C.tealDark}  fill="url(#gradEnrolled)"  strokeWidth={2}   dot={false} />
                <Area type="monotone" dataKey="screened1st" name="Screened"   stroke={C.tealLight} fill="url(#gradScreened)"  strokeWidth={2}   dot={false} />
                <Area type="monotone" dataKey="diagnosed"   name="Diagnosed"  stroke={C.orange}    fill="url(#gradDiagnosed)" strokeWidth={2.5} dot={{ r: 3, fill: C.orange }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Section D: Monthly Heatmap ─────────────────────────────── */}
        <HeatmapSection monthly={monthly} />

        {/* ── Section E: Screening Quality Donuts ───────────────────── */}
        <section className="ncd-section">
          <div className="ncd-two-col">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>Screening Quality</h3>
                <span className="ncd-card-note">Fully vs Partially Screened</span>
              </div>
              <Donut data={screenQuality} title={`Of ${cumulative.totalScreened.toLocaleString()} Screened`} />
            </div>
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>Referral Breakdown</h3>
                <span className="ncd-card-note">{cumulative.totalReferred.toLocaleString()} total referred</span>
              </div>
              <Donut data={referralBreakdown} title="Referral Pathway" />
            </div>
          </div>
        </section>

        {/* ── Section F: Follow-Up Adherence ─────────────────────────── */}
        <section className="ncd-section">
          <div className="ncd-card">
            <div className="ncd-card-header">
              <h3>Follow-Up Adherence vs Monthly Diagnoses</h3>
              <span className="ncd-card-note">Follow-up counts growing as treatment base accumulates</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthly} margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.inkFaint }} />
                <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: C.inkFaint }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: C.inkFaint }} />
                <Tooltip content={<ChartTip />} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                <Bar  yAxisId="left"  dataKey="followUp"  name="Follow-Up" fill={C.tealMid}  radius={[3,3,0,0]} maxBarSize={36} />
                <Line yAxisId="right" type="monotone" dataKey="diagnosed" name="Diagnosed" stroke={C.orange} strokeWidth={2.5} dot={{ r: 4, fill: C.orange }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Section F: Pregnancy NCD Charts ────────────────────────── */}
        <section className="ncd-section">
          <div className="ncd-two-col">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>Hypertension in Pregnancy</h3>
                <span className="ncd-card-note">New cases/month · State totals · Apr 2024–Jan 2026</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={PREGNANCY_NCD} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradHtn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.red} stopOpacity={0.40} />
                      <stop offset="95%" stopColor={C.red} stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                  <XAxis dataKey="period" tick={{ fontSize: 9, fill: C.inkFaint }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: C.inkFaint }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="htnCases" name="HTN Cases" stroke={C.red} fill="url(#gradHtn)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="ncd-card">
              <div className="ncd-card-header">
                <h3>Anaemia in Pregnancy</h3>
                <span className="ncd-card-note">Moderate vs Severe · State totals · Apr 2024–Jan 2026</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={PREGNANCY_NCD} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                  <XAxis dataKey="period" tick={{ fontSize: 9, fill: C.inkFaint }} interval={2} />
                  <YAxis tick={{ fontSize: 10, fill: C.inkFaint }} />
                  <Tooltip content={<ChartTip />} />
                  <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="anaemiaMod" name="Moderate (Hb<11)"  fill={C.orange} stackId="a" radius={[0,0,0,0]} maxBarSize={24} />
                  <Bar dataKey="anaemiaSev" name="Severe (Hb≤7)"     fill={C.red}    stackId="a" radius={[3,3,0,0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ── Section G: Key Insights ─────────────────────────────────── */}
        <section className="ncd-section">
          <div className="ncd-card">
            <div className="ncd-card-header">
              <h3>Key Insights</h3>
              <span className="ncd-card-note">Derived from ICR Registry · 7_heads dataset · Apr 2025–Feb 2026</span>
            </div>
            <div className="ncd-insights-grid">
              <InsightCard
                type="critical"
                headline={`${notEnrolledPct}% of target population remains unenrolled`}
                body={`Only ${cumulative.coveragePct}% of the ${cumulative.targetPopulation.toLocaleString()} target population (30+ years) has been enrolled. Accelerated community outreach is urgently required.`}
              />
              <InsightCard
                type="positive"
                headline={`${cumulative.totalDiagnosed.toLocaleString()} patients diagnosed — ${Math.round(cumulative.totalUnderTreatment / Math.max(cumulative.totalDiagnosed, 1) * 100)}% linked to treatment`}
                body="Treatment linkage is a strong programme success and must be sustained as enrollment scales up."
              />
              <InsightCard
                type="caution"
                headline="Anaemia in pregnancy: avg 530/month moderate, 10/month severe"
                body="Moderate anaemia (Hb&lt;11) affects ~530 pregnant women per month state-wide. A seasonal spike to 666 in August 2024 suggests nutritional vulnerability. Severe cases (Hb≤7) peaked at 73 in May 2024."
              />
              <InsightCard
                type="warning"
                headline="Hypertension in pregnancy: 130 new cases in peak month (Apr 2024)"
                body="Peak HTN cases occurred in April 2024 (130 cases). The trend shows improvement with a decline to ~24 cases in Jan 2026 — but vigilance at antenatal contact points remains critical."
              />
            </div>
          </div>
        </section>

      </div>

      <footer className="detail-footer">
        Sources: ICR Registry — NP-NCD Screening, Itanagar District, April 2025–February 2026.
        State-level NCD-adjacent data from 7_heads dataset, all 25 districts.
        NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026. Ministry of Health &amp; Family Welfare, Govt. of India.
      </footer>
    </div>
  );
}
