// HRH / Lab Technicians — edit here to update this cadre's data and source links
export default {
  id: 'lab-tech',
  name: 'Lab Technicians',
  status: 'yellow',
  keyMetric: '354 in place',
  statusReason: '67% availability — meets 55% target but PHC productivity critically low',
  achievement: 67, target: 55, requirement: 530, regular: 109, contractual: 245, inPlace: 354,
  regSanctioned: 320, ctrlApproved: 245,
  summary: 'Lab Technicians show 67% availability (354 of 530) exceeding the 55% RoP target. However lab productivity at PHC level is only 3 tests/LT/day vs the IPHS standard of 100.',
  keyMetrics: [
    { label: 'Required', value: '530', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Total In Place', value: '354 (67%)', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'PHC Lab Tests/LT/Day', value: '3 vs 100 (IPHS)', change: null, changeDir: null, source: 'HRH Productivity' },
    { label: 'DH Lab Tests/LT/Day', value: '17 vs 100 (IPHS)', change: null, changeDir: null, source: 'HRH Productivity' },
  ],
  observations: [
    '354 of 530 required LTs in place (67%) — exceeds 55% RoP target',
    'Regular in place: only 109 of 320 sanctioned posts (34% fill rate)',
    'PHC productivity: 3 tests/LT/day vs IPHS standard 100 — near non-functional',
    '176 LT shortage affects TB, malaria, and NCD diagnostic capacity',
  ],
  actions: [
    'Investigate PHC lab productivity (3 tests/day) — equipment or deployment issues',
    'Fill 211 regular LT vacancies of 320 sanctioned posts',
    'Link LT deployment to TB GeneXpert and NVBDCP diagnostic needs',
  ],
  nfhsData: [],
};
