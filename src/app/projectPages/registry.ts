import { getLocalizedProjectPage } from '../i18n/localizeProjectPages';
import type { Messages } from '../i18n/types';
import type { ProjectPageConfig } from './types';

export function getProjectPage(id: string, messages: Messages): ProjectPageConfig | undefined {
  return getLocalizedProjectPage(id, messages);
}
