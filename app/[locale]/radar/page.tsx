import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import RadarBrowser from '@/components/radar/radar-browser';
import { routing } from '@/i18n/routing';
import { getRadar } from '@/lib/feeds/radar';
import { pageMetadata } from '@/lib/page-metadata';

// Same as RADAR_REVALIDATE; route config must be a literal.
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  return pageMetadata(locale, '/radar', 'radarTitle');
}

export default async function Radar({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const msg = await getTranslations({ locale, namespace: 'Radar' });
  const { items, failed } = await getRadar();
  const names = new Intl.ListFormat(locale, { type: 'conjunction' }).format(
    failed.map((source) => msg(`sources.${source}`))
  );

  return (
    <section className="space-y-6 pb-6">
      <header className="pt-2 pb-4">
        <h1 className="max-w-4xl page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>
      </header>

      {items.length === 0 ? (
        <div className="section-shell">
          <p className="text-base text-destructive">{msg('errorTitle')}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {msg('errorText')}
          </p>
        </div>
      ) : (
        <>
          {failed.length > 0 ? (
            <p role="status" className="text-sm text-muted-foreground">
              {msg('unavailable', { sources: names })}
            </p>
          ) : null}
          <RadarBrowser items={items} />
        </>
      )}
    </section>
  );
}
