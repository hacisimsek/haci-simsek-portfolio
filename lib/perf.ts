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

// One real step down on this screen: resolution caps that would leave the
// effective pixel ratio unchanged (e.g. 1.75 → 1.25 on a 1x display) are
// skipped.
export function degrade(quality: Quality, devicePixelRatio: number): Quality {
  if (quality === 'fallback') return quality;
  const effective = Math.min(devicePixelRatio, quality.dpr);
  let next = stepDown(quality);
  while (
    next !== 'fallback' &&
    next.tier === quality.tier &&
    Math.min(devicePixelRatio, next.dpr) === effective
  ) {
    next = stepDown(next);
  }
  return next;
}

// A window is slow when frames fall well short of what the display delivers
// (estimated from the fastest frame), so a steady 30 Hz screen or a battery
// saver isn't mistaken for a struggling GPU. Below 24 fps is always slow.
export function isSlow({
  frames,
  elapsed,
  minDelta,
}: {
  frames: number;
  elapsed: number;
  minDelta: number;
}): boolean {
  const fps = (frames * 1000) / elapsed;
  const refresh = 1000 / Math.max(minDelta, 1);
  return fps < Math.max(24, refresh * 0.75);
}
