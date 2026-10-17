import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { profile, t } from '@/content';
import { routing } from '@/i18n/routing';
import { brand } from '@/lib/og/brand';
import { DISPLAY_FONT_FAMILY, loadDisplayFont } from '@/lib/og/font';

const size = { width: 1200, height: 630 };

// One image per locale, so the alt text can be in that language.
export function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = hasLocale(routing.locales, params.locale)
    ? params.locale
    : routing.defaultLocale;
  return [
    {
      id: 'card',
      size,
      contentType: 'image/png',
      alt: `${profile.name} · ${t(profile.title, locale)}`,
    },
  ];
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
  id: Promise<string>;
}) {
  const { locale } = await params;
  // Only real locales get a card; anything else is a 404, not an English image.
  if (!hasLocale(routing.locales, locale)) notFound();
  const msg = await getTranslations({ locale, namespace: 'Hero' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        color: brand.foreground,
        fontFamily: DISPLAY_FONT_FAMILY,
        backgroundColor: brand.background,
        backgroundImage: [
          `radial-gradient(circle at 12% 0%, ${brand.primary}66, transparent 45%)`,
          `radial-gradient(circle at 100% 30%, ${brand.accent}55, transparent 45%)`,
          `radial-gradient(circle at 60% 120%, ${brand.magenta}55, transparent 50%)`,
        ].join(', '),
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 26,
          letterSpacing: 6,
          color: brand.muted,
        }}
      >
        {/* Satori uppercases without Turkish rules (i → I, not İ). */}
        {msg('eyebrow').toLocaleUpperCase(locale)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            letterSpacing: -4,
            lineHeight: 1,
            backgroundImage: `linear-gradient(100deg, ${brand.foreground} 30%, ${brand.primary} 65%, ${brand.accent})`,
            backgroundClip: 'text',
            color: 'transparent',
            paddingBottom: 16,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            lineHeight: 1.25,
            color: brand.muted,
            maxWidth: 960,
          }}
        >
          {t(profile.headline, locale)}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 26,
          color: brand.muted,
        }}
      >
        <span style={{ color: brand.accent }}>{t(profile.role, locale)}</span>
        <span>hacisimsek.com</span>
      </div>
    </div>,
    { ...size, fonts: await loadDisplayFont() }
  );
}
