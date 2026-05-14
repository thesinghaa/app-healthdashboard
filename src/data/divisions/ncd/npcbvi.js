// NCD / NPCBVI — edit here to update this programme's data and source links
export default {
  id: 'npcbvi',
  name: 'NPCBVI',
  status: 'green',
  keyMetric: 'Iodised salt: 99.2%',
  statusReason: 'Iodised salt 99.2% — IDD-related visual complications controlled',
  summary:
    'National Programme for Control of Blindness and Visual Impairment is supported by strong iodised salt coverage (99.2%) which prevents iodine deficiency-related visual complications.',
  keyMetrics: [
    { label: 'Iodised Salt Coverage', value: '99.2%', change: '−0.1 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Cataract Surgery Rate', value: 'HMIS tracked', change: null, changeDir: null, source: 'HMIS' },
    { label: 'School Eye Screening', value: 'RBSK active', change: null, changeDir: null, source: 'NHM' },
    { label: 'Eye Banks', value: 'District level', change: null, changeDir: null, source: 'State NHM' },
  ],
  observations: [
    'Iodised salt coverage at 99.2% — near universal, strong micronutrient foundation',
    'Cataract surgery backlog in remote districts requires periodic outreach camps',
    'RBSK school eye screening covering children through DEIC network',
    'Diabetic retinopathy will emerge as growing concern given rising diabetes prevalence',
  ],
  actions: [
    'Sustain iodised salt quality monitoring at retail level',
    'Increase cataract surgery outreach camps in border and remote districts',
    'Proactively screen for diabetic retinopathy at all NCD clinics',
  ],
  nfhsData: [
    { label: 'Households using iodised salt', nfhs4: 99.3, nfhs5: 99.2, unit: '%', lowerIsBetter: false },
  ],
};
