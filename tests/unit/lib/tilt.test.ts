// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { tiltFromPointer } from '@/lib/tilt';

const rect = { left: 0, top: 0, width: 200, height: 100 };

describe('tiltFromPointer', () => {
  it('is flat at the centre and clamped at the edges', () => {
    expect(tiltFromPointer(100, 50, rect)).toEqual({ rotateX: 0, rotateY: 0 });
    expect(tiltFromPointer(200, 0, rect)).toEqual({ rotateX: 8, rotateY: 8 });
    expect(tiltFromPointer(-500, 900, rect)).toEqual({
      rotateX: -8,
      rotateY: -8,
    });
  });
});
