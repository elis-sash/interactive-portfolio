export function normalizeAngle(angle: number) {
  let normalized = ((angle % 360) + 360) % 360;
  if (normalized > 180) normalized -= 360;
  return Math.round(normalized / 90) * 90;
}

