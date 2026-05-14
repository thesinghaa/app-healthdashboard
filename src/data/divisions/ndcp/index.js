import nvhcp from './nvhcp.js';
import tb from './tb.js';
import nlep from './nlep.js';
import ncvbdcp from './ncvbdcp.js';
import idsp from './idsp.js';
import nscaem from './nscaem.js';

export default {
  id: 'ndcp',
  label: 'NDCP',
  fullName: 'National Disease Control Programmes',
  programs: [nvhcp, tb, nlep, ncvbdcp, idsp, nscaem],
};
