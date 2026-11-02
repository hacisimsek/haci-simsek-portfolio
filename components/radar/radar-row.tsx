import { ArrowUp, MessageSquare, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { RadarItem } from '@/lib/feeds/radar';

// One radar item as a dense row: rank, the linked title, then one line of
// numbers, source and date. Comments link to the discussion when there is
// one, so the row holds two links rather than nesting them.
export default function RadarRow({
  item,
  rank,
  source,
  date,
  count,
  fresh,
}: {
  item: RadarItem;
  /** 1-based place in its lane; omitted when sorted by date. */
  rank?: number;
  source: string;
  date: string;
  count: (value: number) => string;
  /** Published since the visitor last came by. */
  fresh: boolean;
}) {
  const msg = useTranslations('Radar');
  const stat = 'inline-flex items-center gap-1';
  const meta: React.ReactNode[] = [];

  if (item.stars !== undefined) {
    meta.push(
      <span key="stars" className={stat}>
        <Star aria-hidden className="h-3.5 w-3.5" />
        <span className="sr-only">{msg('stars', { count: item.stars })}</span>
        <span aria-hidden>{count(item.stars)}</span>
      </span>
    );
  }
  if (item.points !== undefined) {
    meta.push(
      <span key="points" className={stat}>
        <ArrowUp aria-hidden className="h-3.5 w-3.5" />
        <span className="sr-only">{msg('points', { count: item.points })}</span>
        <span aria-hidden>{count(item.points)}</span>
      </span>
    );
  }
  if (item.comments !== undefined) {
    const label = (
      <>
        <MessageSquare aria-hidden className="h-3.5 w-3.5" />
        <span className="sr-only">
          {item.discussion ? `${msg('discuss')}: ` : null}
          {msg('comments', { count: item.comments })}
        </span>
        <span aria-hidden>{count(item.comments)}</span>
      </>
    );
    meta.push(
      item.discussion ? (
        <a
          key="comments"
          href={item.discussion}
          target="_blank"
          rel="noopener noreferrer"
          className={`${stat} -my-3 py-3 transition-colors hover:text-foreground md:my-0 md:py-0`}
        >
          {label}
        </a>
      ) : (
        <span key="comments" className={stat}>
          {label}
        </span>
      )
    );
  }

  return (
    <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 py-3">
      <span
        aria-hidden
        className="pt-0.5 font-mono text-xs text-muted-foreground tabular-nums"
      >
        {rank ? String(rank).padStart(2, '0') : null}
      </span>
      <div className="min-w-0">
        <h3 lang="en" className="text-[0.9375rem] leading-snug font-medium">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-2 break-words transition-colors hover:text-accent"
          >
            {fresh ? (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-accent">
                <span className="sr-only">{msg('new')}: </span>
              </span>
            ) : null}
            {item.title}
          </a>
        </h3>
        {item.summary ? (
          <p
            lang="en"
            className="mt-0.5 truncate text-xs text-muted-foreground"
            title={item.summary}
          >
            {item.summary}
          </p>
        ) : null}
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {meta}
          <span className="whitespace-nowrap">
            {source}
            {item.language ? ` · ${item.language}` : null}
            {' · '}
            <time dateTime={item.publishedAt}>{date}</time>
          </span>
        </p>
      </div>
    </li>
  );
}
