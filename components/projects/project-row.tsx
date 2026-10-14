import { ArrowUpRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { projectTitle } from '@/lib/project-title';
import type { Repo } from '@/lib/feeds/github';
import { cn, SEPARATOR } from '@/lib/utils';

// One repo as a ruled list row: the readable title leads, the GitHub
// description follows, and language and last update (month and year, the
// same on every page) sit in a quiet meta column.
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
  const msg = useTranslations('Collections');
  const locale = useLocale();
  const updated = new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(new Date(repo.updatedAt));
  const meta = [repo.language, msg('updated', { date: updated })]
    .filter(Boolean)
    .join(SEPARATOR);

  return (
    <li>
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid gap-x-10 gap-y-3 py-7 transition-colors sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        {/* The label sits after the title in the DOM so the link's name
            starts with the title, and is moved above it visually. */}
        <div className="flex min-w-0 flex-col">
          <Heading
            className={cn(
              'font-display font-semibold tracking-tight break-words transition-colors group-hover:text-accent',
              label ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
            )}
          >
            {projectTitle(repo.name)}
          </Heading>
          <p
            className={cn(
              'mt-2 max-w-2xl leading-7 text-muted-foreground',
              label ? 'text-base' : 'text-sm'
            )}
          >
            {repo.description}
          </p>
          {label ? (
            <p className="order-first mb-2 text-sm font-medium text-accent">
              {label}
            </p>
          ) : null}
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
