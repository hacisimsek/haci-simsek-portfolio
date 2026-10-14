import { describe, expect, it } from 'vitest';
import { cssColorToRgb } from '@/lib/three/colors';

// jsdom has no 2D canvas, so this covers the string-parsing fallback; real
// browsers resolve any CSS colour (including oklch) through a 1×1 canvas.
describe('cssColorToRgb', () => {
  it('parses rgb() and hex colours to 0–1 channels', () => {
    expect(cssColorToRgb('rgb(255, 0, 51)')).toEqual([1, 0, 0.2]);
    expect(cssColorToRgb('#ff8000')).toEqual([1, 128 / 255, 0]);
  });

  it('falls back to white for anything it cannot read', () => {
    expect(cssColorToRgb('oklch(0.7 0.2 290)')).toEqual([1, 1, 1]);
  });
});
