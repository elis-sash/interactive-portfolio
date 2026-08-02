import type { Locale } from './types';

export function localeFromTag(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  if (lower.startsWith('ru')) return 'ru';
  if (lower.startsWith('en')) return 'eng';
  return null;
}

/** System/regional locale first, then the full browser language preference list. */
export function getLocaleCandidates(): string[] {
  const candidates: string[] = [];

  try {
    const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (intlLocale) candidates.push(intlLocale);
  } catch {
    // Intl may be unavailable in some environments.
  }

  if (typeof navigator !== 'undefined') {
    if (navigator.languages?.length) {
      candidates.push(...navigator.languages);
    }
    if (navigator.language) {
      candidates.push(navigator.language);
    }
  }

  return candidates.length > 0 ? candidates : ['en'];
}

export function pickLocale(candidates: readonly string[] = getLocaleCandidates()): Locale {
  for (const tag of candidates) {
    const locale = localeFromTag(tag);
    if (locale) return locale;
  }

  return 'eng';
}

/** Inline script for index.html — keep in sync with pickLocale(). */
export function buildLocaleDetectionIife(): string {
  return `(function pickLocale(){var c=[];try{var i=Intl.DateTimeFormat().resolvedOptions().locale;if(i)c.push(i);}catch(e){}if(navigator.languages)c=c.concat(Array.prototype.slice.call(navigator.languages));if(navigator.language)c.push(navigator.language);if(!c.length)c.push("en");for(var n=0;n<c.length;n++){var l=String(c[n]).toLowerCase();if(l.indexOf("ru")===0)return"ru";if(l.indexOf("en")===0)return"eng";}return"eng";})()`;
}
