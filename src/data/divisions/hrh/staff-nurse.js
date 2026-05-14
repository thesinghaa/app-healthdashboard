// HRH / Staff Nurse — edit here to update this cadre's data and source links
export default {
  id: 'staff-nurse',
  name: 'Staff Nurse',
  status: 'green',
  keyMetric: '1392 in place',
  statusReason: '73% availability — meets 55% RoP target',
  achievement: 73, target: 55, requirement: 1910, regular: 766, contractual: 626, inPlace: 1392,
  regSanctioned: 908, ctrlApproved: 1150,
  summary: 'Staff Nurses are critical for hospital-based maternal and child health services. 1392 in place (73%) exceeds the 55% RoP target with a large contractual component of 626.',
  keyMetrics: [
    { label: 'Required', value: '1910', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Total In Place', value: '1392 (73%)', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Regular In Place', value: '766', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Contractual In Place', value: '626', change: null, changeDir: null, source: 'NPCC 2026-27' },
  ],
  observations: [
    '1392 of 1910 required nurses in place (73%) — exceeds 55% RoP target',
    'Regular sanctioned 908, in place 766 — 84% fill rate',
    'Contractual: 1150 approved, 626 in place (54% fill rate)',
    'Shortfall of 518 against requirement — critical for FRU and CHC operations',
  ],
  actions: [
    'Fill 524 vacant contractual nurse posts — link to FRU operationalisation',
    'Ensure nursing coverage at all functional FRUs — tied to SUMAN notification',
    'Address skill gaps in SNCU and labour room staffing',
  ],
  nfhsData: [],
};
