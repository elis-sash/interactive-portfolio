import { createContext, useEffect, useMemo, type ReactNode } from 'react';
import { detectLocale } from './detectLocale';
import { localizeProjects } from './localizeProjects';
import { MESSAGES } from './messages';
import { syncPageMeta } from './syncPageMeta';
import type { Locale, Messages } from './types';
import type { ProjectItem } from '../projects';

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  projects: ProjectItem[];
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function LocaleProvider({ children }: Props) {
  const locale = useMemo(() => detectLocale(), []);
  const messages = MESSAGES[locale];
  const projects = useMemo(() => localizeProjects(messages), [messages]);

  useEffect(() => {
    syncPageMeta(locale, messages.meta);
  }, [locale, messages]);

  const value = useMemo(
    () => ({ locale, messages, projects }),
    [locale, messages, projects],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
