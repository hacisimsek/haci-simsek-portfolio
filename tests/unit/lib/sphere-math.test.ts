// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { fibonacciSphere } from '@/lib/three/fibonacci';
import { mulberry32 } from '@/lib/three/random';

describe('mulberry32', () => {
  it('is deterministic for a seed and stays in [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const values = Array.from({ length: 1000 }, () => a());
    expect(values).toEqual(Array.from({ length: 1000 }, () => b()));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(mulberry32(7)()).not.toBe(mulberry32(8)());
  });
});

describe('fibonacciSphere', () => {
  it('places every point on the unit sphere', () => {
    const { positions, offsets } = fibonacciSphere(500);
    expect(positions).toHaveLength(1500);
    expect(offsets).toHaveLength(500);
    for (let i = 0; i < 500; i++) {
      const [x, y, z] = positions.subarray(i * 3, i * 3 + 3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
    }
  });

  it('is reproducible for the same seed', () => {
    expect(fibonacciSphere(100, 3)).toEqual(fibonacciSphere(100, 3));
    expect(fibonacciSphere(100, 3).offsets).not.toEqual(
      fibonacciSphere(100, 4).offsets
    );
  });
});
