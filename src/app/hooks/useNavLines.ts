import { useState, useCallback, useLayoutEffect, type RefObject } from 'react';
import type { NavLineBundle } from '../types/nav';
import type { AppLayout } from './useAppLayout';

/* Nav line compare -------------------------------------------------------------------------------*/

function navLinesEqual(prev: NavLineBundle | null, next: NavLineBundle) {
  if (!prev) return false;
  return (['top', 'bottom', 'left', 'right'] as const).every((k) => {
    const a = prev[k];
    const b = next[k];
    return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
  });
}

type Params = {
  layout: AppLayout;
  size: number;
  zoom: number;
  projectsGalleryView: boolean;
  projectsScrollRef: RefObject<HTMLDivElement | null>;
  cubeAnchorRef: RefObject<HTMLDivElement | null>;
  rotX: number;
  rotY: number;
};

function computeCubeOffset(
  projectsGalleryView: boolean,
  size: number,
  layout: AppLayout,
  projectsScrollRef: RefObject<HTMLDivElement | null>,
  cubeAnchorRef: RefObject<HTMLDivElement | null>,
): { x: number; y: number } {
  if (!projectsGalleryView || !size) return { x: 0, y: 0 };

  const scrollEl = projectsScrollRef.current;
  const anchor = cubeAnchorRef.current;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { gridWidth, projectsGridPaddingTop, cellSize, gap, centerRow, centerCol } = layout;

  if (scrollEl && anchor) {
    const r = anchor.getBoundingClientRect();
    const scrollLift = scrollEl.scrollTop - layout.projectsGridScrollInitial;
    return {
      x: Math.round((r.left + r.right) / 2 - vw / 2),
      y: Math.round((r.top + r.bottom) / 2 - vh / 2 + scrollLift),
    };
  }

  if (!scrollEl) return { x: 0, y: 0 };

  const sr = scrollEl.getBoundingClientRect();
  const columnLeft = sr.left + (scrollEl.clientWidth - gridWidth) / 2;
  return {
    x: Math.round(columnLeft + centerCol * (cellSize + gap) + cellSize / 2 - vw / 2),
    y: Math.round(sr.top + projectsGridPaddingTop + centerRow * (cellSize + gap) + cellSize / 2 - vh / 2),
  };
}

function computeNavLines(
  size: number,
  offset: { x: number; y: number },
): NavLineBundle | null {
  if (!size) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = Math.round(vw / 2 + offset.x);
  const cy = Math.round(vh / 2 + offset.y);
  const hit = 32;
  const topStart = 0;
  const topHeight = Math.max(0, cy);

  return {
    top: { left: cx - hit / 2, top: topStart, width: hit, height: topHeight },
    bottom: { left: cx - hit / 2, top: cy, width: hit, height: Math.max(0, vh - cy) },
    left: { left: 0, top: cy - hit / 2, width: Math.max(0, cx), height: hit },
    right: { left: cx, top: cy - hit / 2, width: Math.max(0, vw - cx), height: hit },
  };
}

/* useNavLines ------------------------------------------------------------------------------------*/

export function useNavLines({
  layout,
  size,
  zoom,
  projectsGalleryView,
  projectsScrollRef,
  cubeAnchorRef,
  rotX,
  rotY,
}: Params) {
  const [navLines, setNavLines] = useState<NavLineBundle | null>(null);
  const [cubeOffset, setCubeOffset] = useState({ x: 0, y: 0 });

  const syncGeometry = useCallback(() => {
    const nextOffset = computeCubeOffset(
      projectsGalleryView,
      size,
      layout,
      projectsScrollRef,
      cubeAnchorRef,
    );

    setCubeOffset((prev) =>
      prev.x === nextOffset.x && prev.y === nextOffset.y ? prev : nextOffset,
    );

    const nextNavLines = computeNavLines(size, nextOffset);
    setNavLines((prev) => {
      if (nextNavLines === null) return prev === null ? prev : null;
      if (prev === null) return nextNavLines;
      return navLinesEqual(prev, nextNavLines) ? prev : nextNavLines;
    });
  }, [
    projectsGalleryView,
    size,
    layout,
    projectsScrollRef,
    cubeAnchorRef,
    layout.padding,
    layout.projectsGridScrollInitial,
    layout.gridWidth,
    layout.projectsGridPaddingTop,
    layout.cellSize,
    layout.gap,
    layout.centerRow,
    layout.centerCol,
  ]);

  useLayoutEffect(() => {
    let id = 0;
    const schedule = () => {
      cancelAnimationFrame(id);
      id = requestAnimationFrame(syncGeometry);
    };
    schedule();
    return () => cancelAnimationFrame(id);
  }, [syncGeometry, zoom, rotX, rotY, layout.viewportSize.width, layout.viewportSize.height]);

  useLayoutEffect(() => {
    if (!projectsGalleryView) return undefined;
    const scrollEl = projectsScrollRef.current;
    if (!scrollEl) return undefined;

    let id = 0;
    const onScroll = () => {
      cancelAnimationFrame(id);
      id = requestAnimationFrame(syncGeometry);
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      scrollEl.removeEventListener('scroll', onScroll);
    };
  }, [projectsGalleryView, projectsScrollRef, syncGeometry]);

  const navCx = navLines ? navLines.top.left + navLines.top.width / 2 : layout.viewportSize.width / 2;
  const navCy = navLines ? navLines.left.top + navLines.left.height / 2 : layout.viewportSize.height / 2;

  return { navLines, cubeOffset, navCx, navCy };
}
