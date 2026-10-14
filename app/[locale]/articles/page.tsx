import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ArticleBrowser from '@/components/collections/article-browser';
import { loadFeed } from '@/lib/feeds/load';
import { pageMetadata } from '@/lib/page-metadata';
import { getArticles } from '@/lib/feeds/medium';

export const revalidate = 21600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  return pageMetadata(locale, '/articles', 'articlesTitle');
}

export default async function Articles({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const msg = await getTranslations({ locale, namespace: 'Articles' });
  const feed = await loadFeed(getArticles);

  return (
    <section className="space-y-6 pb-6">
      <header className="pt-2 pb-4">
        <h1 className="max-w-4xl page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>
      </header>

      {!feed.ok ? (
        <div className="section-shell">
          <p className="text-base text-destructive">{msg('errorTitle')}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {msg('errorText')}
          </p>
        </div>
      ) : (
        <ArticleBrowser articles={feed.data} />
      )}
    </section>
  );
}
