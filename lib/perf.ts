export type Tier = 'low' | 'mid' | 'high';

export const POINTS = { mid: 2500, high: 6000 } as const;

// What the browser reports about the device; memory is Chromium-only.
export function deviceTier({
  cores,
  memory,
  saveData,
  coarsePointer,
}: {
  cores: number;
  memory?: number;
  saveData: boolean;
  coarsePointer: boolean;
}): Tier {
  if (saveData || cores <= 2 || (memory !== undefined && memory <= 2)) {
    return 'low';
  }
  if (coarsePointer || cores <= 4) return 'mid';
  return 'high';
}

export type Quality = { dpr: number; tier: 'mid' | 'high' } | 'fallback';

const DPR_STEPS = [1.75, 1.25, 1];

// Each sustained frame-rate drop costs resolution first, then particles, and
// finally the WebGL scene itself.
export function stepDown(quality: Quality): Quality {
  if (quality === 'fallback') return quality;
  const next = DPR_STEPS.find((dpr) => dpr < quality.dpr);
  if (next !== undefined) return { ...quality, dpr: next };
  if (quality.tier === 'high') return { dpr: 1, tier: 'mid' };
  return 'fallback';
}

export function shouldLoadSphere({
  tier,
  reducedMotion,
  webgl2,
}: {
  tier: Tier;
  reducedMotion: boolean;
  webgl2: boolean;
}): boolean {
  return tier !== 'low' && !reducedMotion && webgl2;
}
