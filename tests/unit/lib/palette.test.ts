import { describe, expect, it } from 'vitest';
import { paletteFromStyle } from '@/lib/three/palette';

const style = (tokens: Record<string, string>) => ({
  getPropertyValue: (name: string) => tokens[name] ?? '',
});

describe('paletteFromStyle', () => {
  it('reads primary, accent and the third aurora token', () => {
    const palette = paletteFromStyle(
      style({
        '--primary': 'rgb(255, 0, 0)',
        '--accent': ' #00ff00 ',
        '--aurora-3': 'rgb(0, 0, 255)',
      }),
      true
    );
    expect(palette).toEqual({
      dark: true,
      a: [1, 0, 0],
      b: [0, 1, 0],
      c: [0, 0, 1],
    });
  });
});
