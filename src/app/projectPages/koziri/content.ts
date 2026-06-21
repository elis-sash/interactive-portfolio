import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const KOZIRI = PROJECT_ASSETS.koziri;

export const KOZIRI_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'video',
    src: `${KOZIRI}/hero-original.mp4`,
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
    id: 'overview',
    type: 'image',
    src: `${KOZIRI}/overview.png`,
    width: 910,
    height: 1024,
  },
];
