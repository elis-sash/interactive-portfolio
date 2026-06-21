/* packTagsFromEnd --------------------------------------------------------------------------------*/

export function getSeparatorWidth(sepEl: HTMLElement | null): number {
  if (!sepEl) return 24;
  const style = getComputedStyle(sepEl);
  const margin =
    Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight);
  return sepEl.offsetWidth + margin;
}

export function packTagsFromEnd(
  tags: readonly string[],
  tagWidths: readonly number[],
  sepWidth: number,
  containerWidth: number,
): string[][] {
  if (tags.length === 0) return [];
  if (containerWidth <= 0) return [tags.slice()];

  const totalWidth = tagWidths.reduce(
    (sum, w, i) => sum + w + (i > 0 ? sepWidth : 0),
    0,
  );
  if (totalWidth <= containerWidth) return [tags.slice()];

  const rows: string[][] = [];
  let row: string[] = [];
  let rowWidth = 0;

  for (let i = tags.length - 1; i >= 0; i--) {
    const tag = tags[i];
    const w = tagWidths[i] ?? 0;

    if (row.length > 0 && rowWidth + sepWidth + w > containerWidth) {
      rows.push(row);
      row = [tag];
      rowWidth = w;
    } else {
      row.unshift(tag);
      rowWidth += row.length === 1 ? w : sepWidth + w;
    }
  }

  if (row.length > 0) rows.push(row);

  return reflowTagRows(rows, tags, tagWidths, sepWidth, containerWidth);
}

export function packTagsWithPinnedTopRow(
  tags: readonly string[],
  topRowTags: readonly string[],
  tagWidths: readonly number[],
  sepWidth: number,
  containerWidth: number,
): string[][] {
  const topSet = new Set(topRowTags);
  const topRow = topRowTags.filter((tag) => tags.includes(tag));
  const restTags = tags.filter((tag) => !topSet.has(tag));

  if (topRow.length === 0) {
    return packTagsFromEnd(tags, tagWidths, sepWidth, containerWidth);
  }

  const tagIndex = new Map(tags.map((tag, index) => [tag, index]));
  const restWidths = restTags.map((tag) => tagWidths[tagIndex.get(tag) ?? -1] ?? 0);
  const restRows =
    restTags.length > 0
      ? packTagsFromEnd(restTags, restWidths, sepWidth, containerWidth)
      : [];

  return [...restRows, topRow];
}

function reflowTagRows(
  rows: string[][],
  tags: readonly string[],
  tagWidths: readonly number[],
  sepWidth: number,
  containerWidth: number,
): string[][] {
  const tagIndex = new Map(tags.map((tag, index) => [tag, index]));
  const result: string[][] = [];

  for (const row of rows) {
    let chunk: string[] = [];
    let chunkWidth = 0;

    for (const tag of row) {
      const w = tagWidths[tagIndex.get(tag) ?? -1] ?? 0;
      const add = chunk.length === 0 ? w : sepWidth + w;

      if (chunk.length > 0 && chunkWidth + add > containerWidth) {
        result.push(chunk);
        chunk = [tag];
        chunkWidth = w;
        continue;
      }

      chunk.push(tag);
      chunkWidth += chunk.length === 1 ? w : add;
    }

    if (chunk.length > 0) result.push(chunk);
  }

  return result;
}

export function tagRowsEqual(
  a: readonly (readonly string[])[],
  b: readonly (readonly string[])[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((row, i) => {
    const other = b[i];
    if (!other || row.length !== other.length) return false;
    return row.every((tag, j) => tag === other[j]);
  });
}
