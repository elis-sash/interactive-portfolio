import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const MAX = PROJECT_ASSETS.max;

export const MAX_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'video',
    src: `${MAX}/logo-color-original.mp4`,
    slot: 'top',
    objectFit: 'cover',
  },
  {
    id: 'role',
    type: 'text',
    slot: 'bottom',
    surface: true,
  },
  { id: 'spark', type: 'video', src: `${MAX}/logo-spark-original.mp4` },
  { id: 'elements', type: 'video', src: `${MAX}/elements-original.mp4` },
  {
    id: 'billboard',
    type: 'image',
    src: `${MAX}/billboard.png`,
    width: 2400,
    height: 1331,
  },
  {
    id: 'social',
    type: 'image',
    src: `${MAX}/social-grid.png`,
    width: 2400,
    height: 1534,
  },
];
