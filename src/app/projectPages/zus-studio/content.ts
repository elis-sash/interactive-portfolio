import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const ZUS_STUDIO = PROJECT_ASSETS.zusStudio;

export const ZUS_STUDIO_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'video',
    src: `${ZUS_STUDIO}/recording-original.mp4`,
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
    id: 'site-scroll',
    type: 'video',
    src: `${ZUS_STUDIO}/site-scroll-original.mp4`,
    objectFit: 'cover',
  },
];
