// RCH / Child Health — edit here to update this programme's data and source links
export default {
  id: 'child-health',
  name: 'Child Health',
  status: 'red',
  keyMetric: '17 districts: 0 IMR reported',
  statusReason: '17/28 districts reported zero infant deaths in HMIS',
  summary:
    'Mortality indicators show improvement in NFHS but HMIS data reveals severe under-reporting. 17 of 28 districts reported zero infant deaths. HBNC coverage critically low in multiple districts.',
  keyMetrics: [
    { label: 'Infant Mortality Rate', value: '12.9', change: '−10.1', changeDir: 'down', source: 'NFHS-5' },
    { label: 'Under-5 Mortality Rate', value: '18.8', change: '−14.2', changeDir: 'down', source: 'NFHS-5' },
    { label: 'SNCU Neonatal Deaths', value: '27', change: null, changeDir: null, source: 'NPCC Apr 2026' },
    { label: 'HBNC: Dibang Valley', value: '13%', change: null, changeDir: null, source: 'NPCC Apr 2026' },
  ],
  observations: [
    '17 out of 28 districts reported zero infant deaths in HMIS (Apr–Dec 2025) — clear under-reporting',
    'MPCDSR Portal shows 0 infant deaths vs 52 in HMIS — reporting system is critically broken',
    'SNCU mortality causes: Respiratory Distress Syndrome (18.5%), Birth Asphyxia (14.8%), Any Other (55.6%)',
    'Infant mortality causes: Prematurity (23.1%), Asphyxia (11.5%), Sepsis (5.8%), Other (57.7%)',
    'RBSK/DEIC: overall 52% HR available, 67% equipment available',
    'HBNC coverage: state avg 83%, but Dibang Valley 13%, East Siang 36%, Pakhe Kesang 40%',
    'HBNC community referral for sick newborns: only 11%; 20 of 23 districts show zero identification',
    'DEIC at Papum Pare not yet functional — state advised to expedite',
  ],
  actions: [
    'Fix MPCDSR reporting — mandate facilities to report every infant death within 24 hours',
    'Launch emergency HBNC coverage drive in Dibang Valley, East Siang, Pakhe Kesang, Capital Complex',
    'Expedite DEIC operationalisation at Papum Pare',
    'Fill 48% HR vacancies at DEIC Tezu, Pasighat, Longding via emergency recruitment',
    'Strengthen SNCU cause-of-death classification to reduce "Any Other" category',
  ],
  currentStatus: {
    type: 'child-health',
    source: 'SRS 2023 · FBNC Portal · HMIS 2025-26',
    sdgIndicators: [
      { no: '1', name: 'Infant Mortality Rate (IMR) — SRS 2023', state: '20', national: '25', sdgTarget: '—' },
      { no: '2', name: 'Stillbirth Rate (SBR) — HMIS 2025-26', state: '8.8', national: '9.5', sdgTarget: '—' },
    ],
    totalDistricts: 28,
    sncuNicus: 5,
    deics: 3,
    mortalityRows: [
      {
        label: 'SNCU Mortality (FBNC Portal, Apr–Dec 2025) — 27 Neonatal Deaths',
        highDistricts: 'East Siang (5.6%); Papumpare (4.0%)',
        causes: 'Respiratory Distress Syndrome (18.5%), Birth Asphyxia (14.8%), Meconium Aspiration Syndrome (7.4%), Any Other (55.6%)',
      },
      {
        label: 'Infant Mortality Rate (HMIS, Apr–Dec 2025) — 52 Infant Deaths',
        highDistricts: 'Longding (13.8), West Siang (8.1), Namsai (6.6), Lohit (5.6)',
        causes: 'Prematurity (23.1%), Asphyxia (11.5%), Sepsis (5.8%), Other (57.7%)',
      },
    ],
    rbsk: {
      hrPct: '52%',
      equipPct: '67%',
      bottom30: ['Pashighat 74%', 'Tezu 25%'],
    },
  },
  nfhsData: [
    { label: 'Neonatal Mortality Rate (per 1,000 LB)', nfhs4: null, nfhs5: 7.7, unit: '', lowerIsBetter: true },
    { label: 'Infant Mortality Rate (per 1,000 LB)', nfhs4: 23, nfhs5: 12.9, unit: '', lowerIsBetter: true },
    { label: 'Under-5 Mortality Rate (per 1,000 LB)', nfhs4: 33, nfhs5: 18.8, unit: '', lowerIsBetter: true },
    { label: 'Children breastfed within 1 hr of birth', nfhs4: 58.7, nfhs5: 52.0, unit: '%', lowerIsBetter: false },
    { label: 'Children <6 months exclusively breastfed', nfhs4: 56.5, nfhs5: 63.4, unit: '%', lowerIsBetter: false },
    { label: 'Diarrhoea prevalence (children <5)', nfhs4: 6.5, nfhs5: 5.1, unit: '%', lowerIsBetter: true },
    { label: 'Diarrhoea treated with ORS', nfhs4: 66.1, nfhs5: 62.7, unit: '%', lowerIsBetter: false },
  ],
};
