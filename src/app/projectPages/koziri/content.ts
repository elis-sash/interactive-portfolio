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
    id: 'elements',
    type: 'image',
    src: `${KOZIRI}/elements.png`,
    width: 1600,
    height: 820,
  },
  {
    id: 'screen-preview',
    type: 'video',
    src: `${KOZIRI}/screen-preview.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'adaptive',
    type: 'image',
    src: `${KOZIRI}/adaptive.png`,
    width: 1600,
    height: 900,
  },
  {
    id: 'screen-form',
    type: 'video',
    src: `${KOZIRI}/screen-form.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'image-cover',
    type: 'image',
    src: `${KOZIRI}/image-cover.png`,
    width: 1600,
    height: 658,
  },
];
