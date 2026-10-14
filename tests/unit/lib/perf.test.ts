// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  deviceTier,
  shouldLoadSphere,
  stepDown,
  type Quality,
} from '@/lib/perf';

const strong = { cores: 8, memory: 8, saveData: false, coarsePointer: false };

describe('deviceTier', () => {
  it('ranks devices by what they report', () => {
    expect(deviceTier(strong)).toBe('high');
    expect(deviceTier({ ...strong, saveData: true })).toBe('low');
    expect(deviceTier({ ...strong, cores: 2 })).toBe('low');
    expect(deviceTier({ ...strong, memory: 2 })).toBe('low');
    expect(deviceTier({ ...strong, cores: 4 })).toBe('mid');
    expect(deviceTier({ ...strong, coarsePointer: true })).toBe('mid');
  });

  it('treats unknown memory as fine', () => {
    expect(deviceTier({ ...strong, memory: undefined })).toBe('high');
  });
});

describe('stepDown', () => {
  it('lowers resolution, then point count, then gives up', () => {
    const seen: Quality[] = [];
    let quality: Quality = { dpr: 1.75, tier: 'high' };
    for (let i = 0; i < 5; i++) {
      quality = stepDown(quality);
      seen.push(quality);
    }
    expect(seen).toEqual([
      { dpr: 1.25, tier: 'high' },
      { dpr: 1, tier: 'high' },
      { dpr: 1, tier: 'mid' },
      'fallback',
      'fallback',
    ]);
  });
});

describe('shouldLoadSphere', () => {
  it('needs a capable device, motion and WebGL2', () => {
    const ok = { tier: 'high', reducedMotion: false, webgl2: true } as const;
    expect(shouldLoadSphere(ok)).toBe(true);
    expect(shouldLoadSphere({ ...ok, tier: 'mid' })).toBe(true);
    expect(shouldLoadSphere({ ...ok, tier: 'low' })).toBe(false);
    expect(shouldLoadSphere({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldLoadSphere({ ...ok, webgl2: false })).toBe(false);
  });
});
