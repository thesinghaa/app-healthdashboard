// HRH / Medical Officers — edit here to update this cadre's data and source links
export default {
  id: 'medical-officer',
  name: 'Medical Officers',
  status: 'red',
  keyMetric: '520 in place',
  statusReason: '82% availability — below 85% target; OPD at 7 vs 60 IPHS standard',
  achievement: 82, target: 85, requirement: 638, regular: 467, contractual: 53, inPlace: 520,
  regSanctioned: 557, ctrlApproved: 56,
  summary: 'Medical Officers (MBBS) are below the 85% RoP target (82%). OPD productivity averages only 7 patients/doctor/day versus the IPHS standard of 60, indicating significant absenteeism or maldistribution.',
  keyMetrics: [
    { label: 'Required', value: '638', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Total In Place', value: '520 (82%)', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'OPD Productivity', value: '7 vs 60 pts/day', change: null, changeDir: null, source: 'HRH Productivity' },
    { label: 'Contractual In Place', value: '53 of 56 approved', change: null, changeDir: null, source: 'NPCC 2026-27' },
  ],
  observations: [
    '520 of 638 required MOs in place (82%) — below 85% RoP target',
    'State-wide OPD: only 7 patients/doctor/day vs IPHS standard 60',
    'Low OPD productivity suggests significant absenteeism or maldistribution',
    '118 MO vacancy against requirement — impacts all programme delivery',
  ],
  actions: [
    'Conduct state-wide MO attendance audit and absenteeism action plan',
    'Increase contractual MO posts under NHM to bridge 118-post gap',
    'Enforce posting rotation — prevent urban concentration of MOs',
  ],
  nfhsData: [],
};
