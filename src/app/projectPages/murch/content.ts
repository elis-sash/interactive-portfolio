import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const MURCH = PROJECT_ASSETS.murch;

export const MURCH_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'image',
    src: `${MURCH}/hero.jpg`,
    width: 1024,
    height: 682,
    slot: 'top',
  },
  {
    id: 'role',
    type: 'text',
    slot: 'bottom',
    surface: true,
  },
  {
    id: 'fest-detail',
    type: 'image',
    src: `${MURCH}/fest-detail.jpg`,
    width: 819,
    height: 1024,
  },
  {
    id: 'stickers-blender',
    type: 'image',
    src: `${MURCH}/stickers-blender.png`,
    width: 1024,
    height: 576,
  },
];
