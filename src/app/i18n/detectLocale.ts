import { pickLocale } from './pickLocale';
import type { Locale } from './types';

export function detectLocale(): Locale {
  return pickLocale();
}

export function localeToHtmlLang(locale: Locale): string {
  return locale === 'ru' ? 'ru' : 'en';
}
