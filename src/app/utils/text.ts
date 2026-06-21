const RU_PREPOSITIONS =
  /(^|[\s(\[«"'])(в|во|к|ко|с|со|у|о|об|ото|от|до|из|на|за|по|при|для|без|про|и|а|я)\s+/gimu;

const EN_ARTICLES_PREPOSITIONS =
  /\b(a|an|the|and|or|but|for|nor|so|yet|to|of|in|on|at|by|as|up|out|off|per|via)\s+/gi;

export function fixHangingPrepositions(text: string) {
  return text
    .replace(RU_PREPOSITIONS, (_, before, word) => `${before}${word}\u00A0`)
    .replace(EN_ARTICLES_PREPOSITIONS, '$1\u00A0');
}

export function fixTrailingOrphan(text: string, wordCount = 2) {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text.trim();
  const head = words.slice(0, -wordCount).join(' ');
  const tail = words.slice(-wordCount).join('\u00A0');
  return `${head} ${tail}`;
}

export function fixAboutParagraph(text: string) {
  return fixTrailingOrphan(fixHangingPrepositions(text));
}

