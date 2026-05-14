import maternalHealth from './maternal-health.js';
import jsy from './jsy.js';
import cac from './cac.js';
import pcpndt from './pcpndt.js';
import childHealth from './child-health.js';
import immunization from './immunization.js';
import adolescentHealth from './adolescent-health.js';
import familyPlanning from './family-planning.js';
import nutrition from './nutrition.js';

export default {
  id: 'rch',
  label: 'RCH',
  fullName: 'Reproductive & Child Health',
  programs: [maternalHealth, jsy, cac, pcpndt, childHealth, immunization, adolescentHealth, familyPlanning, nutrition],
};
