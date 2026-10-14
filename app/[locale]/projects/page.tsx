import type { Metadata } from 'next';
import { alternatesFor } from '@/lib/seo';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Clock3, FolderGit2 } from 'lucide-react';
import { getRepos } from '@/lib/feeds/github';
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
  const msg = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: msg('projectsTitle'),
    alternates: alternatesFor('/projects', locale),
  };
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
    <section className="fade-up space-y-6 pb-6">
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {feed.data.map((project) => (
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-72 flex-col surface-card p-6 transition hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground" />
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {project.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {project.description.length > 180
                    ? `${project.description.slice(0, 180)}...`
                    : project.description}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {project.language ? (
                  <span className="meta-chip">{project.language}</span>
                ) : null}
                <span className="meta-chip">
                  <Clock3 className="mr-2 h-3.5 w-3.5" />
                  {new Date(project.updatedAt).toLocaleDateString(
                    locale === 'tr' ? 'tr-TR' : 'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
