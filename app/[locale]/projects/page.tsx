import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ProjectBrowser from '@/components/collections/project-browser';
import { getRepos } from '@/lib/feeds/github';
import { pageMetadata } from '@/lib/page-metadata';
import { loadFeed } from '@/lib/feeds/load';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  return pageMetadata(locale, '/projects', 'projectsTitle');
}

export default async function Projects({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const msg = await getTranslations({ locale, namespace: 'Projects' });
  const feed = await loadFeed(getRepos);

  return (
    <section className="space-y-6 pb-6">
      <div className="section-shell">
        <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
        <h1 className="page-title">{msg('title')}</h1>
        <p className="mt-5 page-subtitle">{msg('subtitle')}</p>
      </div>

      {!feed.ok ? (
        <div className="section-shell">
          <p className="text-base text-destructive">{msg('errorTitle')}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {msg('errorText')}
          </p>
        </div>
      ) : (
        <ProjectBrowser repos={feed.data} />
      )}
    </section>
  );
}
