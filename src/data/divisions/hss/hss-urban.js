// HSS / HSS — Urban — edit here to update this programme's data and source links
export default {
  id: 'hss-urban',
  name: 'HSS — Urban',
  status: 'yellow',
  keyMetric: 'Urban Pop: ~34%',
  statusReason: 'Health insurance 33.6%; OOP Rs. 10,178 per delivery in urban areas',
  summary:
    'Urban health infrastructure in Itanagar, Naharlagun and growing towns needs expansion. Urban primary health centres and UPHCs require operational strengthening.',
  keyMetrics: [
    { label: 'Urban Institutional Births', value: '90.6%', change: null, changeDir: null, source: 'NFHS-5' },
    { label: 'Urban Full Immunisation', value: '66.8%', change: null, changeDir: null, source: 'NFHS-5' },
    { label: 'Urban Health Insurance', value: '33.6%', change: null, changeDir: null, source: 'NFHS-5' },
    { label: 'XV-FC Urban Approved', value: 'Active', change: null, changeDir: null, source: 'NPCC Apr 2026' },
  ],
  observations: [
    'Urban institutional births at 90.6% — significantly above rural 77.3%',
    'Urban health insurance coverage at 33.6% — much lower than rural 28.5%',
    'Out-of-pocket expenditure per delivery in urban: Rs. 10,178 vs rural Rs. 9,649',
    'Urban sanitation improved to 79.9% but still below 90% target',
  ],
  actions: [
    'Operationalise U-AAM (Urban Ayushman Arogya Mandir) at all UPHCs',
    'Strengthen UHND sessions in underserved urban slum pockets',
    'Increase health insurance enrolment drives targeting urban informal workers',
  ],
  nfhsData: [
    { label: 'Urban institutional births', nfhs4: 81.5, nfhs5: 90.6, unit: '%', lowerIsBetter: false },
    { label: 'Urban households with improved sanitation', nfhs4: 73.3, nfhs5: 79.9, unit: '%', lowerIsBetter: false },
    { label: 'Urban households with clean cooking fuel', nfhs4: 87.4, nfhs5: 90.2, unit: '%', lowerIsBetter: false },
  ],
};
