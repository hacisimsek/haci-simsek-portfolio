import { ArrowUp, ArrowUpRight, MessageSquare, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { RadarItem } from '@/lib/feeds/radar';
import { SEPARATOR } from '@/lib/utils';

// One radar item as a ruled row: source and date, the linked title, then the
// numbers each source ranks by. Comments link to the discussion when there is
// one, so the row holds two links rather than nesting them.
export default function RadarRow({
  item,
  source,
  date,
  count,
}: {
  item: RadarItem;
  source: string;
  date: string;
  count: (value: number) => string;
}) {
  const msg = useTranslations('Radar');
  const stat = 'inline-flex items-center gap-1.5';

  return (
    <li className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_auto]">
      <p className="text-sm text-muted-foreground sm:pt-1">
        <span className="font-medium text-foreground">{source}</span>
        <span className="sm:block">
          <span className="sm:hidden">{SEPARATOR}</span>
          <time dateTime={item.publishedAt}>{date}</time>
        </span>
      </p>

      <div className="min-w-0">
        <h2 lang="en" className="text-lg font-semibold tracking-tight">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-2 break-words transition-colors hover:text-accent"
          >
            {item.title}
            <ArrowUpRight
              aria-hidden
              className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
            />
          </a>
        </h2>
        {item.summary || item.language ? (
          <p lang="en" className="mt-1 text-sm leading-6 text-muted-foreground">
            {[item.summary, item.language].filter(Boolean).join(SEPARATOR)}
          </p>
        ) : null}
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-end sm:pt-1">
        {item.stars !== undefined ? (
          <span className={stat}>
            <Star aria-hidden className="h-4 w-4" />
            <span className="sr-only">
              {msg('stars', { count: item.stars })}
            </span>
            <span aria-hidden>{count(item.stars)}</span>
          </span>
        ) : null}
        {item.points !== undefined ? (
          <span className={stat}>
            <ArrowUp aria-hidden className="h-4 w-4" />
            <span className="sr-only">
              {msg('points', { count: item.points })}
            </span>
            <span aria-hidden>{count(item.points)}</span>
          </span>
        ) : null}
        {item.comments !== undefined ? (
          item.discussion ? (
            <a
              href={item.discussion}
              target="_blank"
              rel="noopener noreferrer"
              className={`${stat} min-h-11 transition-colors hover:text-foreground md:min-h-0`}
            >
              <MessageSquare aria-hidden className="h-4 w-4" />
              <span className="sr-only">
                {msg('discuss')}: {msg('comments', { count: item.comments })}
              </span>
              <span aria-hidden>{count(item.comments)}</span>
            </a>
          ) : (
            <span className={stat}>
              <MessageSquare aria-hidden className="h-4 w-4" />
              <span className="sr-only">
                {msg('comments', { count: item.comments })}
              </span>
              <span aria-hidden>{count(item.comments)}</span>
            </span>
          )
        ) : null}
      </p>
    </li>
  );
}
