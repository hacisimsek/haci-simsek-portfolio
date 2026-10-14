import { ImageResponse } from 'next/og';
import { brand } from './brand';
import { DISPLAY_FONT_FAMILY, loadDisplayFont } from './font';

// "HŞ" on the aurora gradient, used for the favicon and the Apple touch icon.
export async function monogram(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: size * 0.22,
        background: `linear-gradient(135deg, ${brand.primary}, ${brand.magenta} 55%, ${brand.accent})`,
        color: brand.background,
        fontFamily: DISPLAY_FONT_FAMILY,
        fontSize: size * 0.46,
        letterSpacing: -size * 0.02,
      }}
    >
      HŞ
    </div>,
    { width: size, height: size, fonts: await loadDisplayFont() }
  );
}
