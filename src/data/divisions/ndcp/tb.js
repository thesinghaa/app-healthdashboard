// NDCP / TB Mukt Bharat Abhiyan — edit here to update this programme's data and source links
export default {
  id: 'tb',
  name: 'TB Mukt Bharat Abhiyan',
  status: 'yellow',
  keyMetric: 'Elimination target: 2025',
  statusReason: 'Tribal remote access limits DOTS and case-finding coverage',
  summary:
    'TB elimination target by 2025 is at risk. Notification rates, treatment success and community-level case finding in tribal and remote areas need acceleration.',
  keyMetrics: [
    { label: 'State Notification Rate', value: 'HMIS tracked', change: null, changeDir: null, source: 'NIKSHAY 2025' },
    { label: 'Treatment Success Target', value: '>90%', change: null, changeDir: null, source: 'National target' },
    { label: 'Ni-kshay Poshan Yojana', value: 'Active', change: null, changeDir: null, source: 'State NHM' },
    { label: 'Population Undernourished', value: '15.4%', change: '−4.1 pp', changeDir: 'down', source: 'NFHS-5' },
  ],
  observations: [
    'Tribal population in remote blocks has limited access to DOTS centres',
    'High alcohol use (men 59%) is a TB risk factor requiring co-management',
    'Ni-kshay Poshan Yojana beneficiary targeting needs verification',
    'Child undernutrition (stunting 28%, wasting 13.1%) is a TB risk amplifier',
  ],
  actions: [
    'Expand mobile DOTS services to remote and tribal blocks',
    'Integrate TB screening with nutrition interventions in high-stunting areas',
    'Ensure Ni-kshay Poshan Yojana payments are disbursed without delay',
    'Strengthen community-based TB case finding through ASHA network',
  ],
  nfhsData: [],
};
