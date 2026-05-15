// HSS / Drugs & Diagnostics — edit here to update this programme's data and source links
export default {
  id: 'drugs-diagnostics',
  name: 'Drugs & Diagnostics',
  status: 'red',
  keyMetric: 'Drug stock: <25% at all facilities',
  statusReason: 'Drug availability <25% vs 50% DVDMS target; IPHS compliance only 2%',
  summary:
    'Free Drug Service Initiative, NQAS certification, and IPHS compliance show critical gaps. Drug stock availability is below 25% across all facility types against a 50% DVDMS target. Only 26 of 499 facilities are NQAS certified and 2% of facilities are IPHS compliant.',
  keyMetrics: [
    { label: 'Drug Stock (All Facilities)', value: '<25%', change: null, changeDir: null, source: 'FDSI Review 2025-26' },
    { label: 'NQAS Certified', value: '5.21%', change: null, changeDir: null, source: 'NQAS Status Report' },
    { label: 'IPHS Compliant (>80%)', value: '2%', change: null, changeDir: null, source: 'IPHS Dashboard Mar 2026' },
    { label: 'Facilities on DVDMS', value: '5 / 86 RCs', change: null, changeDir: null, source: 'FDSI Review 2025-26' },
  ],
  observations: [
    'Drug stock below 25% at all facility levels — District Hospital 16%, CHC 12%, AAM-PHC 24%, AAM-SHC 22%',
    'Only 5 of 86 Rate Contracts are on DVDMS — supply chain digitisation critically lagging',
    'NQAS: only 26 of 499 facilities certified (5.21%) — AAM SHC leads with 23 certifications',
    'IPHS compliance: 59% of facilities in Aspirant band (<50%), only 2% Compliant (>80%)',
    'Diagnostic test availability improving — PHC: Jan 2025 (8 types) to Jan 2026 (18 types)',
    'LaQshya certified: 7 (4 Labour Rooms, 3 OTs); Kayakalp compliant: 25 facilities FY 2024-25',
  ],
  actions: [
    'Mandate all 86 Rate Contracts to onboard DVDMS — set 6-month deadline',
    'Fast-track NQAS assessments for 23 facilities that scored >70% — convert to certifications',
    'Address drug stock gaps at CHC level (12%) — highest risk to frontline service delivery',
    'Increase IPHS compliance audits and district-level accountability for facility scores',
    'Scale diagnostic test availability at PHC level — 18 types vs FDSI target of 63',
  ],
  nfhsData: [],
};
