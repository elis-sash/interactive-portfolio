import { PROJECT_META } from '../projects';
import type { ProjectItem } from '../projects';
import type { Messages } from './types';

export function localizeProjects(messages: Messages): ProjectItem[] {
  return PROJECT_META.map((meta) => {
    const copy = messages.projects[meta.id as keyof Messages['projects']];
    return {
      ...meta,
      title: copy.title,
      description: copy.description,
      pageDescription: copy.pageDescription,
      tags: copy.tags,
      tagRows: copy.tagRows,
      previewTagRows: 'previewTagRows' in copy ? copy.previewTagRows : undefined,
      pageDescriptionLinks:
        'pageDescriptionLinks' in copy ? copy.pageDescriptionLinks : undefined,
    };
  });
}
