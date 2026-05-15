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
  currentStatus: {
    type: 'tb',
    source: 'MoHFW NPCC May 2026 · NIKSHAY',
    incidence: '191',
    mortality: '18',
    notifVsEst: { above90: 3, mid: 5, below50: 7 },
    deathRate: { above5: 4, mid: 7, below3: 4 },
    factors: {
      notification: 'Undernutrition (35%), High tribal population (69%), Migrant population (construction workers)',
      deathRate: 'Undernutrition (51%)',
    },
    abhiyanPeriod: '07.12.2024 – 14.02.2026',
    abhiyanMetrics: [
      { label: 'Vulnerable population screened', value: '16%', detail: '37,277 / 2.40 lakhs' },
      { label: 'X-ray examination rate', value: '19%', detail: '7,050 / 37,277' },
      { label: 'NAAT % of all tests', value: '95%', detail: '16,487 / 17,428' },
      { label: 'Ni-kshay Poshan Yojana (all benefits paid)', value: '10%', detail: '337 / 3,225 — IFMIS integration in process' },
      { label: 'Ni-kshay Mitra (food basket given)', value: '29%', detail: '868 / 3,013' },
      { label: 'Differentiated TB Care assessed', value: '30%', detail: '1,007 / 3,377' },
      { label: 'TPT initiated', value: '23%', detail: '302 / 1,332' },
    ],
    infrastructure: [
      { label: 'NAAT machines', value: '39', detail: '13 CBNAAT & 26 Truenat — 15% utilization in 1 shift' },
      { label: 'Handheld X-ray', value: '61', detail: '15 available + 46 in pipeline' },
    ],
    nikshayYojana: [
      { year: '2024', eligible: 3169, paidAll: 1508, toBePaid: 1661 },
      { year: '2025', eligible: 2779, paidAll: 13, toBePaid: 2766 },
    ],
  },
  nfhsData: [],
};
