// RCH / Maternal Health — edit here to update this programme's data and source links
export default {
  id: 'maternal-health',
  name: 'Maternal Health',
  status: 'red',
  keyMetric: '4+ ANC: 36.5%',
  statusReason: 'Only 7/15 FRUs functional · SUMAN notification 29.6%',
  summary:
    'ANC coverage, FRU functionality, and SUMAN notification remain critically below national benchmarks. Maternal death reporting indicates systemic gaps in high-risk identification.',
  keyMetrics: [
    { label: '4+ ANC Visits', value: '36.5%', change: '+9.7 pp', changeDir: 'up', source: 'NFHS-5 (2019-21)' },
    { label: 'Functional FRUs', value: '7 / 15', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'SUMAN Notification', value: '29.6%', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'Institutional Births', value: '79.2%', change: '+26.9 pp', changeDir: 'up', source: 'NFHS-5 (2019-21)' },
  ],
  observations: [
    'Only 7 out of 15 designated FRUs are operational in the state',
    'PMSMA has identified only 5.53% of high-risk pregnancies since inception',
    'SUMAN notification stands at 29.6% — 181 of 620 eligible facilities',
    '3 maternal deaths in FY 2024-25 via HMIS (East Siang: 2, Namsai: 1)',
    'Avg out-of-pocket expenditure per delivery increased from Rs. 6,474 to Rs. 9,731',
    'ANC 1st trimester coverage only 62.2% in HMIS FY 2024-25 despite NFHS-5 showing 53.1%',
  ],
  actions: [
    'Operationalise the 8 non-functional FRUs on a time-bound plan with district accountability',
    'Scale SUMAN notification to all 620 facilities within 2 quarters',
    'Strengthen PMSMA for systematic high-risk pregnancy identification and tracking',
    'Increase iron-folic acid supplementation from 23.8% — roll out through ASHA network',
    'Review out-of-pocket expenditure spikes and map against institutional delivery subsidies',
  ],
  nfhsData: [
    { label: 'ANC check-up in first trimester', nfhs4: 37.0, nfhs5: 53.1, unit: '%', lowerIsBetter: false },
    { label: '4+ antenatal care visits', nfhs4: 26.8, nfhs5: 36.5, unit: '%', lowerIsBetter: false },
    { label: 'Iron folic acid supplementation 100+ days', nfhs4: 8.3, nfhs5: 23.8, unit: '%', lowerIsBetter: false },
    { label: 'MCP card received', nfhs4: 89.2, nfhs5: 95.6, unit: '%', lowerIsBetter: false },
    { label: 'Postnatal care within 2 days of delivery', nfhs4: 28.9, nfhs5: 56.4, unit: '%', lowerIsBetter: false },
    { label: 'Institutional births', nfhs4: 52.3, nfhs5: 79.2, unit: '%', lowerIsBetter: false },
    { label: 'Births in public facility', nfhs4: 42.7, nfhs5: 74.8, unit: '%', lowerIsBetter: false },
    { label: 'Births attended by skilled personnel', nfhs4: 53.8, nfhs5: 82.1, unit: '%', lowerIsBetter: false },
    { label: 'Births by caesarean section', nfhs4: 8.9, nfhs5: 14.8, unit: '%', lowerIsBetter: false },
    { label: 'Neonatal tetanus protection', nfhs4: 64.1, nfhs5: 76.9, unit: '%', lowerIsBetter: false },
  ],
};
