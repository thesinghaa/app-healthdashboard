import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { STATUS_CONFIG } from '../data/programs';

const NFHS4_COLOR = '#4A7FA5';
const NFHS5_COLOR = '#B8793A';

/* ── HRH helpers ─────────────────────────────────────────────────── */

function HRHDonut({ regular, contractual, gap, total, colors: colorsProp }) {
  const size = 84, r = 30, cx = 42;
  const circ = 2 * Math.PI * r;
  const colors = colorsProp || ['#FF5500', '#D97706', '#CBD5E1'];
  const segs = [
    { pct: (regular    / total) * 100, color: colors[0] },
    { pct: (contractual / total) * 100, color: colors[1] },
    { pct: (gap        / total) * 100, color: colors[2] },
  ].filter(s => s.pct > 0);
  let off = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 84 84">
      <g transform="rotate(-90 42 42)">
        {segs.map((s, i) => {
          const dash = (s.pct / 100) * circ; const o = off; off += dash;
          return <circle key={i} cx={cx} cy={cx} r={r} fill="none"
            stroke={s.color} strokeWidth={13}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-o} />;
        })}
      </g>
    </svg>
  );
}

function fillPillStyle(pct) {
  if (pct == null) return { background: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB' };
  if (pct >= 80)   return { background: '#F0FFF4', color: '#276749', border: '1px solid #C6F6D5' };
  if (pct >= 50)   return { background: '#FFFBEB', color: '#B7791F', border: '1px solid #FAF089' };
  return             { background: '#FFF0F0', color: '#C53030', border: '1px solid #FED7D7' };
}

const HRH_PRODUCTIVITY = {
  'medical-officer': [
    { name: 'OPD / Doctor / Day',       Actual: 7,  IPHS: 60  },
  ],
  'lab-tech': [
    { name: 'Tests / LT / Day (PHC)',   Actual: 3,  IPHS: 100 },
    { name: 'Tests / LT / Day (DH)',    Actual: 17, IPHS: 100 },
  ],
  'specialist': [
    { name: 'Ob/Gyn Surgeries / Week',  Actual: 2,  IPHS: 7   },
    { name: 'Dental OPD / Day',         Actual: 4,  IPHS: 20  },
  ],
};

const NCD_SPECIALISTS = [
  { name: 'Physiotherapist', pct: 91  },
  { name: 'Psychologist',    pct: 26  },
  { name: 'MPSW',            pct: 71  },
  { name: 'Counsellor',      pct: 31  },
  { name: 'Optometrist',     pct: 16  },
  { name: 'Audiologist',     pct: 100 },
  { name: 'Dentist',         pct: 106 },
  { name: 'Psychiatrist',    pct: 100 },
  { name: 'Ophthalmologist', pct: 118 },
  { name: 'ENT Surgeon',     pct: 90  },
  { name: 'Physician',       pct: 35  },
];

function HRHSection({ program }) {
  const ach     = program.achievement ?? 0;
  const tgt     = program.target;
  const inPlace = program.inPlace ?? 0;
  const req     = program.requirement ?? 0;
  const gap     = req - inPlace;
  const regIP   = program.regular ?? 0;
  const regS    = program.regSanctioned ?? 0;
  const ctrlIP  = program.contractual ?? 0;
  const ctrlA   = program.ctrlApproved ?? 0;
  const regFill  = regS  > 0 ? Math.round(regIP  / regS  * 100) : null;
  const ctrlFill = ctrlA > 0 ? Math.round(ctrlIP / ctrlA * 100) : null;
  const barColor = program.status === 'red' ? '#E53E3E' : program.status === 'yellow' ? '#D97706' : '#FF5500';

  const staffingData = [];
  if (regS  > 0) staffingData.push({ category: 'Regular',     Sanctioned: regS,  'In Place': regIP  });
  if (ctrlA > 0) staffingData.push({ category: 'Contractual', Sanctioned: ctrlA, 'In Place': ctrlIP });

  const prodData = HRH_PRODUCTIVITY[program.id];
  const prodH    = prodData ? prodData.length * 72 + 50 : 0;

  return (
    <>
      <div className="hrh-cs-band">
        <span className="hrh-cs-eyebrow">Current Status</span>
        <span className="hrh-cs-src">Key Deliverable 2025-26 · NHM NPCC</span>
      </div>

      {/* Achievement gauge */}
      <div className="detail-card hrh-ach-card">
        <div className="hrh-ach-top">
          <div className="hrh-ach-pct" style={{ color: barColor }}>{ach}%</div>
          <div className="hrh-ach-gauge-wrap">
            <div className="hrh-ach-track">
              <div className="hrh-ach-fill" style={{ width: `${ach}%`, background: barColor }} />
              {tgt != null && <div className="hrh-ach-target" style={{ left: `${tgt}%` }} />}
            </div>
            <div className="hrh-ach-sublabels">
              <span>0%</span>
              {tgt != null && (
                <span className="hrh-ach-tgt-tag" style={{ left: `${tgt}%` }}>Target {tgt}%</span>
              )}
              <span>100%</span>
            </div>
          </div>
        </div>
        <div className="hrh-stat-row">
          {[
            { label: 'Requirement', val: req,     col: '#1A1F36' },
            { label: 'In Place',    val: inPlace,  col: barColor  },
            { label: 'Gap',         val: gap > 0 ? gap : '—', col: gap > 0 ? '#E53E3E' : '#FF5500' },
            ...(tgt != null ? [{ label: 'RoP Target', val: `${tgt}%`, col: '#D97706' }] : []),
          ].map(s => (
            <div key={s.label} className="hrh-stat">
              <div className="hrh-stat-val" style={{ color: s.col }}>{s.val}</div>
              <div className="hrh-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Staffing breakdown + Workforce composition */}
      <div className="detail-two-col">
        {staffingData.length > 0 && (
          <div className="detail-card">
            <div className="detail-card-header">
              <h3>Staffing Breakdown</h3>
              <span className="detail-card-note">Sanctioned/Approved vs In Place</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={staffingData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede9e1" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0d8cc' }} />
                <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Sanctioned" fill="#CBD5E1" radius={[3,3,0,0]} maxBarSize={44} />
                <Bar dataKey="In Place"   fill={barColor} radius={[3,3,0,0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3>Workforce Composition</h3>
            <span className="detail-card-note">vs Total Requirement</span>
          </div>
          <div className="hrh-donut-wrap">
            <HRHDonut regular={regIP} contractual={ctrlIP}
              gap={gap > 0 ? gap : 0} total={req || 1} />
            <div className="hrh-donut-legend">
              {[
                { label: `Regular (${regIP})`,      color: '#FF5500' },
                { label: `Contractual (${ctrlIP})`, color: '#D97706' },
                ...(gap > 0 ? [{ label: `Gap (${gap})`, color: '#CBD5E1' }] : []),
              ].map(l => (
                <div key={l.label} className="hrh-dl-item">
                  <span className="hrh-dl-dot" style={{ background: l.color }} />
                  <span>{l.label}</span>
                </div>
              ))}
              <div className="hrh-dl-total">Required: {req}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fill rate table */}
      <div className="detail-card">
        <div className="detail-card-header">
          <h3>Fill Rate Analysis</h3>
          <span className="detail-card-note">Regular sanctioned + Contractual approved vs In Place</span>
        </div>
        <div className="hrh-fill-table">
          <div className="hrh-fill-head">
            <span>Category</span>
            <span className="ta-r">Posts</span>
            <span className="ta-r">In Place</span>
            <span className="ta-r">Fill Rate</span>
            <span className="ta-r">Vacant</span>
          </div>
          {regS > 0 && (
            <div className="hrh-fill-row">
              <span>Regular</span>
              <span className="ta-r">{regS}</span>
              <span className="ta-r hrh-fi-teal">{regIP}</span>
              <span className="ta-r"><span className="hrh-fill-pill" style={fillPillStyle(regFill)}>{regFill}%</span></span>
              <span className="ta-r hrh-fi-red">{regS - regIP}</span>
            </div>
          )}
          {ctrlA > 0 && (
            <div className="hrh-fill-row">
              <span>Contractual</span>
              <span className="ta-r">{ctrlA}</span>
              <span className="ta-r hrh-fi-teal">{ctrlIP}</span>
              <span className="ta-r"><span className="hrh-fill-pill" style={fillPillStyle(ctrlFill)}>{ctrlFill != null ? ctrlFill + '%' : '—'}</span></span>
              <span className="ta-r hrh-fi-red">{ctrlA - ctrlIP}</span>
            </div>
          )}
          <div className="hrh-fill-row hrh-fill-total">
            <span>Total</span>
            <span className="ta-r">{(regS || 0) + (ctrlA || 0)}</span>
            <span className="ta-r hrh-fi-teal">{inPlace}</span>
            <span className="ta-r"><span className="hrh-fill-pill hrh-fill-pill--navy">{ach}%</span></span>
            <span className="ta-r hrh-fi-red">{gap > 0 ? gap : 0}</span>
          </div>
        </div>
      </div>

      {/* Productivity vs IPHS — cadre-specific */}
      {prodData && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h3>Productivity vs IPHS 2022</h3>
            <span className="detail-card-note">Actual state average · National standard comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={prodH}>
            <BarChart data={prodData} layout="vertical"
              margin={{ top: 8, right: 80, left: 0, bottom: 8 }}
              barGap={3} barCategoryGap="32%">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ede9e1" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#7a7060' }} />
              <YAxis dataKey="name" type="category" width={210}
                tick={{ fontSize: 11, fill: '#3a3020' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e0d8cc' }} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Actual" fill="#E53E3E" radius={[0,3,3,0]} maxBarSize={16} />
              <Bar dataKey="IPHS"   fill="#CBD5E1" radius={[0,3,3,0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <p className="hrh-prod-note">IPHS 2022 = Indian Public Health Standards national benchmark.</p>
        </div>
      )}

      {/* NCD specialist sub-cadres — Specialist only */}
      {program.id === 'specialist' && (
        <div className="detail-card">
          <div className="detail-card-header">
            <h3>NCD Specialist Sub-Cadres — Facility Coverage vs IPHS</h3>
            <span className="detail-card-note">% of facilities meeting IPHS norms · Slide 4, HRH Review 2025-26</span>
          </div>
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={NCD_SPECIALISTS} layout="vertical"
              margin={{ top: 8, right: 64, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ede9e1" />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, 130]} />
              <YAxis dataKey="name" type="category" width={130}
                tick={{ fontSize: 11, fill: '#3a3020' }} />
              <Tooltip formatter={v => [`${v}%`, 'Coverage vs IPHS']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="pct" name="Coverage vs IPHS" fill="#FF5500"
                radius={[0,3,3,0]} maxBarSize={16}
                label={{ position: 'right', fontSize: 10, fill: '#475569',
                  formatter: v => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
          <p className="hrh-prod-note">Values ≥100% indicate full IPHS coverage. Source: NHM HRH Review 2025-26.</p>
        </div>
      )}

      {/* State-wide HRH context */}
      <div className="detail-card hrh-context-card">
        <div className="detail-card-header">
          <h3>State HRH Context</h3>
          <span className="detail-card-note">All cadres combined · HRH Review 2025-26</span>
        </div>
        <div className="hrh-ctx-grid">
          <div className="hrh-ctx-panel">
            <HRHDonut regular={48} contractual={30} gap={22} total={100} />
            <div className="hrh-ctx-legend">
              {[
                { l: 'Regular 48%',     c: '#FF5500' },
                { l: 'Contractual 30%', c: '#D97706' },
                { l: 'Gap 22%',         c: '#CBD5E1' },
              ].map(x => (
                <div key={x.l} className="hrh-dl-item">
                  <span className="hrh-dl-dot" style={{ background: x.c }} /><span>{x.l}</span>
                </div>
              ))}
            </div>
            <div className="hrh-ctx-title">Workforce Mix</div>
          </div>

          <div className="hrh-ctx-panel">
            <HRHDonut regular={50} contractual={24} gap={26} total={100}
              colors={['#C0504D', '#E53E3E', '#E8E0D0']} />
            <div className="hrh-ctx-legend">
              {[
                { l: 'HRH = 50% of RE', c: '#C0504D' },
                { l: 'Spent 24%',        c: '#E53E3E' },
                { l: 'Unspent 26%',      c: '#E8E0D0' },
              ].map(x => (
                <div key={x.l} className="hrh-dl-item">
                  <span className="hrh-dl-dot" style={{ background: x.c }} /><span>{x.l}</span>
                </div>
              ))}
            </div>
            <div className="hrh-ctx-title">Budget (Nov 2025)</div>
          </div>

          <div className="hrh-ctx-panel">
            <div className="hrh-ctx-prod">
              {[
                { lbl: 'OPD/Doctor/Day',   actual: 7, std: 60  },
                { lbl: 'Dental OPD/Day',   actual: 4, std: 20  },
                { lbl: 'Tests/LT/Day',     actual: 9, std: 100 },
                { lbl: 'Surgery/OBG/Wk',  actual: 2, std: 7   },
              ].map(p => (
                <div key={p.lbl} className="hrh-ctx-prod-row">
                  <span className="hrh-ctx-prod-lbl">{p.lbl}</span>
                  <span>
                    <span className="hrh-ctx-prod-actual">{p.actual}</span>
                    <span className="hrh-ctx-prod-std">/{p.std}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="hrh-ctx-title">Productivity vs IPHS</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Current-Status Section helpers ─────────────────────────────── */

function CSBand({ heading, source }) {
  return (
    <div className="cs-band">
      <span className="cs-eyebrow">Current Status</span>
      <span className="cs-hdg">{heading}</span>
      <span className="cs-src-tag">{source}</span>
    </div>
  );
}

function MMRStatus({ cs }) {
  return (
    <>
      <CSBand heading="SDG 3.1.1 — Maternal Mortality Ratio" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="cs-sdg-strip">
          <div className="cs-sdg-col cs-sdg-col--label">
            <span className="cs-value-muted">SDG Indicator</span>
            <span className="cs-sdg-indicator-name">3.1.1 Maternal Mortality Ratio</span>
          </div>
          <div className="cs-sdg-col">
            <span className="cs-value-muted">State Status</span>
            <span className="cs-value-na">N/A</span>
          </div>
          <div className="cs-sdg-col">
            <span className="cs-value-muted">SDG Target</span>
            <span className="cs-value-good">Less than 70</span>
          </div>
        </div>
        <div className="cs-stats-3" style={{ marginTop: 20 }}>
          <div className="cs-stat-block">
            <div className="cs-stat-val">28</div>
            <div className="cs-stat-lbl">Total Districts</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-red">3</div>
            <div className="cs-stat-lbl">Maternal Deaths — HMIS 2024-25</div>
          </div>
          <div className="cs-stat-block cs-stat-wide">
            <div className="cs-stat-lbl cs-stat-lbl--header">Major Cause (HMIS 2024-25)</div>
            <div className="cs-stat-cause">Others / Unknown — 64.3% (2)</div>
            <div className="cs-stat-cause">Hypertensive Disorder in Pregnancy — 5.51% (1)</div>
          </div>
        </div>
        <div className="cs-highlights">
          <div className="cs-hl-row">
            <span className="cs-hl-label">Districts contributing most MDs (2024-25)</span>
            <span className="cs-hl-value">East Siang (2); Namsai (1)</span>
          </div>
          <div className="cs-hl-row">
            <span className="cs-hl-label">Place of Deaths</span>
            <span className="cs-hl-value">Facility deaths (100%)</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ChildHealthStatus({ cs }) {
  return (
    <>
      <CSBand heading="Child Health — Arunachal Pradesh" source={cs.source} />
      <div className="detail-card cs-card">
        <table className="cs-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>SDG Indicator</th>
              <th>State Status</th>
              <th>National Level</th>
              <th>SDG Target 2030</th>
            </tr>
          </thead>
          <tbody>
            {cs.sdgIndicators.map((row, i) => (
              <tr key={i}>
                <td>{row.no}</td>
                <td>{row.name}</td>
                <td className="cs-val-teal">{row.state}</td>
                <td>{row.national}</td>
                <td>{row.sdgTarget}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="cs-stats-3" style={{ marginTop: 20 }}>
          <div className="cs-stat-block">
            <div className="cs-stat-val">{cs.totalDistricts}</div>
            <div className="cs-stat-lbl">Total Districts</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val">{cs.sncuNicus}</div>
            <div className="cs-stat-lbl">SNCU / NICUs</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val">{cs.deics}</div>
            <div className="cs-stat-lbl">DEICs</div>
          </div>
        </div>
      </div>
      {cs.mortalityRows.map((row, i) => (
        <div key={i} className="detail-card cs-card">
          <div className="cs-mort-label">{row.label}</div>
          <div className="cs-mort-two">
            <div>
              <div className="cs-mort-head">Districts with High Mortality</div>
              <div className="cs-mort-val">{row.highDistricts}</div>
            </div>
            <div>
              <div className="cs-mort-head">Main Reasons of Mortality</div>
              <div className="cs-mort-val">{row.causes}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="detail-card cs-card">
        <div className="cs-mort-label">RBSK — Functionality of DEIC</div>
        <div className="cs-stats-3" style={{ marginTop: 12 }}>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-amber">{cs.rbsk.hrPct}</div>
            <div className="cs-stat-lbl">Overall HR Available</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-amber">{cs.rbsk.equipPct}</div>
            <div className="cs-stat-lbl">Overall Equipment Available</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-lbl cs-stat-lbl--header">Bottom 30% Districts</div>
            {cs.rbsk.bottom30.map((d, j) => (
              <div key={j} className="cs-stat-cause cs-red">{d}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FPStatus({ cs }) {
  return (
    <>
      <CSBand heading="SDG 3.7.1 — Family Planning" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="cs-fp-indicator">{cs.indicator}</div>
        <div className="cs-stats-3" style={{ marginTop: 20 }}>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-red">{cs.stateStatus}</div>
            <div className="cs-stat-lbl">State Status</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-value-good-lg">{cs.sdgTarget}</div>
            <div className="cs-stat-lbl">SDG Target {cs.sdgTargetNote}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function TBStatus({ cs }) {
  return (
    <>
      <CSBand heading="TB Mukt Bharat Abhiyan — Current Status" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>SDG Disease Elimination Targets</h3>
          <span className="detail-card-note">TB Mukt Bharat Abhiyan</span>
        </div>
        <div className="cs-stats-3">
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-red">{cs.incidence}</div>
            <div className="cs-stat-lbl">Incidence (per lakh population)</div>
            <div className="cs-stat-sub">Target: 47 / lakh (80% reduction)</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-red">{cs.mortality}</div>
            <div className="cs-stat-lbl">Mortality (per lakh population)</div>
            <div className="cs-stat-sub">Target: 3 / lakh (90% reduction)</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="cs-mort-head">Notification vs Estimates — District Achievement</div>
          <div className="cs-notify-row">
            <div className="cs-notify-cell cs-green-cell">
              <div className="cs-notify-val">{cs.notifVsEst.above90} districts</div>
              <div className="cs-notify-lbl">&gt;90%</div>
            </div>
            <div className="cs-notify-cell cs-amber-cell">
              <div className="cs-notify-val">{cs.notifVsEst.mid} districts</div>
              <div className="cs-notify-lbl">50–90%</div>
            </div>
            <div className="cs-notify-cell cs-red-cell">
              <div className="cs-notify-val">{cs.notifVsEst.below50} districts</div>
              <div className="cs-notify-lbl">&lt;50%</div>
            </div>
          </div>
          <div className="cs-factors-note">Factors affecting: {cs.factors.notification}</div>
          <div className="cs-mort-head" style={{ marginTop: 14 }}>Death Rate — District Achievement</div>
          <div className="cs-notify-row">
            <div className="cs-notify-cell cs-red-cell">
              <div className="cs-notify-val">{cs.deathRate.above5} districts</div>
              <div className="cs-notify-lbl">&gt;5%</div>
            </div>
            <div className="cs-notify-cell cs-amber-cell">
              <div className="cs-notify-val">{cs.deathRate.mid} districts</div>
              <div className="cs-notify-lbl">3–5%</div>
            </div>
            <div className="cs-notify-cell cs-green-cell">
              <div className="cs-notify-val">{cs.deathRate.below3} districts</div>
              <div className="cs-notify-lbl">&lt;3%</div>
            </div>
          </div>
          <div className="cs-factors-note">Factors affecting: {cs.factors.deathRate}</div>
        </div>
      </div>
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>Progress under TB Mukt Bharat Abhiyan</h3>
          <span className="detail-card-note">{cs.abhiyanPeriod}</span>
        </div>
        <div className="cs-tb-grid">
          {cs.abhiyanMetrics.map((m, i) => (
            <div key={i} className="cs-tb-metric">
              <div className="cs-tb-val">{m.value}</div>
              <div className="cs-tb-lbl">{m.label}</div>
              <div className="cs-tb-detail">{m.detail}</div>
            </div>
          ))}
        </div>
        <div className="cs-tb-infra">
          {cs.infrastructure.map((inf, i) => (
            <div key={i} className="cs-hl-row">
              <span className="cs-hl-label">{inf.label}</span>
              <span className="cs-hl-value">{inf.value} — {inf.detail}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="cs-mort-head">Ni-kshay Poshan Yojana</div>
          <table className="cs-table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Eligible Beneficiaries</th>
                <th>Beneficiaries Paid All Benefits</th>
                <th>Beneficiaries to be Paid</th>
              </tr>
            </thead>
            <tbody>
              {cs.nikshayYojana.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.year}</strong></td>
                  <td>{row.eligible.toLocaleString()}</td>
                  <td className={row.paidAll < 100 ? 'cs-val-red' : ''}>{row.paidAll.toLocaleString()}</td>
                  <td>{row.toBePaid.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function LeprosyStatus({ cs }) {
  return (
    <>
      <CSBand heading="NLEP — Disease Elimination Status" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="cs-sdg-strip">
          <div className="cs-sdg-col cs-sdg-col--label">
            <span className="cs-value-muted">Disease Elimination Target</span>
            <span className="cs-fp-indicator">{cs.targetDesc}</span>
          </div>
          <div className="cs-sdg-col">
            <span className="cs-value-muted">Total Districts</span>
            <span className="cs-stat-val" style={{ fontSize: 28 }}>{cs.totalDistricts}</span>
          </div>
          <div className="cs-sdg-col">
            <span className="cs-value-muted">Districts Achieved IOT</span>
            <span className="cs-stat-val cs-teal" style={{ fontSize: 28 }}>{cs.iotAchieved}</span>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="cs-mort-head">Districts achieving IOT — 50–60% range</div>
          <div className="cs-iot-districts">{cs.iotDistricts50_60}</div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="cs-mort-head">Data of Arunachal Pradesh (2024-25 &amp; 2025-26)</div>
          <table className="cs-table" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>F.Y.</th>
                <th>Total New Cases</th>
                <th>Total G2D Cases</th>
                <th>Total Child Cases</th>
              </tr>
            </thead>
            <tbody>
              {cs.annualData.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.fy}</strong></td>
                  <td>{row.newCases}</td>
                  <td>{row.g2dCases}</td>
                  <td>{row.childCases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function MalariaStatus({ cs }) {
  return (
    <>
      <CSBand heading="Malaria — Disease Status" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="cs-stats-3">
          <div className="cs-stat-block cs-stat-wide">
            <div className="cs-stat-lbl cs-stat-lbl--header">National Framework Target</div>
            <div className="cs-stat-cause">{cs.eliminationTarget}</div>
          </div>
          <div className="cs-stat-block">
            <div className="cs-stat-val cs-amber">{cs.totalCases2025}</div>
            <div className="cs-stat-lbl">Total Cases 2025</div>
            <div className="cs-stat-sub">{cs.caseBreakdown2025}</div>
          </div>
        </div>
      </div>
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>Annual Case Trend</h3>
          <span className="detail-card-note">Pv = P. vivax · Pf = P. falciparum · Ind = Indigenous · Imp = Imported</span>
        </div>
        <table className="cs-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Cases (Total)</th>
              <th>Pv / Pf</th>
              <th>Indigenous</th>
              <th>Imported</th>
              <th>Deaths</th>
            </tr>
          </thead>
          <tbody>
            {cs.casesTrend.map((row, i) => (
              <tr key={i} className={row.year === '2025' ? 'cs-row-highlight' : ''}>
                <td><strong>{row.year}</strong></td>
                <td>{row.total}</td>
                <td>Pv-{row.pv}, Pf-{row.pf}</td>
                <td>{row.indigenous}</td>
                <td>{row.imported}</td>
                <td>{row.deaths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>Programme Status</h3>
          <span className="detail-card-note">NCVBDCP · MoHFW NPCC May 2026</span>
        </div>
        <ul className="obs-list">
          {cs.keyPoints.map((pt, i) => (
            <li key={i} className="obs-item">
              <span className="obs-marker" />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function PMABHIMStatus({ cs }) {
  return (
    <>
      <CSBand heading="PM-ABHIM — Physical & Financial Progress (FY 2021-22 to 2025-26)" source={cs.source} />
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>Physical Progress</h3>
          <span className="detail-card-note">FY 2021-22 to FY 2025-26</span>
        </div>
        <table className="cs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Approved</th>
              <th>Work Started</th>
              <th>% Started</th>
              <th>Completed</th>
              <th>% Completed</th>
              <th>Functional</th>
            </tr>
          </thead>
          <tbody>
            {cs.physicalProgress.map((row, i) => (
              <tr key={i}>
                <td>{row.component}</td>
                <td>{row.approved}</td>
                <td>{row.started}</td>
                <td>{row.startedPct}%</td>
                <td>{row.completed}</td>
                <td className={row.completedPct > 0 ? 'cs-val-amber' : 'cs-val-red'}>{row.completedPct}%</td>
                <td>{row.functional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="detail-card cs-card">
        <div className="detail-card-header">
          <h3>XV-FC Financial Progress</h3>
          <span className="detail-card-note">Rs. in Crore · % Exp. as on March 2026</span>
        </div>
        <div className="cs-table-scroll">
          <table className="cs-table cs-table--finance">
            <thead>
              <tr>
                <th rowSpan={2} className="cs-th-component">Component</th>
                {cs.financialYears.map(yr => (
                  <th key={yr} colSpan={2} className="cs-th-yr">{yr}</th>
                ))}
              </tr>
              <tr>
                {cs.financialYears.map(yr => [
                  <th key={yr + 'a'} className="cs-th-sub">Appr.</th>,
                  <th key={yr + 'r'} className="cs-th-sub">Rel.</th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {cs.financialProgress.map((row, i) => (
                <tr key={i} className={row.isTotal ? 'cs-row-total' : ''}>
                  <td>{row.component}</td>
                  {cs.financialYears.map(yr => [
                    <td key={yr + 'a'}>{row[yr]?.approval ?? '—'}</td>,
                    <td key={yr + 'r'} className={row[yr]?.release == null ? 'cs-val-muted' : ''}>{row[yr]?.release ?? '—'}</td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hrh-prod-note">% Expenditure (as on March 2026) is against the amount released.</p>
      </div>
    </>
  );
}

function CurrentStatusSection({ program }) {
  const cs = program.currentStatus;
  if (!cs) return null;
  switch (cs.type) {
    case 'mmr':            return <MMRStatus cs={cs} />;
    case 'child-health':   return <ChildHealthStatus cs={cs} />;
    case 'family-planning': return <FPStatus cs={cs} />;
    case 'tb':             return <TBStatus cs={cs} />;
    case 'leprosy':        return <LeprosyStatus cs={cs} />;
    case 'malaria':        return <MalariaStatus cs={cs} />;
    case 'pm-abhim':       return <PMABHIMStatus cs={cs} />;
    default:               return null;
  }
}

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

        {/* Programme-specific Current Status */}
        <CurrentStatusSection program={program} />

        {/* HRH staffing detail — cadre programmes only */}
        {division?.id === 'hrh' && program.id !== 'pm-abhim' && <HRHSection program={program} />}

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
