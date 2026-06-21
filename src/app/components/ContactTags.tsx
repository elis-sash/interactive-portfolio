import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { PANEL_CONTENT_WIDTH_PX, PANEL_INNER_PAD_X } from '../constants/contactPanel';
import { getSeparatorWidth, packTagsFromEnd, packTagsWithPinnedTopRow, tagRowsEqual } from '../utils/tagRows';

type ContactTagsProps = {
  tags: readonly string[];
  tagRows?: readonly (readonly string[])[];
  className?: string;
  /** Below this viewport width, `narrowTopRow` tags stay together on the top row. */
  narrowBreakpoint?: number;
  narrowTopRow?: readonly string[];
};

function getHorizontalPadding(el: HTMLElement): number {
  const style = getComputedStyle(el);
  return Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
}

function getTagsAvailableWidth(container: HTMLElement): number {
  const panel = container.closest<HTMLElement>('.contact-panel');
  if (panel) {
    const inlineWidth = panel.style.getPropertyValue('--panel-content-width');
    if (inlineWidth) {
      const parsed = Number.parseFloat(inlineWidth);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return Math.max(0, parsed - PANEL_INNER_PAD_X);
      }
    }
    return Math.max(0, PANEL_CONTENT_WIDTH_PX - PANEL_INNER_PAD_X);
  }

  if (container.clientWidth > 0) {
    return container.clientWidth;
  }

  const widthSource =
    container.closest<HTMLElement>('.contact-panel__info-inner') ??
    container.closest<HTMLElement>('.project-case-card');

  if (widthSource) {
    return Math.max(0, widthSource.clientWidth - getHorizontalPadding(widthSource));
  }

  return container.clientWidth;
}

export function ContactTags({
  tags,
  tagRows: presetRows,
  className = 'contact-panel__tags uppercase text-[10px] leading-none',
  narrowBreakpoint,
  narrowTopRow,
}: ContactTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const measureCacheRef = useRef<{
    key: string;
    tagWidths: number[];
    sepWidth: number;
  } | null>(null);
  const [packedRows, setPackedRows] = useState<readonly (readonly string[])[]>(() => [tags]);
  const rows = presetRows ?? packedRows;

  useLayoutEffect(() => {
    if (presetRows) return undefined;

    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return undefined;

    let frameId = 0;

    const layout = () => {
      const cacheKey = tags.join('\0');
      let tagWidths: number[];
      let sepWidth: number;

      if (measureCacheRef.current?.key === cacheKey) {
        ({ tagWidths, sepWidth } = measureCacheRef.current);
      } else {
        const tagEls = measure.querySelectorAll<HTMLElement>('[data-tag-measure]');
        tagWidths = Array.from(tagEls, (el) => el.offsetWidth);
        const sepEl = measure.querySelector<HTMLElement>('[data-sep-measure]');
        sepWidth = getSeparatorWidth(sepEl);
        if (tagWidths.every((width) => width === 0)) return;
        measureCacheRef.current = { key: cacheKey, tagWidths, sepWidth };
      }

      const availableWidth = getTagsAvailableWidth(container);
      if (availableWidth <= 0) return;

      const useNarrowTopRow =
        narrowBreakpoint != null &&
        narrowTopRow != null &&
        narrowTopRow.length > 0 &&
        window.innerWidth < narrowBreakpoint;

      const nextRows = useNarrowTopRow
        ? packTagsWithPinnedTopRow(tags, narrowTopRow, tagWidths, sepWidth, availableWidth)
        : packTagsFromEnd(tags, tagWidths, sepWidth, availableWidth);
      setPackedRows((prev) => (tagRowsEqual(prev, nextRows) ? prev : nextRows));
    };

    const scheduleLayout = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(layout);
    };

    layout();
    const observer = new ResizeObserver(scheduleLayout);
    const widthSource =
      container.closest<HTMLElement>('.contact-panel__info-inner') ??
      container.closest<HTMLElement>('.project-case-card');
    if (widthSource) observer.observe(widthSource);
    if (narrowBreakpoint != null) {
      window.addEventListener('resize', scheduleLayout);
    }
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      if (narrowBreakpoint != null) {
        window.removeEventListener('resize', scheduleLayout);
      }
    };
  }, [tags, presetRows, narrowBreakpoint, narrowTopRow]);

  return (
    <div className="contact-panel__tags-wrap">
      <div
        ref={measureRef}
        className="contact-panel__tags-measure uppercase text-[10px] leading-none"
        aria-hidden
      >
        {tags.map((tag) => (
          <span key={tag} data-tag-measure className="contact-panel__tag-label">
            {tag}
          </span>
        ))}
        <span data-sep-measure className="contact-panel__tag-sep" />
      </div>

      <div ref={containerRef} className={className}>
        {rows.map((row) => (
          <div key={row.join('\0')} className="contact-panel__tags-row">
            {row.map((tag, i) => (
              <Fragment key={tag}>
                {i > 0 && <span className="contact-panel__tag-sep" aria-hidden />}
                <span className="contact-panel__tag-label">{tag}</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
