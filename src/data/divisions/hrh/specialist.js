// HRH / Clinical Specialists — edit here to update this cadre's data and source links
export default {
  id: 'specialist',
  name: 'Clinical Specialists',
  status: 'yellow',
  keyMetric: '162 in place',
  statusReason: '61% availability — above 50% target; Ob/Gyn surgery at 2 vs 7/week',
  achievement: 61, target: 50, requirement: 266, regular: 144, contractual: 18, inPlace: 162,
  regSanctioned: 251, ctrlApproved: 32,
  summary: 'Clinical Specialists are the scarcest cadre with 162 in place (61%), above the 50% RoP target. Ob/Gyn surgical productivity is only 2 procedures per week versus the IPHS standard of 7.',
  keyMetrics: [
    { label: 'Required', value: '266', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Total In Place', value: '162 (61%)', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Ob/Gyn Surgery/Week', value: '2 vs 7 (IPHS)', change: null, changeDir: null, source: 'HRH Productivity' },
    { label: 'Contractual Specialists', value: '18 of 32 approved', change: null, changeDir: null, source: 'NPCC 2026-27' },
  ],
  observations: [
    '162 of 266 required specialists in place (61%) — above 50% RoP target',
    'Ob/Gyn surgical productivity: 2 procedures/week vs IPHS standard 7',
    'Only 18 contractual specialists — cadre relies heavily on regular posts',
    '104 specialist shortage against requirement — FRU operationalisation at risk',
  ],
  actions: [
    'Expand contractual specialist posts under NHM — current 32 far below need',
    'Deploy tele-specialist programme for CHC-level specialist access',
    'Priority recruitment: Ob/Gyn, Paediatrician, Physician for FRU-linked posts',
  ],
  nfhsData: [],
};
