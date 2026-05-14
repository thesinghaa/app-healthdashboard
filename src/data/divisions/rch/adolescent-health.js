// RCH / Adolescent Health — edit here to update this programme's data and source links
export default {
  id: 'adolescent-health',
  name: 'Adolescent Health',
  status: 'yellow',
  keyMetric: 'Child marriage: 18.9%',
  statusReason: 'Child marriage 18.9%; adolescent fertility rate 38 per 1,000',
  summary:
    'Adolescent health indicators show positive trends — child marriage, early motherhood and fertility have all declined. Menstrual hygiene management has improved but requires further scaling.',
  keyMetrics: [
    { label: 'Child Marriage (W 20-24)', value: '18.9%', change: '−4.6 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Adolescent Mothers (15-19)', value: '6.0%', change: '−4.5 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Adolescent Fertility Rate', value: '38', change: '−18', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Hygienic Menstrual Protection', value: '73.3%', change: null, changeDir: null, source: 'NFHS-5' },
  ],
  observations: [
    'Child marriage (women 20-24 married before 18) declined from 23.5% to 18.9%',
    'Proportion of women 15-19 already mothers dropped from 10.5% to 6.0%',
    'Adolescent fertility rate declined from 56 to 38 per 1,000 women aged 15-19',
    'Internet access among women increased to 52.9% — enabling digital health literacy',
    'Menstrual hygiene protection stands at 73.3% — still below parity with national aspirations',
  ],
  actions: [
    'Expand RKSK programmes to all high-prevalence child marriage districts',
    'Strengthen school-based menstrual hygiene interventions for adolescent girls',
    'Leverage internet penetration (52.9%) for digital health literacy programmes',
    'Address early fertility through peer-led adolescent health clubs at school level',
  ],
  nfhsData: [
    { label: 'Women 20-24 married before age 18', nfhs4: 23.5, nfhs5: 18.9, unit: '%', lowerIsBetter: true },
    { label: 'Men 25-29 married before age 21', nfhs4: 22.6, nfhs5: 20.8, unit: '%', lowerIsBetter: true },
    { label: 'Women 15-19 already mothers or pregnant', nfhs4: 10.5, nfhs5: 6.0, unit: '%', lowerIsBetter: true },
    { label: 'Women who have used internet', nfhs4: null, nfhs5: 52.9, unit: '%', lowerIsBetter: false },
    { label: 'Women using hygienic menstrual methods', nfhs4: null, nfhs5: 73.3, unit: '%', lowerIsBetter: false },
  ],
};
