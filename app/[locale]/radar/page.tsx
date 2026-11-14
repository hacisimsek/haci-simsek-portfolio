import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import RadarBrowser from '@/components/radar/radar-browser';
import { routing } from '@/i18n/routing';
import { getRadar, pickRadar } from '@/lib/feeds/radar';
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
  const { items, failed, fetchedAt: now } = await getRadar();
  const updated = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Istanbul',
    // Visitors elsewhere would read Istanbul's clock as their own.
    timeZoneName: 'short',
  }).format(now);
  const names = new Intl.ListFormat(locale, { type: 'conjunction' }).format(
    failed.map((source) => msg(`sources.${source}`))
  );

  return (
    <section className="space-y-6 pb-6">
      <header className="pt-2">
        <h1 className="max-w-4xl page-title">{msg('title')}</h1>
        <p className="mt-3 page-subtitle">
          {msg('subtitle')}{' '}
          <time
            dateTime={new Date(now).toISOString()}
            className="text-foreground/80"
          >
            {msg('updated', { time: updated })}
          </time>
        </p>
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
          <RadarBrowser items={items} picks={pickRadar(items, now)} />
        </>
      )}
    </section>
  );
}
