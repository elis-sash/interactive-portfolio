import type { ProjectBlockMeta } from './types';
import { KOZIRI_BLOCKS } from './koziri/content';
import { MAX_BLOCKS } from './max/content';
import { MIF_BLOCKS } from './mif/content';
import { MURCH_BLOCKS } from './murch/content';
import { STOP_GALLERY_BLOCKS } from './stop-gallery/content';
import { ZUS_STUDIO_BLOCKS } from './zus-studio/content';

export const PROJECT_BLOCK_STRUCTURES: Record<string, readonly ProjectBlockMeta[]> = {
  max: MAX_BLOCKS,
  'stop-gallery': STOP_GALLERY_BLOCKS,
  koziri: KOZIRI_BLOCKS,
  mif: MIF_BLOCKS,
  murch: MURCH_BLOCKS,
  'zus-studio': ZUS_STUDIO_BLOCKS,
};
