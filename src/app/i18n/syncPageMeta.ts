import { localeToHtmlLang } from './detectLocale';
import type { Locale } from './types';

type PageMeta = {
  title: string;
  description: string;
};

export function syncPageMeta(locale: Locale, meta: PageMeta) {
  document.documentElement.lang = localeToHtmlLang(locale);
  document.title = meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', meta.description);
  }
}
