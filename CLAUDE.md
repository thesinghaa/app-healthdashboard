# AP Health Dashboard — NHM Arunachal Pradesh Demo (CLAUDE.md)

This file gives any Claude session immediate context on the project so you can contribute without needing prior conversation history.

---

## SELF-UPDATE PROTOCOL — TOP PRIORITY

**Every Claude session working on this project MUST update this file before ending.**

At the close of each session, Claude must:
1. Review what changed during the session (new components, data mappings, CSS classes, routes, design decisions, bug fixes, deferred items)
2. Reflect those changes in the relevant sections of this file — update existing entries or add new ones
3. Commit the updated CLAUDE.md with the same session's final commit, or as a standalone commit:
   ```
   git add CLAUDE.md && git commit --author="AryanSinghpif <aryan.singh@pahleindia.org>" -m "docs: update CLAUDE.md with session changes"
   ```
4. Push to main

**Do not end a session without updating this file.** This is the highest-priority rule in the project — it ensures every future session has accurate context without needing conversation history.

What to update:
- New or changed components / pages
- New data fields or mappings added to kdData.js
- New CSS classes or design tokens
- Deferred work items
- Decisions made (e.g. "chose Plotly over custom SVG because...")
- Any hard rules that emerged from user feedback

---

## What this project is

A React + Vite **demo health dashboard** tracking NHM Arunachal Pradesh programme performance. Built for **Pahlé India Foundation (PIF)**. Deployed on Vercel via GitHub auto-deploy (push to `main` → live).

Live repo: `https://github.com/AryanSinghpif/app-healthdashboard`

---

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | React 18 + Vite |
| Animations | GSAP (page entry/exit, not SVG anymore) |
| Charts | Recharts (AreaChart for HMIS trends) + Plotly.js via `react-plotly.js` (sunburst charts) |
| Styling | Plain CSS (`src/styles/ncd.css`) — no Tailwind, no CSS modules |
| Data | Static JS files + Google Sheets public CSV (no API key) |
| Fonts | Inter (body), Playfair Display (headings), JetBrains Mono (numbers) |
| Deploy | Vercel — push to `main` triggers auto-deploy |

---

## Navigation (5 layers)

```
Home (divisions)
  └── DivisionPage (division programme grid)
        └── KDProgrammePage (programme KD table)  ←  or HRHCadrePage / DrugsDiagnosticsPage
              ├── KDIndicatorDetail (single KD deep-dive)
              └── CurrentStatusDetailPage (current status charts — full page)
```

State lives in `App.jsx`:
- `page`: `'home' | 'division' | 'kd-list' | 'kd-indicator' | 'current-status'`
- `program`, `division`, `indicator`, `origin` objects

`goToDetail(program, division)` → `kd-list`
`goToDivision(division)` → `division`
`goToIndicator(kd)` → `kd-indicator`
`goToCurrentStatus(program, division)` → `current-status`
`goBack()` → returns one level up; `current-status` always backs to `division`

**Back navigation note**: `current-status` always returns to `division` regardless of entry point (no origin tracking for this layer).

---

## Key files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root router — state-based navigation |
| `src/pages/DivisionPage.jsx` | 2nd layer: division programme grid |
| `src/pages/KDProgrammePage.jsx` | 3rd layer: programme-level KD table |
| `src/pages/HRHCadrePage.jsx` | 3rd layer (HRH division only): staffing cadre view |
| `src/pages/DrugsDiagnosticsPage.jsx` | 3rd layer (HSS drugs): special layout |
| `src/pages/CurrentStatusDetailPage.jsx` | Full-page current status charts (4th layer) |
| `src/pages/CurrentStatusSection.jsx` | Chart components; also exports named `CSEntryBar` |
| `src/pages/KDIndicatorDetail.jsx` | 4th layer: single indicator deep-dive |
| `src/pages/NCDDetailPage.jsx` | Legacy NCD detail (keep, not removed) |
| `src/data/kdData.js` | KD tree — all ~157 Key Deliverables |
| `src/data/programs.js` | Division → programme metadata |
| `src/styles/ncd.css` | All CSS (append overrides at the bottom) |

---

## Data sources

### 1. KD data (`src/data/kdData.js`)
Static JS export `KD_TREE` structured as:
```js
KD_TREE[divisionId].programmes[programmeId].kds = [
  {
    no, type, indicator, statement, unit,
    target, targetLabel, achievement, achievedLabel,
    numerator, denominator, source,
    hmisCode,   // HMIS data item code e.g. '1.1' — null if no match
    hmisCat,    // HMIS category e.g. 'M1' — null if no match
    lowerIsBetter,
  }
]
```
Source: NHM AP FY 2025-26 NPCC document (April 2026).

### 2. HMIS live data (Google Sheets)
Sheet ID: `1vsCSdPZpBK5SQw9gppRLEEKDLhj19DHk`
URL pattern: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`

Columns: `Year, Month, Category, Data Item Code, Data Item Name, [25 district columns]`

Categories present: M1 (ANC), M2 (Delivery), M3 (C-section), M4 (Child Health), M5 (Nutrition), M8 (Family Planning), M9 (Immunization). No M6/M7 in current export.

**CSV parser** — always use the char-by-char quoted-field parser (handles commas in values):
```js
function parseCSV(text) {
  return text.trim().split('\n').map(line => {
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    cols.push(cur.trim());
    return cols;
  });
}
```

### 3. NFHS data
Embedded in `programs.js` as `nfhsData` arrays on each programme object. NFHS-4 (2015-16) vs NFHS-5 (2019-21), Arunachal Pradesh.

### 4. NCD_compiled sheet
**Deferred** — do not connect yet. User will ask for it later.

---

## HMIS code mappings

27 KDs currently have `hmisCode` + `hmisCat` set. Key ones:

| KD | Indicator | Code | Cat |
|----|-----------|------|-----|
| 1 | ANC Coverage | 1.1 | M1 |
| 2 | 1st Trimester ANC | 1.1.1 | M1 |
| 3 | 4+ ANC Check-ups | 1.2.7 | M1 |
| 6 | Institutional Deliveries | 2.2 | M2 |
| 16 | HBNC Home Visits | 2.4 | M2 |
| 20 | Newborn Screening | 4.5.1 | M4 |
| 23 | Children Screened by RBSK | 4.5.2 | M4 |
| 28 | Full Immunization | 9.2.5.a | M9 |
| 29 | Hepatitis B Birth Dose | 9.1.10 | M9 |
| 33 | Td10 Coverage | 9.5.3 | M9 |
| 36 | Breastfeeding within 1hr | 4.4.3 | M4 |
| 39 | IFA Coverage (PW) | 1.2.4 | M1 |
| 40 | IFA Syrup Children 6-59m | 5.1.2 | M5 |
| 44 | PPIUCD Acceptance | 8.4 | M8 |
| 45 | Injectable MPA | 8.8 | M8 |

See `kdData.js` for all 27.

---

## Districts (25 in AP)

Changlang, Dibang Valley, East Kameng, Anjaw, East Siang, Kamle, Kra Daadi, Kurung Kumey, Leparada, Lohit, Longding, Lower Dibang Valley, Lower Siang, Lower Subansiri, Namsai, Pakke Kessang, Papum Pare, Shi Yomi, Siang, Tawang, Tirap, Upper Siang, Upper Subansiri, West Kameng, West Siang.

**Itanagar/Capital Complex** is missing from the Google Sheet — user is aware.

---

## KDIndicatorDetail page sections (4th layer)

1. **Topbar** — breadcrumb: Division › Programme › Indicator
2. **KD meta strip** — KD badge, type pill, indicator name, statement
3. **Achievement Overview** — Plotly sunburst (3 branches: FY 25-26 / NFHS-5 / NFHS-4, each split achieved vs remaining)
4. **FY 2025-26 Performance** — Target / Achievement / Status numbers card
5. **HMIS Monthly Trend** — Recharts AreaChart (only if `hmisCode` set)
6. **District Performance** — two-column: Plotly sunburst (left) + insight panel (right: state total, top 3, bottom 3, narrative)
7. **NFHS Baseline table** — NFHS-4 → NFHS-5 comparison with pill badges and change indicator

---

## Plotly sunburst colour palettes

Achievement gauge colours per status:
- `achieved`: branch `#047857`, leaf `#10B981`, empty `#6EE7B7`
- `close`: branch `#B45309`, leaf `#F59E0B`, empty `#FCD34D`
- `gap`: branch `#BE123C`, leaf `#F43F5E`, empty `#FCA5A5`

NFHS-5: `#1D4ED8` / `#3B82F6` / `#93C5FD`
NFHS-4: `#6D28D9` / `#A855F7` / `#D8B4FE`

---

## Current-Status Sections (added May 2026)

Each programme data file can include a `currentStatus` object with a `type` field. Clicking the `CSEntryBar` on `KDProgrammePage` / `HRHCadrePage` / `DivisionPage` navigates to `CurrentStatusDetailPage`, which wraps `CurrentStatusSection` in an orange-themed full-page layout.

### Entry points
- `DivisionPage` — "Current Status" pill button inside each programme card (shown only if `prog.currentStatus` exists)
- `KDProgrammePage` — `CSEntryBar` replaces the old inline chart block inside `kd-prog-section`
- `HRHCadrePage` — `CSEntryBar` inside `hrh-cadre-section` for PM-ABHIM

### CurrentStatusDetailPage layout
- Orange hero band (`.csd-hero`) with programme name
- Navy topbar with breadcrumb (`.app-topbar`)
- Section header (`.csd-section-header`) + charts body (`.csd-charts-body`) inside `.csd-charts-outer`
- `CurrentStatusSection` renders charts; `useCSAnim` inside each chart component handles its own GSAP — page animation does NOT target `.csd-content > *` to avoid conflicts

### CSEntryBar (named export)
`import CurrentStatusSection, { CSEntryBar } from './CurrentStatusSection'`
- Slim navy gradient clickable bar
- Shows pulsing live dot, programme type label, source, and "View Full Report →" CTA
- CSS class: `.cs-entry-bar`

### Programmes with currentStatus

| Programme | File | `currentStatus.type` | Data source |
|-----------|------|---------------------|-------------|
| Maternal Health | `rch/maternal-health.js` | `'mmr'` | SDG 3.1.1 — N/A state, 3 MDs, East Siang/Namsai |
| Child Health | `rch/child-health.js` | `'child-health'` | IMR 20, SBR 8.8, SNCU 27 deaths, RBSK 52%/67% |
| JSY | `rch/jsy.js` | `'family-planning'` | SDG 3.7.1 — 60.2% vs 74.2% national avg |
| TB (NTEP) | `ndcp/tb.js` | `'tb'` | Incidence 191, Mortality 18; TB Mukt Abhiyan progress |
| NLEP | `ndcp/nlep.js` | `'leprosy'` | 25 districts, 13 IOT, annual case data |
| NCVBDCP | `ndcp/ncvbdcp.js` | `'malaria'` | 5-year trend (32 cases 2025), 16 districts SNV-eligible |
| PM-ABHIM | `hrh/pm-abhim.js` | `'pm-abhim'` | IPHL 5/22 complete, XV-FC financial progress table |

Rendering components in `CurrentStatusSection.jsx`: `MMRStatus`, `ChildHealthStatus`, `FPStatus`, `TBStatus`, `LeprosyStatus`, `MalariaStatus`, `PMABHIMStatus`.

CSS classes: `.cs-*` for chart components; `.csd-*` for `CurrentStatusDetailPage`; `.app-topbar`, `.app-back-btn`, `.app-breadcrumb` for the shared topbar system — all appended to `ncd.css`.

`HRHSection` is guarded: `division?.id === 'hrh' && program.id !== 'pm-abhim'` — PM-ABHIM routes to `CurrentStatusDetailPage` instead.

PM-ABHIM is registered in `hrh/index.js` as the 8th programme in the HRH division.

---

## Orange glass 3D card design system (added May 2026)

Applied consistently across all navigation layers via `ncd.css` overrides:

| Element | Class | Treatment |
|---------|-------|-----------|
| Home carousel cards | `.carousel-card` | `border: 4px solid #FF5500`, `blur(32px) saturate(175%)`, warm cream bg, 3-layer depth + orange glow |
| Carousel division heading | `.cc-header` | `border-left: none` (removed left orange stripe), warm glass bg |
| Programme row tiles | `.programme-row` | Glass micro-tiles, `border-top: 2px orange`, status left-border colours preserved |
| Division programme cards | `.dv-prog-card` | `border-top: 4px #FF5500`, `blur(18px)` |
| KD programme sections | `.kd-prog-section` | Glass container `blur(14px)`, `border-top: 3px`, 16px radius |
| KD table inside section | `.kd-prog-section .kd-table` | White tile with orange tint border |
| Detail cards / CS plot cards | `.detail-card`, `.cs-plot-card` | `blur(12px)`, `border-top: 3px`, depth shadows |
| HRH cadre sections | `.hrh-cadre-section` | Glass panels |

**Important**: `.bento-card` class in `grid.css` is dead — NOT used in any JSX. Home page uses `.carousel-card`.

---

## NCD division data files (`src/data/divisions/ncd/`)

11 programmes under NCD division. Each file exports a default object with: `id`, `name`, `status`, `keyMetric`, `statusReason`, `summary`, `keyMetrics[]`, `observations[]`, `actions[]`, `nfhsData[]`.

**Audit history**: May 2026 — found and fixed copy-paste errors in two files:
- `npcbvi.js` had data duplicated from `niddcp.js` (iodised salt) — corrected to NPCBVI (blindness/cataract) data
- `pmndp.js` had `keyMetric: 'Mental health access'` copied from `nmhp.js` — corrected to `'High blood sugar: 11.9%'`

All 11 NCD files now have unique, programme-appropriate `keyMetric` and `summary` values (verified May 2026).

---

## Hard rules (follow exactly)

1. **Git commit author** must always be: `AryanSinghpif <aryan.singh@pahleindia.org>`
   ```
   git commit --author="AryanSinghpif <aryan.singh@pahleindia.org>"
   ```
2. **No emojis** anywhere — not in code, CSS, or commit messages
3. **CSS** — append new rules at the bottom of `ncd.css`, never rewrite the whole file
4. **Subagents** — when spawning agents, do NOT give them access to large files without reading offsets; they will truncate
5. **NCD_compiled sheet** — do not connect until user asks
6. **No feature flags, no backwards-compat shims** — just change the code
7. **Bundle size warning** is expected (~5.6MB due to plotly.js) — it is acceptable, do not try to split unless user asks
8. **Push/deploy** — always `git push origin main` after committing; Vercel auto-deploys

---

## Status colour logic

```js
function kdStatus(kd) {
  if (kd.achievement == null || kd.target == null) return 'neutral';
  const gap = kd.lowerIsBetter ? kd.target - kd.achievement : kd.achievement - kd.target;
  if (gap >= 0)   return 'achieved';   // green
  if (gap >= -10) return 'close';      // amber
  return 'gap';                        // red
}
```
