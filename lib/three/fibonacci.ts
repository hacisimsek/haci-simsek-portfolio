import { mulberry32 } from './random';

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Evenly spread points on the unit sphere, plus a per-point random offset the
// shader uses for colour and motion variety.
export function fibonacciSphere(count: number, seed = 1) {
  const positions = new Float32Array(count * 3);
  const offsets = new Float32Array(count);
  const random = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    const y = 1 - (2 * (i + 0.5)) / count;
    const radius = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius;
    offsets[i] = random();
  }
  return { positions, offsets };
}
