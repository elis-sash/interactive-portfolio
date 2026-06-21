/* Breakpoints ------------------------------------------------------------------------------------*/

export const MOBILE_BREAKPOINT_PX = 1060;

export const COMPACT_MOBILE_BREAKPOINT_PX = 580;

/* Types ------------------------------------------------------------------------------------------*/

export type DesktopPreviewSlot = {
  itemIndex: number;
  col: number;
  row: number;
};

export type CompactPreviewSlot = {
  itemIndex: number;
  row: number;
  col: number;
};

/* Desktop grid -----------------------------------------------------------------------------------*/

export const DESKTOP_MANUAL_ROWS = 5;

export const DESKTOP_PREVIEW_SLOTS: readonly DesktopPreviewSlot[] = [
  { itemIndex: 0, col: 3, row: 1 },
  { itemIndex: 1, col: 1, row: 2 },
  { itemIndex: 2, col: 2, row: 2 },
  { itemIndex: 3, col: 4, row: 3 },
  { itemIndex: 4, col: 5, row: 2 },
  { itemIndex: 5, col: 3, row: 5 },
];

/* Compact mobile grid ----------------------------------------------------------------------------*/

export const COMPACT_MOBILE_GRID = {
  cols: 3,
  rows: 5,
  centerRow: 2,
  centerCol: 1,
} as const;

export const COMPACT_CUBE_CELL = {
  row: COMPACT_MOBILE_GRID.centerRow,
  col: COMPACT_MOBILE_GRID.centerCol,
} as const;

export const COMPACT_MOBILE_PREVIEW_SLOTS: readonly CompactPreviewSlot[] = [
  { itemIndex: 0, row: 0, col: 1 },
  { itemIndex: 1, row: 1, col: 0 },
  { itemIndex: 2, row: 2, col: 2 },
  { itemIndex: 3, row: 4, col: 0 },
  { itemIndex: 4, row: 3, col: 2 },
  { itemIndex: 5, row: 5, col: 1 },
];

/* Grid extent ------------------------------------------------------------------------------------*/

export function getCompactGridExtent() {
  const { centerRow } = COMPACT_MOBILE_GRID;
  const lastRow = Math.max(centerRow, ...COMPACT_MOBILE_PREVIEW_SLOTS.map((s) => s.row));
  const cubeStopRowBottom = Math.max(centerRow, lastRow - 1);
  return { lastRow, cubeStopRowBottom, totalRows: lastRow + 1 };
}

export function getDesktopGridExtent() {
  const cubeRow = 2;
  const lastRow = Math.max(cubeRow, ...DESKTOP_PREVIEW_SLOTS.map((s) => s.row));
  const cubeStopRowBottom = Math.max(cubeRow, lastRow - 1);
  return { lastRow, cubeStopRowBottom, totalRows: lastRow };
}

/* Legacy aliases ---------------------------------------------------------------------------------*/

export const MOBILE_GRID = COMPACT_MOBILE_GRID;
export const MOBILE_CUBE_CELL = COMPACT_CUBE_CELL;
export const MOBILE_PREVIEW_SLOTS = COMPACT_MOBILE_PREVIEW_SLOTS;
