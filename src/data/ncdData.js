// NCD Registry Data — ICR Monthly (NP-NCD Screening, Itanagar District)
// Period: April 2025 – February 2026
// Source: ICR Registry, Itanagar

export const ICR_MONTHLY = [
  { month: 'Apr',  enrolled: 1716, cbac: 1184, screened1st: 1194, fullyScreened: 594,  partialScreened: 600, referredScreen: 217, referredCervical: 228, referredSecondary: 68,  examined: 8,   diagnosed: 6,   underTreatment: 6,   followUp: 12  },
  { month: 'May',  enrolled: 1174, cbac: 698,  screened1st: 701,  fullyScreened: 284,  partialScreened: 417, referredScreen: 142, referredCervical: 86,  referredSecondary: 23,  examined: 24,  diagnosed: 21,  underTreatment: 21,  followUp: 12  },
  { month: 'Jun',  enrolled: 378,  cbac: 293,  screened1st: 259,  fullyScreened: 114,  partialScreened: 145, referredScreen: 85,  referredCervical: 32,  referredSecondary: 30,  examined: 60,  diagnosed: 48,  underTreatment: 48,  followUp: 13  },
  { month: 'Jul',  enrolled: 1228, cbac: 976,  screened1st: 1106, fullyScreened: 531,  partialScreened: 575, referredScreen: 125, referredCervical: 252, referredSecondary: 57,  examined: 59,  diagnosed: 43,  underTreatment: 43,  followUp: 29  },
  { month: 'Aug',  enrolled: 985,  cbac: 779,  screened1st: 677,  fullyScreened: 342,  partialScreened: 335, referredScreen: 158, referredCervical: 50,  referredSecondary: 64,  examined: 226, diagnosed: 110, underTreatment: 110, followUp: 48  },
  { month: 'Sep',  enrolled: 1243, cbac: 1018, screened1st: 977,  fullyScreened: 467,  partialScreened: 510, referredScreen: 265, referredCervical: 233, referredSecondary: 146, examined: 265, diagnosed: 158, underTreatment: 158, followUp: 97  },
  { month: 'Oct',  enrolled: 520,  cbac: 670,  screened1st: 489,  fullyScreened: 217,  partialScreened: 272, referredScreen: 181, referredCervical: 65,  referredSecondary: 62,  examined: 175, diagnosed: 130, underTreatment: 130, followUp: 118 },
  { month: 'Nov',  enrolled: 350,  cbac: 332,  screened1st: 312,  fullyScreened: 185,  partialScreened: 127, referredScreen: 126, referredCervical: 24,  referredSecondary: 45,  examined: 176, diagnosed: 110, underTreatment: 110, followUp: 136 },
  { month: 'Dec',  enrolled: 212,  cbac: 189,  screened1st: 179,  fullyScreened: 70,   partialScreened: 109, referredScreen: 88,  referredCervical: 49,  referredSecondary: 29,  examined: 91,  diagnosed: 68,  underTreatment: 68,  followUp: 110 },
  { month: 'Jan',  enrolled: 237,  cbac: 244,  screened1st: 215,  fullyScreened: 126,  partialScreened: 89,  referredScreen: 125, referredCervical: 13,  referredSecondary: 34,  examined: 139, diagnosed: 96,  underTreatment: 96,  followUp: 126 },
  { month: 'Feb',  enrolled: 337,  cbac: 340,  screened1st: 312,  fullyScreened: 158,  partialScreened: 154, referredScreen: 183, referredCervical: 34,  referredSecondary: 34,  examined: 212, diagnosed: 145, underTreatment: 145, followUp: 158 },
];

export const ICR_CUMULATIVE = {
  targetPopulation:     55235,
  totalEnrolled:        8380,
  totalCBAC:            6723,
  totalScreened:        7421,
  totalFullyScreened:   3688,
  totalPartialScreened: 3733,
  totalReferred:        1695,
  totalExamined:        1435,
  totalDiagnosed:       935,
  totalUnderTreatment:  935,
  referredCervical:     966,
  referredSecondary:    592,
  coveragePct:          15.2,
};

// NCD-Adjacent Pregnancy Data — State Totals (25 districts, monthly)
// Period: April 2024 – January 2026
// Source: 7_heads dataset
export const PREGNANCY_NCD = [
  { period: 'Apr-24',  htnCases: 130, gdmPos: 6,  anaemiaMod: 619, anaemiaSev: 17 },
  { period: 'May-24',  htnCases: 110, gdmPos: 0,  anaemiaMod: 616, anaemiaSev: 73 },
  { period: 'Jun-24',  htnCases: 41,  gdmPos: 1,  anaemiaMod: 558, anaemiaSev: 7  },
  { period: 'Jul-24',  htnCases: 50,  gdmPos: 0,  anaemiaMod: 602, anaemiaSev: 12 },
  { period: 'Aug-24',  htnCases: 42,  gdmPos: 4,  anaemiaMod: 666, anaemiaSev: 13 },
  { period: 'Sep-24',  htnCases: 35,  gdmPos: 1,  anaemiaMod: 583, anaemiaSev: 6  },
  { period: 'Oct-24',  htnCases: 42,  gdmPos: 0,  anaemiaMod: 598, anaemiaSev: 9  },
  { period: 'Nov-24',  htnCases: 38,  gdmPos: 2,  anaemiaMod: 521, anaemiaSev: 8  },
  { period: 'Dec-24',  htnCases: 29,  gdmPos: 0,  anaemiaMod: 487, anaemiaSev: 5  },
  { period: 'Jan-25',  htnCases: 31,  gdmPos: 1,  anaemiaMod: 501, anaemiaSev: 6  },
  { period: 'Feb-25',  htnCases: 28,  gdmPos: 0,  anaemiaMod: 478, anaemiaSev: 4  },
  { period: 'Mar-25',  htnCases: 33,  gdmPos: 2,  anaemiaMod: 512, anaemiaSev: 7  },
  { period: 'Apr-25',  htnCases: 36,  gdmPos: 1,  anaemiaMod: 534, anaemiaSev: 9  },
  { period: 'May-25',  htnCases: 30,  gdmPos: 0,  anaemiaMod: 498, anaemiaSev: 6  },
  { period: 'Jun-25',  htnCases: 27,  gdmPos: 1,  anaemiaMod: 461, anaemiaSev: 5  },
  { period: 'Jul-25',  htnCases: 29,  gdmPos: 0,  anaemiaMod: 489, anaemiaSev: 8  },
  { period: 'Aug-25',  htnCases: 31,  gdmPos: 2,  anaemiaMod: 502, anaemiaSev: 7  },
  { period: 'Sep-25',  htnCases: 25,  gdmPos: 0,  anaemiaMod: 471, anaemiaSev: 4  },
  { period: 'Oct-25',  htnCases: 28,  gdmPos: 1,  anaemiaMod: 488, anaemiaSev: 6  },
  { period: 'Nov-25',  htnCases: 22,  gdmPos: 0,  anaemiaMod: 452, anaemiaSev: 3  },
  { period: 'Dec-25',  htnCases: 19,  gdmPos: 1,  anaemiaMod: 441, anaemiaSev: 5  },
  { period: 'Jan-26',  htnCases: 24,  gdmPos: 0,  anaemiaMod: 467, anaemiaSev: 4  },
];
