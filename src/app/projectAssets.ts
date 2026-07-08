/* Asset paths ------------------------------------------------------------------------------------*/

export const PUBLIC_ASSETS_BASE = `${import.meta.env.BASE_URL}assets`;

export const PROJECT_ASSETS = {
  max: `${PUBLIC_ASSETS_BASE}/projects/max`,
  cube: `${PUBLIC_ASSETS_BASE}/projects/cube`,
  koziri: `${PUBLIC_ASSETS_BASE}/projects/koziri`,
  mif: `${PUBLIC_ASSETS_BASE}/projects/mif`,
  murch: `${PUBLIC_ASSETS_BASE}/projects/murch`,
  stopGallery: `${PUBLIC_ASSETS_BASE}/projects/stop-gallery`,
  zusStudio: `${PUBLIC_ASSETS_BASE}/projects/zus-studio`,
} as const;
