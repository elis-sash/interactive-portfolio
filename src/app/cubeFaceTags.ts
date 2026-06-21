import { normalizeAngle } from './utils/angles';

/* Types ------------------------------------------------------------------------------------------*/

export type CubeFaceKey = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

/* Visible face -----------------------------------------------------------------------------------*/

const FACE_BY_ROTATION: Record<string, CubeFaceKey> = {
  '0,0': 'front',
  '0,-90': 'right',
  '0,90': 'left',
  '0,180': 'back',
  '0,-180': 'back',
  '-90,0': 'top',
  '90,0': 'bottom',
};

export function getVisibleCubeFace(rotX: number, rotY: number): CubeFaceKey {
  const key = `${normalizeAngle(rotX)},${normalizeAngle(rotY)}`;
  return FACE_BY_ROTATION[key] ?? 'front';
}
