// HRH / Pharmacists — edit here to update this cadre's data and source links
export default {
  id: 'pharmacist',
  name: 'Pharmacists',
  status: 'red',
  keyMetric: '228 in place',
  statusReason: '77% availability — below 85% target; zero contractual intake',
  achievement: 77, target: 85, requirement: 297, regular: 228, contractual: 0, inPlace: 228,
  regSanctioned: 240, ctrlApproved: 1,
  summary: 'Pharmacists are below the 85% RoP target (77%). Only 1 contractual post was approved and none filled — the cadre is entirely dependent on regular appointments with 69 vacancies.',
  keyMetrics: [
    { label: 'Required', value: '297', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'In Place', value: '228 (77%)', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Contractual In Place', value: '0 of 1 approved', change: null, changeDir: null, source: 'NPCC 2026-27' },
    { label: 'Shortage vs Requirement', value: '69', change: null, changeDir: null, source: 'NPCC 2026-27' },
  ],
  observations: [
    '77% availability is below the 85% RoP target — immediate attention required',
    'Zero contractual pharmacists in place despite 1 approved post',
    '69 pharmacists short against requirement — drug dispensing at risk across facilities',
  ],
  actions: [
    'Emergency NHM contractual recruitment to fill pharmacist gap',
    'Approve additional contractual posts under NHM PIP 2026-27',
    'Prioritise posting in districts with highest OPD load',
  ],
  nfhsData: [],
};
