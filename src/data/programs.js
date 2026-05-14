import rch from './divisions/rch/index.js';
import ndcp from './divisions/ndcp/index.js';
import ncd from './divisions/ncd/index.js';
import hss from './divisions/hss/index.js';
import hrh from './divisions/hrh/index.js';

export const STATUS_CONFIG = {
  red:    { label: 'Immediate Attention Required', shortLabel: 'Critical', order: 0 },
  yellow: { label: 'Under Review',                 shortLabel: 'Caution',  order: 1 },
  green:  { label: 'On Track',                     shortLabel: 'On Track', order: 2 },
};

export const DIVISIONS = [rch, ndcp, ncd, hss, hrh];
