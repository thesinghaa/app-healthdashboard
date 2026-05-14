// RCH / Immunization — edit here to update this programme's data and source links
export default {
  id: 'immunization',
  name: 'Immunization',
  status: 'yellow',
  keyMetric: 'Full Immunisation: 64.9%',
  statusReason: 'Full immunisation at 64.9% — well below 90% national target',
  summary:
    'Full immunisation coverage has improved substantially from 38.2% to 64.9%, but remains below the 90% national target. DPT and Hepatitis B coverage needs acceleration.',
  keyMetrics: [
    { label: 'Full Immunisation', value: '64.9%', change: '+26.7 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'BCG Coverage', value: '87.9%', change: '+17 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'DPT/Penta 3 doses', value: '77.7%', change: '+25.4 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'Hepatitis B 3 doses', value: '73.0%', change: '+32.1 pp', changeDir: 'up', source: 'NFHS-5' },
  ],
  observations: [
    'Full immunisation rate improved significantly — from 38.2% to 64.9%',
    'BCG at 87.9% and Measles at 80.7% are approaching targets',
    'DPT/Penta at 77.7% and Hepatitis B at 73.0% still below the 90% benchmark',
    'Vitamin A supplementation (9-59 months) improved from 39.4% to 69.7%',
    'Private facility immunisation remains at 0.7% — near-universal public delivery',
  ],
  actions: [
    'Intensify vaccination outreach in districts with coverage below state average',
    'Accelerate DPT and Hepatitis B second and third dose follow-up through ASHA tracking',
    'Strengthen cold chain infrastructure in border and remote districts',
    'Scale up Vitamin A supplementation from 69.7% towards 90% target',
  ],
  nfhsData: [
    { label: 'Children 12-23m fully vaccinated', nfhs4: 38.2, nfhs5: 64.9, unit: '%', lowerIsBetter: false },
    { label: 'BCG vaccine received', nfhs4: 70.9, nfhs5: 87.9, unit: '%', lowerIsBetter: false },
    { label: '3 doses of polio vaccine', nfhs4: 53.7, nfhs5: 69.0, unit: '%', lowerIsBetter: false },
    { label: '3 doses of DPT/Penta vaccine', nfhs4: 52.3, nfhs5: 77.7, unit: '%', lowerIsBetter: false },
    { label: 'Measles-containing vaccine (MCV1)', nfhs4: 54.6, nfhs5: 80.7, unit: '%', lowerIsBetter: false },
    { label: 'Hepatitis B vaccine (3 doses)', nfhs4: 40.9, nfhs5: 73.0, unit: '%', lowerIsBetter: false },
    { label: 'Vitamin A dose (9-59 months)', nfhs4: 39.4, nfhs5: 69.7, unit: '%', lowerIsBetter: false },
  ],
};
