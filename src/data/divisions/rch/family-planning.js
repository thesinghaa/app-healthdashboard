// RCH / Family Planning — edit here to update this programme's data and source links
export default {
  id: 'family-planning',
  name: 'Family Planning',
  status: 'green',
  keyMetric: 'Contraceptive Use: 59.1%',
  statusReason: 'Contraceptive use nearly doubled: 31.7% → 59.1%',
  summary:
    'Family planning indicators show the strongest improvement across all RCH programmes. Contraceptive use nearly doubled and unmet need was halved — a significant policy success.',
  keyMetrics: [
    { label: 'Contraceptive Prevalence', value: '59.1%', change: '+27.4 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'Modern Methods', value: '47.2%', change: '+20.6 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'Unmet Need (Total)', value: '12.5%', change: '−9.0 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Total Fertility Rate', value: '1.8', change: '−0.3', changeDir: 'down', source: 'NFHS-5' },
  ],
  observations: [
    'Contraceptive use rose from 31.7% to 59.1% — near doubling over one survey period',
    'Modern method use increased from 26.6% to 47.2%',
    'Unmet need reduced from 21.5% to 12.5% — significant service delivery improvement',
    'TFR declined below replacement level to 1.8 (from 2.1)',
    'IUD/PPIUD use doubled from 3.4% to 6.2%; pill use grew from 10.2% to 15.5%',
    'Female sterilisation increased from 11.2% to 18.2% — a strong indicator of access',
  ],
  actions: [
    'Sustain current momentum; ensure supply chain continuity for contraceptives at PHC level',
    'Expand PPIUCD services at all delivery points',
    'Reduce residual 12.5% unmet need through targeted IEC in underserved blocks',
  ],
  nfhsData: [
    { label: 'Any contraceptive method', nfhs4: 31.7, nfhs5: 59.1, unit: '%', lowerIsBetter: false },
    { label: 'Any modern method', nfhs4: 26.6, nfhs5: 47.2, unit: '%', lowerIsBetter: false },
    { label: 'Female sterilisation', nfhs4: 11.2, nfhs5: 18.2, unit: '%', lowerIsBetter: false },
    { label: 'IUD / PPIUD', nfhs4: 3.4, nfhs5: 6.2, unit: '%', lowerIsBetter: false },
    { label: 'Oral pill', nfhs4: 10.2, nfhs5: 15.5, unit: '%', lowerIsBetter: false },
    { label: 'Condom', nfhs4: 1.4, nfhs5: 4.7, unit: '%', lowerIsBetter: false },
    { label: 'Total unmet need for family planning', nfhs4: 21.5, nfhs5: 12.5, unit: '%', lowerIsBetter: true },
    { label: 'Total Fertility Rate', nfhs4: 2.1, nfhs5: 1.8, unit: '', lowerIsBetter: true },
  ],
};
