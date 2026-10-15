import { ArrowUpRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { authoredSummary } from '@/lib/featured';
import { projectTitle } from '@/lib/project-title';
import type { Repo } from '@/lib/feeds/github';
import { cn } from '@/lib/utils';

// One repo as a ruled list row: the readable title leads, its summary
// (authored for featured repos, GitHub's otherwise) follows, and the language
// sits in a quiet meta column. No "updated" date: bulk pushes made it noise.
export default function ProjectRow({
  repo,
  heading: Heading = 'h3',
  label,
}: {
  repo: Repo;
  heading?: 'h2' | 'h3';
  /** Plain accent text above the title, e.g. "Flagship". */
  label?: string;
}) {
  const locale = useLocale();
  // Featured repos carry an authored line; others keep GitHub's description.
  const summary = authoredSummary(repo.name, locale) ?? repo.description;
  const meta = repo.language;

  return (
    <li>
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid gap-x-10 gap-y-3 py-7 transition-colors sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        {/* The label follows the title, so the link's name starts with the
            title and no kicker sits above it. */}
        <div className="flex min-w-0 flex-col">
          <Heading
            className={cn(
              'font-display font-semibold tracking-tight break-words transition-colors group-hover:text-accent',
              label ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
            )}
          >
            {projectTitle(repo.name)}
          </Heading>
          {label ? (
            <p className="mt-1 text-sm font-medium text-accent">{label}</p>
          ) : null}
          <p
            className={cn(
              'mt-2 max-w-2xl leading-7 text-muted-foreground',
              label ? 'text-base' : 'text-sm'
            )}
          >
            {summary}
          </p>
        </div>
        <p className="flex items-start gap-3 text-sm text-muted-foreground sm:justify-end sm:pt-1.5">
          <span>{meta}</span>
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 shrink-0 transition-colors group-hover:text-foreground"
          />
        </p>
      </a>
    </li>
  );
}
