import { PROJECT_BLOCK_STRUCTURES } from '../projectPages/blockStructures';
import type { ProjectBlockMeta, ProjectFeedBlock, ProjectPageConfig } from '../projectPages/types';
import type { Messages } from './types';

function mergeBlock(
  block: ProjectBlockMeta,
  pageCopy: Messages['projectPages'][keyof Messages['projectPages']],
): ProjectFeedBlock {
  const copy = pageCopy.blocks[block.id as keyof typeof pageCopy.blocks];

  if (block.type === 'text') {
    if (!copy || !('lead' in copy) || !('body' in copy)) {
      throw new Error(`Missing text copy for block "${block.id}"`);
    }
    return { ...block, lead: copy.lead, body: copy.body };
  }

  if (block.type === 'image') {
    if (!copy || !('alt' in copy)) {
      throw new Error(`Missing image alt for block "${block.id}"`);
    }
    return { ...block, alt: copy.alt };
  }

  return block;
}

export function getLocalizedProjectPage(
  id: string,
  messages: Messages,
): ProjectPageConfig | undefined {
  const structure = PROJECT_BLOCK_STRUCTURES[id];
  const pageCopy = messages.projectPages[id as keyof Messages['projectPages']];
  if (!structure || !pageCopy) return undefined;

  return {
    kind: 'case',
    blocks: structure.map((block) => mergeBlock(block, pageCopy)),
  };
}
