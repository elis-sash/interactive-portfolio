import { PROJECT_ASSETS } from '../../projectAssets';
import type { ProjectBlockMeta } from '../types';

const MURCH = PROJECT_ASSETS.murch;

export const MURCH_BLOCKS: readonly ProjectBlockMeta[] = [
  {
    id: 'keychain-close',
    type: 'image',
    src: `${MURCH}/keychain-close.png`,
    width: 1024,
    height: 524,
    slot: 'top',
  },
  {
    id: 'role',
    type: 'text',
    slot: 'bottom',
    surface: true,
  },
  {
    id: 'keychain-wide',
    type: 'image',
    src: `${MURCH}/keychain-wide.png`,
    width: 1024,
    height: 524,
  },
  {
    id: 'recording',
    type: 'video',
    src: `${MURCH}/0061-0090.mkv`,
    objectFit: 'cover',
  },
];
