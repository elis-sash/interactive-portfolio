import { useLayoutEffect, useRef, useState } from 'react';
import { getSeparatorWidth, packTagsFromEnd, tagRowsEqual } from '../utils/tagRows';

const PREVIEW_PANEL_PADDING_X = 24;

type Props = {
  tags: readonly string[];
  tagRows?: readonly (readonly string[])[];
};

function TagRow({ tags }: { tags: readonly string[] }) {
  return (
    <div className="project-preview-cell__tags-row">
      {tags.map((tag) => (
        <span key={tag} className="project-preview-cell__tag-label">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function PreviewCellTags({ tags, tagRows: presetRows }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [packedRows, setPackedRows] = useState<readonly (readonly string[])[]>(() => [tags]);
  const rows = presetRows ?? packedRows;

  useLayoutEffect(() => {
    if (presetRows) return undefined;

    const wrap = wrapRef.current;
    const measure = measureRef.current;
    const cell = wrap?.closest<HTMLElement>('.project-preview-cell');
    if (!wrap || !measure || !cell) return undefined;

    let frameId = 0;

    const layout = () => {
      const tagEls = measure.querySelectorAll<HTMLElement>('[data-tag-measure]');
      const tagWidths = Array.from(tagEls, (el) => el.offsetWidth);
      if (tagWidths.every((width) => width === 0)) return;

      const sepEl = measure.querySelector<HTMLElement>('[data-sep-measure]');
      const sepWidth = getSeparatorWidth(sepEl);
      const availableWidth = Math.max(0, cell.clientWidth - PREVIEW_PANEL_PADDING_X);
      if (availableWidth <= 0) return;

      const nextRows = packTagsFromEnd(tags, tagWidths, sepWidth, availableWidth);
      setPackedRows((prev) => (tagRowsEqual(prev, nextRows) ? prev : nextRows));
    };

    const scheduleLayout = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(layout);
    };

    layout();
    const observer = new ResizeObserver(scheduleLayout);
    observer.observe(cell);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [tags, presetRows]);

  return (
    <div ref={wrapRef} className="project-preview-cell__tags uppercase text-[10px] leading-none">
      <div
        ref={measureRef}
        className="project-preview-cell__tags-measure uppercase text-[10px] leading-none"
        aria-hidden
      >
        {tags.map((tag) => (
          <span key={tag} data-tag-measure className="project-preview-cell__tag-label">
            {tag}
          </span>
        ))}
        <span data-sep-measure className="project-preview-cell__tag-sep" aria-hidden />
      </div>

      {rows.map((row, i) => (
        <TagRow key={row.join('\0') || `row-${i}`} tags={row} />
      ))}
    </div>
  );
}
