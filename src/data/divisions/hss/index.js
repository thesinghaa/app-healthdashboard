import hssUrban from './hss-urban.js';
import hssRural from './hss-rural.js';
import drugsDiagnostics from './drugs-diagnostics.js';

export default {
  id: 'hss',
  label: 'HSS',
  fullName: 'Health Systems Strengthening',
  programs: [hssUrban, hssRural, drugsDiagnostics],
};
