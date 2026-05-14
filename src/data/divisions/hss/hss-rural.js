// HSS / HSS — Rural — edit here to update this programme's data and source links
export default {
  id: 'hss-rural',
  name: 'HSS — Rural',
  status: 'red',
  keyMetric: 'IPHL completion: 23%',
  statusReason: 'PM-ABHIM: IPHL 23% complete · XV-FC zero expenditure in 2023-24',
  summary:
    'Rural health systems strengthening is critically lagging. PM-ABHIM infrastructure completion stands at 23% (IPHL) with zero CCB work started. XV-FC expenditure was 0% in 2023-24 and release is negligible in 2024-25 and 2025-26.',
  keyMetrics: [
    { label: 'IPHL Completed', value: '5 / 22 (23%)', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'CCB Started', value: '0 / 1', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'XV-FC Expenditure 2023-24', value: '0%', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'Rural Sanitation', value: '83.4%', change: '+21.8 pp', changeDir: 'up', source: 'NFHS-5' },
  ],
  observations: [
    'PM-ABHIM: Only 5 of 22 IPHLs completed and functional (23%)',
    'Critical Care Block (CCB): 0 of 1 approved have started construction',
    'XV-FC FY 2023-24: Rs. 49.71 Cr released but 0% expenditure reported',
    'XV-FC FY 2024-25: Only Rs. 14.79 Cr released of Rs. 53.78 Cr approved',
    'XV-FC FY 2025-26: Only Rs. 15.05 Cr released of Rs. 56.46 Cr approved',
    'Rural households with improved sanitation improved to 83.4% (from 57.1%)',
    'Rural health insurance coverage at 28.5% — significant gap',
  ],
  actions: [
    'Issue time-bound orders to complete all 22 IPHL constructions — district MO accountability',
    'Commence CCB construction immediately — contractor appointment and site clearance',
    'Investigate 0% expenditure on XV-FC FY 2023-24 release — audit required',
    'Fast-track expenditure utilisation on 2024-25 and 2025-26 releases before fiscal close',
    'Strengthen AAM (Ayushman Arogya Mandir) operational readiness at SHC/PHC level',
  ],
  nfhsData: [
    { label: 'Rural households with improved sanitation', nfhs4: 57.1, nfhs5: 83.4, unit: '%', lowerIsBetter: false },
    { label: 'Rural households with electricity', nfhs4: 85.0, nfhs5: 94.0, unit: '%', lowerIsBetter: false },
    { label: 'Rural households with clean cooking fuel', nfhs4: 30.0, nfhs5: 46.3, unit: '%', lowerIsBetter: false },
    { label: 'Rural households with improved water', nfhs4: 85.0, nfhs5: 92.9, unit: '%', lowerIsBetter: false },
    { label: 'Rural institutional births', nfhs4: 44.2, nfhs5: 77.3, unit: '%', lowerIsBetter: false },
  ],
};
