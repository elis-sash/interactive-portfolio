import { PUBLIC_ASSETS_BASE } from '../projectAssets';
import type { CubeFaceKey } from '../cubeFaceTags';

const ABOUT = `${PUBLIC_ASSETS_BASE}/about`;

/** Image paths for each cube face on the about page. */
export const ABOUT_CUBE_FACE_IMAGES: Record<CubeFaceKey, string> = {
  front: `${ABOUT}/cube-bottom.png`,
  back: `${ABOUT}/cube-back.png`,
  left: `${ABOUT}/cube-left.png`,
  right: `${ABOUT}/cube-right.png`,
  top: `${ABOUT}/cube-top.png`,
  bottom: `${ABOUT}/cube-front.png`,
};

/** @deprecated Use ABOUT_CUBE_FACE_IMAGES.front */
export const ABOUT_PHOTO_SRC = ABOUT_CUBE_FACE_IMAGES.front;
