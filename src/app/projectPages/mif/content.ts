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
    id: 'elements',
    type: 'image',
    src: `${MIF}/elements.png`,
    width: 1024,
    height: 524,
  },
  {
    id: 'scroll-01',
    type: 'video',
    src: `${MIF}/scroll-01.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'scroll-02',
    type: 'video',
    src: `${MIF}/scroll-02.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'scroll-03',
    type: 'video',
    src: `${MIF}/scroll-03.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'scroll-04',
    type: 'video',
    src: `${MIF}/scroll-04.mp4`,
    objectFit: 'cover',
  },
  {
    id: 'scroll-05',
    type: 'video',
    src: `${MIF}/scroll-05.mp4`,
    objectFit: 'cover',
  },
];
