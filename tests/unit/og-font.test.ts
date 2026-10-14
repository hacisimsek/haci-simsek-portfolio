// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { DISPLAY_FONT_FAMILY, loadDisplayFont } from '@/lib/og/font';

describe('loadDisplayFont', () => {
  // Satori keeps one font per family name, so the latin-ext subset (ı, ş, İ)
  // must be its own family in the fallback chain or Turkish letters fall
  // back to a different typeface.
  it('registers latin and latin-ext as separate families in one chain', async () => {
    const fonts = await loadDisplayFont();
    const names = fonts.map((font) => font.name);
    expect(new Set(names).size).toBe(fonts.length);
    expect(DISPLAY_FONT_FAMILY.split(',').map((name) => name.trim())).toEqual(
      names
    );
    expect(fonts.every((font) => font.data.byteLength > 1000)).toBe(true);
  });
});
