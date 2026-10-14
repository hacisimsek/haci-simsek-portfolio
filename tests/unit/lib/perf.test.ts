// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  deviceTier,
  isSlow,
  shouldLoadSphere,
  degrade,
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

describe('isSlow', () => {
  it('flags janky frames on a fast display', () => {
    // 60 Hz display (fastest frame 16.7 ms) delivering 35 fps.
    expect(isSlow({ frames: 70, elapsed: 2000, minDelta: 16.7 })).toBe(true);
    expect(isSlow({ frames: 118, elapsed: 2000, minDelta: 16.7 })).toBe(false);
  });

  it('accepts a steady 30 Hz display or battery-saver rAF', () => {
    expect(isSlow({ frames: 60, elapsed: 2000, minDelta: 33.3 })).toBe(false);
  });

  it('always flags a slideshow', () => {
    expect(isSlow({ frames: 30, elapsed: 2000, minDelta: 60 })).toBe(true);
  });
});

describe('degrade', () => {
  it('skips resolution steps that would not change anything on this screen', () => {
    expect(degrade({ dpr: 1.75, tier: 'high' }, 1)).toEqual({
      dpr: 1,
      tier: 'mid',
    });
    expect(degrade({ dpr: 1.75, tier: 'high' }, 2)).toEqual({
      dpr: 1.25,
      tier: 'high',
    });
    expect(degrade({ dpr: 1, tier: 'mid' }, 2)).toBe('fallback');
  });
});
