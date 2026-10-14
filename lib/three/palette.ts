import { cssColorToRgb } from './colors';

type Style = { getPropertyValue: (name: string) => string };

// The sphere's three colours from the theme tokens: primary and accent for
// most points, the third aurora token for the brightest few.
export function paletteFromStyle(style: Style, dark: boolean) {
  const token = (name: string) =>
    cssColorToRgb(style.getPropertyValue(name).trim());
  return {
    dark,
    a: token('--primary'),
    b: token('--accent'),
    c: token('--aurora-3'),
  };
}
