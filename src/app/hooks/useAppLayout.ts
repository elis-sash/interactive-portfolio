import { useState, useEffect, useMemo } from 'react';
import { useLocale } from '../i18n/useLocale';
import type { ProjectItem } from '../projects';
import {
  COMPACT_MOBILE_BREAKPOINT_PX,
  COMPACT_MOBILE_GRID,
  COMPACT_MOBILE_PREVIEW_SLOTS,
  DESKTOP_PREVIEW_SLOTS,
  getCompactGridExtent,
  getDesktopGridExtent,
  MOBILE_BREAKPOINT_PX,
} from '../constants/projectsGrid';

/* Scroll helpers ---------------------------------------------------------------------------------*/

function projectsGridPaddingBottomForScroll({
  viewportHeight,
  paddingTop,
  padding,
  cellSize,
  gap,
  maxScrollTop,
  totalGridRows,
}: {
  viewportHeight: number;
  paddingTop: number;
  padding: number;
  cellSize: number;
  gap: number;
  maxScrollTop: number;
  totalGridRows: number;
}) {
  const gridHeight = totalGridRows * cellSize + (totalGridRows - 1) * gap;
  const minBottom = maxScrollTop + viewportHeight - paddingTop - gridHeight;
  return Math.max(padding, Math.ceil(minBottom));
}

function cubeStopRowTop0(centerRow: number, slotRows: number[]) {
  const minRow = Math.min(0, ...slotRows);
  return Math.min(centerRow, minRow + 1);
}

/* Types ------------------------------------------------------------------------------------------*/

export type AppLayout = {
  isMobile: boolean;
  isCompactMobile: boolean;
  viewportSize: { width: number; height: number };
  padding: number;
  gap: number;
  gridCols: number;
  gridRows: number;
  centerRow: number;
  centerCol: number;
  cellSize: number;
  gridWidth: number;
  projectsGridPaddingTop: number;
  projectsGridPaddingBottom: number;
  projectsGridScrollInitial: number;
  ringItemByCell: Map<string, ProjectItem>;
  overflowByCell: Map<string, ProjectItem>;
  totalGridRows: number;
  cubeSize: number;
  minZoom: number;
};

/* useAppLayout -----------------------------------------------------------------------------------*/

export function useAppLayout(): AppLayout {
  const { projects } = useLocale();
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

  const isMobile = viewportSize.width < MOBILE_BREAKPOINT_PX;
  const isCompactMobile = viewportSize.width < COMPACT_MOBILE_BREAKPOINT_PX;

  const padding = isMobile ? 16 : 40;
  const gap = isMobile ? 8 : 16;
  const gridCols = isCompactMobile ? COMPACT_MOBILE_GRID.cols : 5;
  const gridRows = isCompactMobile ? COMPACT_MOBILE_GRID.rows : 3;
  const centerRow = isCompactMobile ? COMPACT_MOBILE_GRID.centerRow : 1;
  const centerCol = isCompactMobile ? COMPACT_MOBILE_GRID.centerCol : 2;
  const initialCubeScale = isMobile ? 0.82 : 0.66;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const apply = () => {
      const w = window.innerWidth - padding * 2;
      const h = window.innerHeight - padding * 2;
      setBoxSize({ width: Math.min(w, h) * initialCubeScale, height: Math.min(w, h) * initialCubeScale });
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const schedule = (ms = 120) => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(apply, ms);
    };

    const onResize = () => schedule();
    const onFullscreen = () => schedule(100);

    apply();
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('webkitfullscreenchange', onFullscreen);
    document.addEventListener('mozfullscreenchange', onFullscreen);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('webkitfullscreenchange', onFullscreen);
      document.removeEventListener('mozfullscreenchange', onFullscreen);
    };
  }, [padding, initialCubeScale]);

  const cellSize = Math.floor(
    Math.min(
      (viewportSize.width - padding * 2 - (gridCols - 1) * gap) / gridCols,
      (viewportSize.height - padding * 2 - (gridRows - 1) * gap) / gridRows,
    ),
  );
  const gridWidth = gridCols * cellSize + (gridCols - 1) * gap;

  const { ringItemByCell, overflowByCell, totalGridRows, cubeStopRowBottom, cubeStopRowTop } =
    useMemo(() => {
      if (!isCompactMobile) {
        const { totalRows, cubeStopRowBottom: bottom } = getDesktopGridExtent();
        const slotRows = DESKTOP_PREVIEW_SLOTS.map((s) => s.row);
        const minRow = Math.min(2, ...slotRows);
        const top1 = Math.min(2, minRow + 1);
        return {
          ringItemByCell: new Map<string, ProjectItem>(),
          overflowByCell: new Map<string, ProjectItem>(),
          totalGridRows: totalRows,
          cubeStopRowBottom: bottom - 1,
          cubeStopRowTop: top1 - 1,
        };
      }

      const { totalRows, cubeStopRowBottom: bottom } = getCompactGridExtent();
      const slotRows = COMPACT_MOBILE_PREVIEW_SLOTS.map((s) => s.row);
      const ringItemByCell = new Map<string, ProjectItem>();
      for (const slot of COMPACT_MOBILE_PREVIEW_SLOTS) {
        const item = projects[slot.itemIndex];
        if (item) ringItemByCell.set(`${slot.row},${slot.col}`, item);
      }

      return {
        ringItemByCell,
        overflowByCell: new Map<string, ProjectItem>(),
        totalGridRows: totalRows,
        cubeStopRowBottom: bottom,
        cubeStopRowTop: cubeStopRowTop0(COMPACT_MOBILE_GRID.centerRow, slotRows),
      };
    }, [isCompactMobile, projects]);

  const rowStep = cellSize + gap;
  const scrollUpRows = Math.max(0, centerRow - cubeStopRowTop);
  const scrollDownRows = Math.max(0, cubeStopRowBottom - centerRow);
  const projectsGridScrollInitial = scrollUpRows * rowStep;

  const projectsGridPaddingTop =
    Math.max(
      padding,
      Math.floor(viewportSize.height / 2 - centerRow * rowStep - cellSize / 2),
    ) + projectsGridScrollInitial;

  const maxScrollTop = (scrollUpRows + scrollDownRows) * rowStep;

  const projectsGridPaddingBottom = projectsGridPaddingBottomForScroll({
    viewportHeight: viewportSize.height,
    paddingTop: projectsGridPaddingTop,
    padding,
    cellSize,
    gap,
    maxScrollTop,
    totalGridRows,
  });

  const cubeSize = Math.min(boxSize.width, boxSize.height);
  const minZoom = boxSize.width && cubeSize > 0 ? cellSize / cubeSize : 0.2;

  return {
    isMobile,
    isCompactMobile,
    viewportSize,
    padding,
    gap,
    gridCols,
    gridRows,
    centerRow,
    centerCol,
    cellSize,
    gridWidth,
    projectsGridPaddingTop,
    projectsGridPaddingBottom,
    projectsGridScrollInitial,
    ringItemByCell,
    overflowByCell,
    totalGridRows,
    cubeSize,
    minZoom,
  };
}
