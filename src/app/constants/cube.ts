import type { CubeFaceKey } from '../cubeFaceTags';
import { PROJECT_ASSETS } from '../projectAssets';
import { normalizeAngle } from '../utils/angles';

/* Face rotation map ------------------------------------------------------------------------------*/

export const FACE_MAP: Record<string, Record<string, [number, number]>> = {
  '0,0': { left: [0, 90], right: [0, -90], up: [-90, 0], down: [90, 0] },
  '0,180': { left: [0, -90], right: [0, 90], up: [-90, 0], down: [90, 0] },
  '0,-180': { left: [0, -90], right: [0, 90], up: [-90, 0], down: [90, 0] },
  '0,90': { left: [0, 180], right: [0, 0], up: [-90, 0], down: [90, 0] },
  '0,-90': { left: [0, 0], right: [0, 180], up: [-90, 0], down: [90, 0] },
  '-90,0': { left: [0, 90], right: [0, -90], up: [0, 180], down: [0, 0] },
  '90,0': { left: [0, 90], right: [0, -90], up: [0, 0], down: [0, 180] },
};

/* Auto-rotate sequence ---------------------------------------------------------------------------*/

export const CUBE_AUTO_FACE_SEQUENCE: readonly [number, number][] = [
  [0, 0],
  [0, 180],
  [0, 90],
  [0, -90],
  [-90, 0],
  [90, 0],
];

/* Motion timing ----------------------------------------------------------------------------------*/

export const CUBE_AUTO_INTERVAL_MS = 7_000;
export const CUBE_TRANSITION_MS = 850;
export const VIEW_SWITCH_MS = 620;
export const VIEW_SWITCH_EASE = 'cubic-bezier(0.45, 0, 0.15, 1)';

/* Face media -------------------------------------------------------------------------------------*/

const CUBE = PROJECT_ASSETS.cube;

export const CUBE_FACE_VIDEOS: Record<CubeFaceKey, string> = {
  front: `${CUBE}/stop-gallery.mp4`,
  back: `${CUBE}/max.mp4`,
  left: `${CUBE}/screen-zus.mp4`,
  right: `${CUBE}/koziri.mp4`,
  top: `${CUBE}/myth.mp4`,
  bottom: `${CUBE}/merch.mp4`,
};

export const CUBE_FACE_NUMBERS: Record<CubeFaceKey, string> = {
  front: '01',
  back: '02',
  left: '03',
  right: '04',
  top: '05',
  bottom: '06',
};

export const CUBE_FACE_ORDER: readonly CubeFaceKey[] = [
  'front',
  'back',
  'left',
  'right',
  'top',
  'bottom',
];

export { normalizeAngle };
