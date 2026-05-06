import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { STATUS_CONFIG } from '../data/programs';

const NFHS4_COLOR = '#4A7FA5';
const NFHS5_COLOR = '#B8793A';

export default function DetailPage({ program, division, onBack }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wrapRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      );
      gsap.from('.dm-card', { y: 28, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 });
      gsap.from('.obs-item, .action-item', { x: -14, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.4 });
    }, wrapRef);
    return () => ctx.revert();
  }, [program.id]);

  const handleBack = () => {
    gsap.to(wrapRef.current, {
      opacity: 0, y: -14, duration: 0.28, ease: 'power2.in',
      onComplete: onBack,
    });
  };

  const cfg = STATUS_CONFIG[program.status];

  // Build chart data — only % indicators with both values
  const chartData = (program.nfhsData || [])
    .filter(d => d.unit === '%' && d.nfhs4 !== null && d.nfhs5 !== null)
    .map(d => ({
      name: d.label.length > 44 ? d.label.slice(0, 42) + '…' : d.label,
      fullLabel: d.label,
      'NFHS-4': d.nfhs4,
      'NFHS-5': d.nfhs5,
    }));

  const barH = 54;
  const chartHeight = chartData.length * barH + 50;

  return (
    <div className="detail-root" ref={wrapRef}>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className="detail-topbar">
        <div className="detail-topbar-inner">
          <button className="back-btn" onClick={handleBack}>
            <span className="back-chevron">←</span> Back to Overview
          </button>
          <div className="detail-breadcrumb">
            <span className="detail-div-tag">{division.label}</span>
            <span className="detail-prog-name">{program.name}</span>
          </div>
          <div className={`status-pill st-${program.status}`}>
            {cfg.shortLabel}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="detail-content">

        {/* Summary */}
        <div className="detail-summary-bar">
          <p className="detail-summary-text">{program.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className="detail-metrics-grid">
          {program.keyMetrics.map(m => (
            <div className="dm-card" key={m.label}>
              <div className="dm-value">{m.value}</div>
              <div className="dm-label">{m.label}</div>
              {m.change && (
                <div className={`dm-change ${m.changeDir === 'up' ? 'dm-pos' : 'dm-neg'}`}>
                  {m.changeDir === 'up' ? '▲' : '▼'} {m.change} vs previous
                </div>
              )}
              <div className="dm-source">{m.source}</div>
            </div>
          ))}
        </div>

        {/* NFHS Chart */}
        {chartData.length > 0 && (
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>NFHS-4 (2015-16) vs NFHS-5 (2019-21) — Key Indicators</h3>
              <span className="detail-card-note">Percentage points</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 8, right: 44, left: 12, bottom: 8 }}
                  barCategoryGap="28%"
                  barGap={3}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ede9e1" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#7a7060' }} unit="%" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={274}
                    tick={{ fontSize: 11, fill: '#3a3020' }}
                  />
                  <Tooltip
                    labelFormatter={(_, p) => p?.[0]?.payload?.fullLabel || ''}
                    formatter={(v, name) => [`${v}%`, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0d8cc' }}
                  />
                  <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="NFHS-4" fill={NFHS4_COLOR} radius={[0, 3, 3, 0]} maxBarSize={18} />
                  <Bar dataKey="NFHS-5" fill={NFHS5_COLOR} radius={[0, 3, 3, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* NFHS Detail Table */}
        {(program.nfhsData || []).length > 0 && (
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Indicator Details</h3>
              <div className="table-legend">
                <span className="tl-dot" style={{ background: NFHS4_COLOR }} /> NFHS-4
                <span className="tl-dot" style={{ background: NFHS5_COLOR }} /> NFHS-5
              </div>
            </div>
            <div className="ind-table">
              <div className="ind-head">
                <span>Indicator <span className="head-note">(green row = improvement · red row = regression)</span></span>
                <span>NFHS-4 (2015-16)</span>
                <span>NFHS-5 (2019-21)</span>
                <span>Change</span>
              </div>
              {program.nfhsData.map(d => <IndRow key={d.label} {...d} />)}
            </div>
          </div>
        )}

        {/* Observations + Actions */}
        <div className="detail-two-col">
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Programme Observations</h3>
              <span className="detail-card-note">Source: NFHS-5 (2019-21) · NHM NPCC Meeting, Apr 2026</span>
            </div>
            <ul className="obs-list">
              {program.observations.map((o, i) => (
                <li key={i} className={`obs-item ${i < 2 && program.status === 'red' ? 'obs-critical' : ''}`}>
                  <span className="obs-marker" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Priority Actions</h3>
              <span className="detail-card-note">Derived from NPCC Apr 2026 · NFHS-5 gap analysis</span>
            </div>
            <ol className="action-list">
              {program.actions.map((a, i) => (
                <li key={i} className="action-item">
                  <span className="action-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>

      <footer className="detail-footer">
        Sources: NFHS-4 (2015-16) State Fact Sheet — Arunachal Pradesh, IIPS Mumbai.
        NFHS-5 (2019-21) State Fact Sheet — Arunachal Pradesh, IIPS Mumbai.
        NHM NPCC Meeting, Arunachal Pradesh, 1 April 2026. Ministry of Health &amp; Family Welfare, Govt. of India.
      </footer>
    </div>
  );
}

function IndRow({ label, nfhs4, nfhs5, unit, lowerIsBetter }) {
  let improved = null;
  let diff = null;

  if (nfhs4 !== null && nfhs5 !== null) {
    improved = lowerIsBetter ? nfhs5 < nfhs4 : nfhs5 > nfhs4;
    diff = (nfhs5 - nfhs4).toFixed(1);
  }

  const fmtVal = v => v !== null && v !== undefined
    ? <span className="mono">{v}{unit}</span>
    : <em className="na">—</em>;

  return (
    <div className={`ind-row ${improved === null ? '' : improved ? 'row-ok' : 'row-bad'}`}>
      <span className="ind-lbl">
        {label}
        <span className="ind-direction">{lowerIsBetter ? 'lower is better' : 'higher is better'}</span>
      </span>
      <span className="ind-val v4">{fmtVal(nfhs4)}</span>
      <span className="ind-val v5">{fmtVal(nfhs5)}</span>
      <span className={`ind-delta ${improved === null ? 'delta-na' : improved ? 'delta-pos' : 'delta-neg'}`}>
        {improved !== null && (improved ? '↑ ' : '↓ ')}
        {diff !== null ? `${diff > 0 ? '+' : ''}${diff}${unit}` : '—'}
      </span>
    </div>
  );
}
