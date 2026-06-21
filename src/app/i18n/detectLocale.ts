import type { Locale } from './types';

export function detectLocale(): Locale {
  const primary =
    typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages[0]
      : typeof navigator !== 'undefined' && navigator.language
        ? navigator.language
        : 'en';

  return primary.toLowerCase().startsWith('ru') ? 'ru' : 'eng';
}

export function localeToHtmlLang(locale: Locale): string {
  return locale === 'ru' ? 'ru' : 'en';
}
