import { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

/* ── Constants ───────────────────────────────────────────────────── */
const SHEET_ID  = '1vsCSdPZpBK5SQw9gppRLEEKDLhj19DHk';
const CSV_URL   = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

const MONTH_ORDER = ['April','May','June','July','August','September','October','November','December','January','February','March'];
const MONTH_SHORT = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

const DISTRICTS = [
  'Changlang','Dibang Valley','East Kameng','Anjaw','East Siang','Kamle',
  'Kra Daadi','Kurung Kumey','Leparada','Lohit','Longding',
  'Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai',
  'Pakke Kessang','Papum Pare','Shi Yomi','Siang','Tawang','Tirap',
  'Upper Siang','Upper Subansiri','West Kameng','West Siang',
];

/* ── Status helpers ──────────────────────────────────────────────── */
function kdStatus(kd) {
  if (kd.achievement === null || kd.achievement === undefined ||
      kd.target === null || kd.target === undefined) return 'neutral';
  const gap = kd.lowerIsBetter
    ? kd.target - kd.achievement
    : kd.achievement - kd.target;
  if (gap >= 0)   return 'achieved';
  if (gap >= -10) return 'close';
  return 'gap';
}

const STATUS_COLOR = {
  achieved: '#059669',
  close:    '#D97706',
  gap:      '#DC2626',
  neutral:  '#94A3B8',
};
const STATUS_LABEL = {
  achieved: 'Achieved',
  close:    'Near Target',
  gap:      'Gap',
  neutral:  'No Data',
};
const STATUS_BG = {
  achieved: '#ECFDF5',
  close:    '#FFFBEB',
  gap:      '#FEF2F2',
  neutral:  '#F8FAFC',
};

/* ── Number formatter ────────────────────────────────────────────── */
function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `${(n / 1000).toFixed(1)}K`;
  return Number(n).toLocaleString();
}

/* ── CSV parser ──────────────────────────────────────────────────── */
function parseCsv(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map(line => {
    const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || [];
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (vals[i] || '').replace(/^"|"$/g, '').trim();
    });
    return row;
  });
}

/* ── SVG Semicircle Gauge ────────────────────────────────────────── */
function SemiGauge({ pct, target, color, size = 160 }) {
  const cx = size / 2;
  const cy = size * 0.6;
  const r  = size * 0.42;

  const clampedPct    = Math.min(Math.max(pct ?? 0, 0), 150);
  const clampedTarget = Math.min(Math.max(target ?? 0, 0), 150);

  function arcPath(angleDeg) {
    const rad = ((angleDeg - 180) * Math.PI) / 180;
    const x   = cx + r * Math.cos(rad);
    const y   = cy + r * Math.sin(rad);
    const large = angleDeg > 180 ? 1 : 0;
    return `M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${x} ${y}`;
  }

  const fillAngle   = Math.min((clampedPct / 100) * 180, 180);
  const targetAngle = Math.min((clampedTarget / 100) * 180, 180);

  const targetRad = ((targetAngle - 180) * Math.PI) / 180;
  const tx = cx + r * Math.cos(targetRad);
  const ty = cy + r * Math.sin(targetRad);

  return (
    <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
      {/* Track */}
      <path
        d={arcPath(180)}
        fill="none"
        stroke="#E8EEF4"
        strokeWidth={size * 0.085}
        strokeLinecap="round"
      />
      {/* Fill */}
      {fillAngle > 0 && (
        <path
          d={arcPath(fillAngle)}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.085}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
      {/* Target tick */}
      <circle cx={tx} cy={ty} r={size * 0.025} fill="#334155" opacity={0.6} />
      {/* Centre label */}
      <text
        x={cx} y={cy - size * 0.02}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize={size * 0.155}
        fontWeight="700"
        fill={color}
      >
        {pct !== null && pct !== undefined ? `${Number(pct).toFixed(1)}%` : '—'}
      </text>
      <text
        x={cx} y={cy + size * 0.1}
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize={size * 0.07}
        fill="#94A3B8"
      >
        vs target {target}%
      </text>
    </svg>
  );
}

/* ── Custom tooltip ──────────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ncd-tooltip">
      <div className="ncd-tip-label">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="ncd-tip-row">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="ncd-tip-val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function KDIndicatorDetail({ indicator, program, division, onBack }) {
  const wrapRef = useRef(null);
  const [hmisRows, setHmisRows]     = useState(null);
  const [hmisError, setHmisError]   = useState(null);
  const [hmisLoading, setHmisLoading] = useState(false);

  const st = kdStatus(indicator);
  const stColor = STATUS_COLOR[st];
  const stLabel = STATUS_LABEL[st];
  const stBg    = STATUS_BG[st];

  /* HMIS fetch */
  useEffect(() => {
    if (!indicator?.hmisCode) return;
    setHmisLoading(true);
    setHmisError(null);
    fetch(CSV_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(text => {
        const rows = parseCsv(text);
        const filtered = rows.filter(r =>
          r.code === indicator.hmisCode &&
          (!indicator.hmisCat || r.cat === indicator.hmisCat),
        );
        setHmisRows(filtered);
      })
      .catch(err => setHmisError(err.message))
      .finally(() => setHmisLoading(false));
  }, [indicator?.hmisCode, indicator?.hmisCat]);

  /* Build monthly state-level trend */
  const trendData = useMemo(() => {
    if (!hmisRows?.length) return [];
    const byMonthYear = {};
    hmisRows.forEach(r => {
      const key = `${r.year ?? ''}__${r.month}`;
      if (!byMonthYear[key]) byMonthYear[key] = { month: r.month, year: r.year, total: 0 };
      byMonthYear[key].total += Number(r.value ?? 0);
    });
    return MONTH_ORDER.map((m, i) => {
      const candidates = Object.values(byMonthYear).filter(d => d.month === m);
      if (!candidates.length) return null;
      const latest = candidates[candidates.length - 1];
      return { name: MONTH_SHORT[i], value: latest.total };
    }).filter(Boolean);
  }, [hmisRows]);

  /* Build district breakdown */
  const districtData = useMemo(() => {
    if (!hmisRows?.length) return [];
    const byDist = {};
    hmisRows.forEach(r => {
      const dist = r.district;
      if (!DISTRICTS.includes(dist)) return;
      byDist[dist] = (byDist[dist] ?? 0) + Number(r.value ?? 0);
    });
    return Object.entries(byDist)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [hmisRows]);

  /* Progress bar values */
  const progressPct    = indicator?.achievement !== null && indicator?.achievement !== undefined
    ? Math.min(indicator.achievement, 150) : 0;
  const targetLinePct  = indicator?.target !== null && indicator?.target !== undefined
    ? Math.min(indicator.target, 150) : 0;

  /* GSAP entry */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wrapRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' },
      );
      gsap.from('.kdi-section', {
        y: 22, opacity: 0, duration: 0.42,
        stagger: 0.07, ease: 'power3.out', delay: 0.12,
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [indicator?.no]);

  const handleBack = () => {
    gsap.to(wrapRef.current, {
      opacity: 0, y: -12, duration: 0.25, ease: 'power2.in',
      onComplete: onBack,
    });
  };

  const isPercent = indicator?.unit === '%';

  /* NFHS rows with both values */
  const nfhsRows = (program?.nfhsData || []).filter(
    d => d.nfhs4 !== null || d.nfhs5 !== null,
  );

  return (
    <div className="ncd-root" ref={wrapRef}>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <div className="ncd-topbar">
        <div className="ncd-topbar-inner">
          <button className="back-btn" onClick={handleBack}>
            <span className="back-chevron">←</span> Back
          </button>
          <div className="detail-breadcrumb">
            <span className="detail-div-tag">{division?.label}</span>
            <span className="detail-prog-name" style={{ fontSize: 15 }}>{program?.name}</span>
            <span style={{ color: '#CBD5E1', fontSize: 14 }}>›</span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: '#475569',
              maxWidth: 320,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {indicator?.indicator}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="ncd-content">

        {/* ── Hero card ─────────────────────────────────────────── */}
        <div className="kdi-section">
          <div className="kdi-hero" style={{ borderLeftColor: stColor }}>
            {/* Top row */}
            <div className="kdi-hero-top">
              <div className="kdi-no-badge" style={{ background: `${stColor}18`, color: stColor }}>
                KD {indicator?.no}
              </div>
              <div className="kdi-type-pill">{indicator?.type}</div>
              <div className="kdi-source-tag">Source: {indicator?.source}</div>
            </div>

            {/* Name + statement */}
            <div className="kdi-name">{indicator?.indicator}</div>
            {indicator?.statement && (
              <div className="kdi-statement">{indicator.statement}</div>
            )}

            {/* Target vs Achievement */}
            <div className="kdi-numbers">
              <div className="kdi-number-block">
                <div className="kdi-num-label">Target</div>
                <div className="kdi-target-num">
                  {indicator?.targetLabel ?? (indicator?.target !== null ? `${indicator.target}${indicator?.unit ?? ''}` : '—')}
                </div>
              </div>
              <div className="kdi-number-block">
                <div className="kdi-num-label">Achievement (FY 2025-26)</div>
                <div className="kdi-ach-num" style={{ color: stColor }}>
                  {indicator?.achievedLabel ?? (indicator?.achievement !== null ? `${indicator.achievement}${indicator?.unit ?? ''}` : '—')}
                </div>
              </div>
              <div className="kdi-number-block">
                <div className="kdi-num-label">Status</div>
                <div className="kdi-status-chip" style={{ background: stBg, color: stColor }}>
                  {stLabel}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {indicator?.target !== null && indicator?.achievement !== null && (
              <div className="kdi-progress-wrap">
                <div
                  className="kdi-progress-fill"
                  style={{ width: `${Math.min((progressPct / 150) * 100, 100)}%`, background: stColor }}
                />
                <div
                  className="kdi-progress-target"
                  style={{ left: `${Math.min((targetLinePct / 150) * 100, 100)}%` }}
                />
              </div>
            )}

            {/* Numerator / Denominator */}
            {(indicator?.numerator !== null && indicator?.numerator !== undefined) && (
              <div className="kdi-count-row">
                <span className="kdi-count-label">Numerator</span>
                <span className="kdi-count-val">{fmt(indicator.numerator)}</span>
                {indicator?.denominator !== null && indicator?.denominator !== undefined && (
                  <>
                    <span className="kdi-count-sep">/</span>
                    <span className="kdi-count-label">Denominator</span>
                    <span className="kdi-count-val">{fmt(indicator.denominator)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Gauge ─────────────────────────────────────────────── */}
        {isPercent && indicator?.achievement !== null && indicator?.achievement !== undefined && (
          <div className="kdi-section">
            <div className="ncd-card" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div>
                <div className="kd-section-eyebrow" style={{ marginBottom: 12 }}>
                  FY 2025-26 Achievement Gauge
                </div>
                <SemiGauge
                  pct={indicator.achievement}
                  target={indicator.target}
                  color={stColor}
                  size={180}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div className="kdi-gauge-note">
                  <span style={{ color: stColor, fontWeight: 700 }}>
                    {indicator?.achievement?.toFixed(1)}%
                  </span>
                  {' '}achieved against a target of{' '}
                  <span style={{ fontWeight: 700 }}>{indicator?.target}%</span>.
                  {' '}
                  {st === 'achieved' && 'This indicator has met or exceeded its FY 2025-26 target.'}
                  {st === 'close'    && 'This indicator is within 10 percentage points of its target.'}
                  {st === 'gap'      && 'This indicator has a significant gap from its FY 2025-26 target.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HMIS Monthly Trend ─────────────────────────────────── */}
        {indicator?.hmisCode && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h2>HMIS Data — {indicator.indicator}</h2>
                <span className="ncd-card-note">HMIS Code: {indicator.hmisCode}</span>
              </div>

              {hmisLoading && (
                <div className="hmis-loading">
                  <div className="hmis-spinner" />
                  Loading HMIS data…
                </div>
              )}

              {hmisError && (
                <div className="hmis-error-card">
                  <div className="hmis-error-title">Unable to load HMIS data</div>
                  <div className="hmis-error-msg">{hmisError}</div>
                  <div className="hmis-error-hint">Check your network connection or try again later.</div>
                </div>
              )}

              {!hmisLoading && !hmisError && trendData.length > 0 && (
                <>
                  <div className="kd-section-eyebrow" style={{ marginBottom: 10 }}>State Total — Monthly Trend</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={trendData} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
                      <defs>
                        <linearGradient id="kdiGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={stColor} stopOpacity={0.18} />
                          <stop offset="95%" stopColor={stColor} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} width={56} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name={indicator.indicator}
                        stroke={stColor}
                        strokeWidth={2}
                        fill="url(#kdiGrad)"
                        dot={{ r: 3, fill: stColor }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              )}

              {!hmisLoading && !hmisError && trendData.length === 0 && hmisRows !== null && (
                <div className="kd-empty-state">
                  No monthly trend data available for HMIS code {indicator.hmisCode}.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── District breakdown ─────────────────────────────────── */}
        {indicator?.hmisCode && !hmisLoading && !hmisError && districtData.length > 0 && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h2>District Performance</h2>
                <span className="ncd-card-note">Top 10 districts · FY 2025-26</span>
              </div>
              <ResponsiveContainer width="100%" height={Math.max(260, districtData.length * 28 + 40)}>
                <BarChart
                  data={districtData}
                  layout="vertical"
                  margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 11, fill: '#475569' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    name={indicator.indicator}
                    fill={stColor}
                    fillOpacity={0.8}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── NFHS Baseline ─────────────────────────────────────── */}
        {nfhsRows.length > 0 && (
          <div className="kdi-section">
            <div className="ncd-card">
              <div className="ncd-card-header">
                <h2>NFHS Baseline Comparison</h2>
                <span className="ncd-card-note">NFHS-4 (2015-16) vs NFHS-5 (2019-21)</span>
              </div>
              <div className="kdi-nfhs-table">
                {nfhsRows.map((d, i) => {
                  let diff = null;
                  let improved = null;
                  if (d.nfhs4 !== null && d.nfhs5 !== null) {
                    diff = (d.nfhs5 - d.nfhs4).toFixed(1);
                    improved = d.lowerIsBetter ? d.nfhs5 < d.nfhs4 : d.nfhs5 > d.nfhs4;
                  }
                  const diffColor = improved === null ? '#94A3B8' : improved ? '#059669' : '#DC2626';
                  const sign = diff !== null && diff > 0 ? '+' : '';
                  return (
                    <div key={i} className="kdi-nfhs-row">
                      <div className="kdi-nfhs-label">{d.label}</div>
                      <div className="kdi-nfhs-vals">
                        <span className="nfhs-val nfhs4">
                          {d.nfhs4 !== null ? `${d.nfhs4}${d.unit}` : '—'}
                        </span>
                        <span className="nfhs-arrow">→</span>
                        <span className="nfhs-val nfhs5">
                          {d.nfhs5 !== null ? `${d.nfhs5}${d.unit}` : '—'}
                        </span>
                        {diff !== null && (
                          <span className="nfhs-diff" style={{ color: diffColor }}>
                            {improved ? '↑' : '↓'} {sign}{diff}{d.unit}
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

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="detail-footer">
        Sources: HMIS FY 2025-26 (April–December 2025). NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026.
        NFHS-5 (2019-21) State Fact Sheet — Arunachal Pradesh, IIPS Mumbai. Ministry of Health &amp; Family Welfare, Govt. of India.
      </footer>
    </div>
  );
}
