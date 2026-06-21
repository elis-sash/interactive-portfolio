import { useEffect, useLayoutEffect, type ReactNode, type RefObject } from 'react';
import { ProjectPreviewCell } from './ProjectPreviewCell';
import { useLocale } from '../i18n/useLocale';
import type { ProjectItem } from '../projects';
import { DESKTOP_PREVIEW_SLOTS } from '../constants/projectsGrid';

type ProjectsGridProps = {
  scrollRef: RefObject<HTMLDivElement | null>;
  cubeAnchorRef: RefObject<HTMLDivElement | null>;
  isCompactMobile: boolean;
  gridWidth: number;
  gridCols: number;
  gridRows: number;
  cellSize: number;
  gap: number;
  centerRow: number;
  centerCol: number;
  projectsGridPaddingTop: number;
  projectsGridPaddingBottom: number;
  projectsGridScrollInitial: number;
  totalGridRows: number;
  ringItemByCell: Map<string, ProjectItem>;
  overflowByCell: Map<string, ProjectItem>;
  onOpenProject: (src: string) => void;
};

export function ProjectsGrid({
  scrollRef,
  cubeAnchorRef,
  isCompactMobile,
  gridWidth,
  gridCols,
  gridRows,
  cellSize,
  gap,
  centerRow,
  centerCol,
  projectsGridPaddingTop,
  projectsGridPaddingBottom,
  projectsGridScrollInitial,
  totalGridRows,
  ringItemByCell,
  overflowByCell,
  onOpenProject,
}: ProjectsGridProps) {
  const { projects } = useLocale();
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = projectsGridScrollInitial;
  }, [scrollRef, projectsGridScrollInitial]);

  useEffect(() => {
    const onWheelCapture = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t instanceof Element && t.closest('[data-contact-panel]')) {
        return;
      }

      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const r = scrollEl.getBoundingClientRect();
      const { clientX: x, clientY: y, deltaX, deltaY, deltaMode } = e;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;

      let dy = deltaY;
      let dx = deltaX;
      if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
        dy *= 16;
        dx *= 16;
      } else if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        dy *= r.height;
        dx *= r.width;
      }

      const prevTop = scrollEl.scrollTop;
      const prevLeft = scrollEl.scrollLeft;
      scrollEl.scrollTop += dy;
      scrollEl.scrollLeft += dx;

      if (scrollEl.scrollTop !== prevTop || scrollEl.scrollLeft !== prevLeft) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheelCapture, true);
  }, [scrollRef]);

  const shell = (key: string, inner: ReactNode, interactive: boolean) => (
    <div
      key={key}
      className="overflow-hidden shrink-0"
      style={{
        width: cellSize,
        height: cellSize,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      {inner}
    </div>
  );

  return (
    <div
      ref={scrollRef}
      className={`projects-scroll-area min-h-0 flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden ${
        isCompactMobile ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ contain: 'content' }}
    >
      <div className="flex w-full min-w-0" style={{ minHeight: 'min-content' }}>
        <div className="pointer-events-none min-h-px min-w-0 flex-1 shrink" aria-hidden />
        <div className="pointer-events-none shrink-0" style={{ width: gridWidth }}>
          <div
            style={{
              paddingTop: projectsGridPaddingTop,
              paddingBottom: projectsGridPaddingBottom,
            }}
          >
            {isCompactMobile ? (
              <div
                className="pointer-events-none"
                style={{
                  display: 'grid',
                  width: gridWidth,
                  gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
                  gap,
                  justifyContent: 'start',
                }}
              >
                {Array.from({ length: totalGridRows * gridCols }).map((_, idx) => {
                  const r = Math.floor(idx / gridCols);
                  const c = idx % gridCols;

                  if (r === centerRow && c === centerCol) {
                    return shell(
                      `g-${r}-${c}`,
                      <div
                        ref={cubeAnchorRef}
                        aria-hidden
                        style={{
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          visibility: 'hidden',
                        }}
                      />,
                      false,
                    );
                  }

                  const ringItem = ringItemByCell.get(`${r},${c}`);
                  if (ringItem) {
                    return shell(
                      `g-${r}-${c}`,
                      <ProjectPreviewCell
                        project={ringItem}
                        onOpen={() => onOpenProject(ringItem.src)}
                      />,
                      true,
                    );
                  }

                  return shell(
                    `g-${r}-${c}`,
                    <div style={{ width: '100%', height: '100%' }} aria-hidden />,
                    false,
                  );
                })}
              </div>
            ) : (
              <div
                className="projects-grid-manual pointer-events-none"
                style={{
                  width: gridWidth,
                  ['--cell-size' as string]: `${cellSize}px`,
                  ['--grid-gap' as string]: `${gap}px`,
                  ['--grid-rows' as string]: `${totalGridRows}`,
                }}
              >
                <div className="projects-cell projects-cell--cube" aria-hidden ref={cubeAnchorRef} />
                {DESKTOP_PREVIEW_SLOTS.map((slot) => (
                  <div
                    key={`slot-${slot.itemIndex}`}
                    className="projects-cell"
                    style={{ gridColumn: slot.col, gridRow: slot.row }}
                  >
                    <ProjectPreviewCell
                      project={projects[slot.itemIndex]}
                      onOpen={() => onOpenProject(projects[slot.itemIndex].src)}
                    />
                  </div>
                ))}
                <div
                  className="projects-row-guard"
                  aria-hidden
                  style={{ gridRow: `${totalGridRows}`, gridColumn: '1 / -1' }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="pointer-events-none min-h-px min-w-0 flex-1 shrink" aria-hidden />
      </div>
    </div>
  );
}
