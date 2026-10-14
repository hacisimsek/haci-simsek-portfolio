import { ArrowRight, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import TiltCard from '@/components/motion/tilt-card';
import { Link } from '@/i18n/navigation';
import type { FeaturedRepo } from '@/lib/featured';
import { cn } from '@/lib/utils';

export default function FeaturedProjects({ repos }: { repos: FeaturedRepo[] }) {
  const msg = useTranslations('Home');
  if (repos.length === 0) return null;

  return (
    <section aria-labelledby="featured-projects">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="featured-projects" className="section-title">
            {msg('projectsTitle')}
          </h2>
        </div>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium hover:text-accent"
        >
          {msg('allProjects')}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <TiltCard
            key={repo.url}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group spotlight flex min-h-56 flex-col surface-card p-6 hover:border-accent/40',
              repo.flagship && 'border-beam sm:p-8 md:col-span-2 lg:row-span-2'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                <FolderGit2 aria-hidden className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                {repo.flagship ? (
                  <span className="meta-chip text-accent">
                    {msg('flagship')}
                  </span>
                ) : null}
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground"
                />
              </div>
            </div>
            <h3
              className={cn(
                'mt-6 font-display font-semibold tracking-tight break-words',
                repo.flagship ? 'text-3xl sm:text-4xl' : 'text-xl'
              )}
            >
              {repo.name}
            </h3>
            <p
              className={cn(
                'mt-3 text-sm leading-7 text-muted-foreground',
                repo.flagship ? 'line-clamp-5 sm:text-base' : 'line-clamp-3'
              )}
            >
              {repo.description}
            </p>
            {repo.language ? (
              <span className="mt-auto w-fit pt-6">
                <span className="meta-chip">{repo.language}</span>
              </span>
            ) : null}
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
