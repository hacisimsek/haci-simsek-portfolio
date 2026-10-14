import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const files = join(
  process.cwd(),
  'node_modules/@fontsource/space-grotesk/files'
);

// Satori keeps one font per family name, so the latin-ext subset (ı, ş, İ)
// gets its own name and joins as a fallback in the family chain.
export const DISPLAY_FONT_FAMILY = 'Space Grotesk, Space Grotesk Ext';

// Satori needs woff/ttf, not woff2.
export async function loadDisplayFont() {
  const [latin, latinExt] = await Promise.all([
    readFile(join(files, 'space-grotesk-latin-700-normal.woff')),
    readFile(join(files, 'space-grotesk-latin-ext-700-normal.woff')),
  ]);
  return [
    { name: 'Space Grotesk', data: latin },
    { name: 'Space Grotesk Ext', data: latinExt },
  ].map((font) => ({
    ...font,
    weight: 700 as const,
    style: 'normal' as const,
  }));
}
