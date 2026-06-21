import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const STOP_GALLERY = PROJECT_ASSETS.stopGallery;

export const STOP_GALLERY_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'hero',
    type: 'video',
    src: `${STOP_GALLERY}/gallery-screen-original.mp4`,
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
    id: 'recording',
    type: 'video',
    src: `${STOP_GALLERY}/recording-original.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'cover-case',
    type: 'video',
    src: `${STOP_GALLERY}/cover-case-original.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'logo',
    type: 'video',
    src: `${STOP_GALLERY}/logo-original.mkv`,
    objectFit: 'contain',
  },
];
