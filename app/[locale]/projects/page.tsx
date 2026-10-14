import { setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Clock3, FolderGit2 } from 'lucide-react';
import { getRepos } from '@/lib/feeds/github';
import { loadFeed } from '@/lib/feeds/load';

export const revalidate = 3600;

export default async function Projects({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const feed = await loadFeed(getRepos);

  return (
    <section className="fade-up space-y-6 pb-6">
      <div className="section-shell">
        <div className="mb-4 eyebrow">Projects</div>
        <h1 className="page-title">
          Selected builds, experiments, and engineering curiosities
        </h1>
        <p className="mt-5 page-subtitle">
          A live pull from GitHub that reflects how I build in the open. The
          focus is not just code volume, but the patterns, ideas, and product
          instincts behind each repo.
        </p>
      </div>

      {!feed.ok ? (
        <div className="section-shell">
          <p className="text-base text-destructive">
            Project feed could not be loaded right now.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try again in a moment or visit the GitHub profile directly.
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
                  {new Date(project.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
