import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ProjectRow from '@/components/projects/project-row';
import SagaFlow from '@/components/saga/saga-flow';
import { Link } from '@/i18n/navigation';
import type { FeaturedRepo } from '@/lib/featured';

export default function FeaturedProjects({ repos }: { repos: FeaturedRepo[] }) {
  const msg = useTranslations('Home');
  if (repos.length === 0) return null;
  // The saga demo belongs to the flagship repo, so it sits beside the list
  // when the flagship is there.
  const demo = repos.some((repo) => repo.flagship);

  return (
    <section aria-labelledby="featured-projects">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="featured-projects" className="section-title">
          {msg('projectsTitle')}
        </h2>
        <Link
          href="/projects"
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-accent"
        >
          {msg('allProjects')}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div
        className={
          demo
            ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start'
            : undefined
        }
      >
        <ol className="divide-y divide-border/70 border-y border-border/70">
          {repos.map((repo) => (
            <ProjectRow
              key={repo.url}
              repo={repo}
              label={repo.flagship ? msg('flagship') : undefined}
            />
          ))}
        </ol>
        {demo ? <SagaFlow /> : null}
      </div>
    </section>
  );
}
