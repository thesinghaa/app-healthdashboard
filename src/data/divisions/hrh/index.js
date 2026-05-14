import mpw from './mpw.js';
import staffNurse from './staff-nurse.js';
import cho from './cho.js';
import labTech from './lab-tech.js';
import pharmacist from './pharmacist.js';
import medicalOfficer from './medical-officer.js';
import specialist from './specialist.js';

export default {
  id: 'hrh',
  label: 'HRH',
  fullName: 'Human Resources for Health',
  programs: [mpw, staffNurse, cho, labTech, pharmacist, medicalOfficer, specialist],
};
