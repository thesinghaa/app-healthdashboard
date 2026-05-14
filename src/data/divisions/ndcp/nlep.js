// NDCP / NLEP — edit here to update this programme's data and source links
export default {
  id: 'nlep',
  name: 'NLEP',
  status: 'yellow',
  keyMetric: 'Elimination sustained',
  statusReason: 'State-level elimination achieved — pocket areas need vigilance',
  summary:
    'Leprosy has been eliminated at state level but district-level micro-endemic pockets persist. Sustained surveillance and MDT delivery is required.',
  keyMetrics: [
    { label: 'State Elimination Status', value: 'Achieved', change: null, changeDir: null, source: 'NLEP 2023' },
    { label: 'New Case Detection', value: 'HMIS tracked', change: null, changeDir: null, source: 'HMIS 2025' },
    { label: 'MDT Completion Rate', value: 'Monitored', change: null, changeDir: null, source: 'NLEP portal' },
    { label: 'Grade II Disability', value: 'Under target', change: null, changeDir: null, source: 'NLEP benchmark' },
  ],
  observations: [
    'Elimination at state level achieved but vigilance required in pocket-endemic blocks',
    'Grade II disability prevention requires early case detection and MDT',
    'Stigma reduction remains a challenge in tribal communities',
  ],
  actions: [
    'Maintain ASHA-led active case detection drives in endemic pocket areas',
    'Ensure uninterrupted MDT supply at all PHC/SC level',
    'Continue disability prevention services and rehabilitation support',
  ],
  nfhsData: [],
};
