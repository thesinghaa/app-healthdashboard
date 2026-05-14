// RCH / Nutrition — edit here to update this programme's data and source links
export default {
  id: 'nutrition',
  name: 'Nutrition',
  status: 'red',
  keyMetric: 'Child anaemia: 56.6% (↑)',
  statusReason: 'Child anaemia WORSENED from 50.7% to 56.6% — regression',
  summary:
    'Nutrition is the most concerning RCH area. Child anaemia has worsened from 50.7% to 56.6%. Stunting remains near unchanged. Adult anaemia shows negligible improvement. Immediate programme intervention is required.',
  keyMetrics: [
    { label: 'Child Anaemia (6-59m)', value: '56.6%', change: '+5.9 pp', changeDir: 'up', source: 'NFHS-5' },
    { label: 'Child Stunting (<5)', value: '28.0%', change: '−1.4 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Child Wasting (<5)', value: '13.1%', change: '−4.2 pp', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Child Underweight (<5)', value: '15.4%', change: '−4.1 pp', changeDir: 'down', source: 'NFHS-5' },
  ],
  observations: [
    'Child anaemia (6-59 months) WORSENED from 50.7% to 56.6% — a critical regression',
    'Men anaemia (15-49) also worsened from 16.9% to 21.4%',
    'Non-pregnant women anaemia virtually unchanged at 41.6% vs 40.6%',
    'Stunting reduced minimally (29.4% to 28.0%) — far from SDG targets',
    'Women overweight/obese increased from 18.8% to 23.9% — dual burden emerging',
    'Exclusive breastfeeding under 6 months improved from 56.5% to 63.4%',
    'Solid food introduction at 6-8 months declined from 53.6% to 48.4%',
  ],
  actions: [
    'Treat child anaemia as a state health emergency — launch intensive iron supplementation campaign',
    'Review and reinvigorate POSHAN Abhiyan implementation at AWC level',
    'Target stunting hotspot districts with integrated nutrition + WASH interventions',
    'Address complementary feeding gap — 48.4% receiving solid food at 6-8 months',
    'Roll out adolescent anaemia interventions (Weekly Iron Folic Acid) at all schools',
  ],
  nfhsData: [
    { label: 'Children 6-59 months anaemic', nfhs4: 50.7, nfhs5: 56.6, unit: '%', lowerIsBetter: true },
    { label: 'Non-pregnant women (15-49) anaemic', nfhs4: 40.6, nfhs5: 41.6, unit: '%', lowerIsBetter: true },
    { label: 'Pregnant women (15-49) anaemic', nfhs4: 33.8, nfhs5: 27.9, unit: '%', lowerIsBetter: true },
    { label: 'Men (15-49) anaemic', nfhs4: 16.9, nfhs5: 21.4, unit: '%', lowerIsBetter: true },
    { label: 'Children under 5 stunted', nfhs4: 29.4, nfhs5: 28.0, unit: '%', lowerIsBetter: true },
    { label: 'Children under 5 wasted', nfhs4: 17.3, nfhs5: 13.1, unit: '%', lowerIsBetter: true },
    { label: 'Children under 5 severely wasted', nfhs4: 8.0, nfhs5: 6.5, unit: '%', lowerIsBetter: true },
    { label: 'Children under 5 underweight', nfhs4: 19.5, nfhs5: 15.4, unit: '%', lowerIsBetter: true },
    { label: 'Women with low BMI (<18.5)', nfhs4: 8.5, nfhs5: 5.7, unit: '%', lowerIsBetter: true },
    { label: 'Women overweight or obese (BMI ≥25)', nfhs4: 18.8, nfhs5: 23.9, unit: '%', lowerIsBetter: true },
  ],
};
