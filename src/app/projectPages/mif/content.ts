import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const MIF = PROJECT_ASSETS.mif;

export const MIF_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'video',
    src: `${MIF}/hero-original.mp4`,
    slot: 'top',
    objectFit: 'cover',
  },
  {
    id: 'role',
    type: 'text',
    slot: 'bottom',
    surface: true,
  },
  {
    id: 'concept',
    type: 'video',
    src: `${MIF}/concept-original.mp4`,
    objectFit: 'cover',
  },
];
