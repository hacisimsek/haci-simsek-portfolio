import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import type { RadarItem } from '@/lib/feeds/radar';
import { SEPARATOR } from '@/lib/utils';

// One radar item as a leaderboard row: icon, title and one quiet line on the
// left, the score in its own right-aligned column, and a thin bar under the
// title showing that score against the lane's best. Comments show only where
// they link to the discussion, so the row holds two links rather than
// nesting them.
export default function RadarRow({
  item,
  source,
  date,
  count,
  max,
  fresh,
}: {
  item: RadarItem;
  /** Named only where a lane mixes sources. */
  source?: string;
  date: string;
  count: (value: number) => string;
  /** The lane's highest score, the bar's full width. */
  max: number;
  /** Published since the visitor last came by. */
  fresh: boolean;
}) {
  const msg = useTranslations('Radar');
  const score = item.stars ?? item.points;
  const share = score && max ? score / max : 0;

  return (
    <li className="spotlight grid grid-cols-[1.5rem_minmax(0,1fr)_auto] gap-x-3 py-3.5">
      {/* Avatar or site icon, so the eye can tell rows apart; the title
          beside it carries the meaning. */}
      <Image
        src={item.icon}
        alt=""
        width={24}
        height={24}
        className="mt-0.5 h-6 w-6 rounded-md bg-foreground/5 ring-1 ring-border"
      />
      <div className="min-w-0">
        <h3 lang="en" className="text-base leading-snug font-medium">
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
            className="mt-1 line-clamp-2 text-sm leading-5 break-words text-muted-foreground"
          >
            {item.summary}
          </p>
        ) : null}
        {share ? (
          <div
            aria-hidden
            className="mt-2.5 h-[3px] rounded-full bg-foreground/8"
          >
            <div
              className="h-full rounded-full bg-accent/60"
              style={{ width: `${Math.max(4, share * 100)}%` }}
            />
          </div>
        ) : null}
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">
            {[source, item.language].filter(Boolean).map((part) => (
              <Fragment key={part}>
                {part}
                {SEPARATOR}
              </Fragment>
            ))}
            <time dateTime={item.publishedAt}>{date}</time>
          </span>
          {item.comments !== undefined && item.discussion ? (
            <a
              href={item.discussion}
              target="_blank"
              rel="noopener noreferrer"
              className="-my-3 inline-flex min-h-11 items-center gap-1 py-3 transition-colors hover:text-foreground md:my-0 md:min-h-0 md:py-0"
            >
              <MessageSquare aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">
                {msg('discuss')}: {msg('comments', { count: item.comments })}
              </span>
              <span aria-hidden>{count(item.comments)}</span>
            </a>
          ) : null}
        </p>
      </div>
      {score !== undefined ? (
        <p className="pt-0.5 text-right font-mono text-sm text-foreground tabular-nums">
          <span aria-hidden>
            {count(score)}
            <span className="ml-1 text-xs text-muted-foreground">
              {item.stars !== undefined ? '★' : '▲'}
            </span>
          </span>
          <span className="sr-only">
            {msg(item.stars !== undefined ? 'stars' : 'points', {
              count: score,
            })}
          </span>
        </p>
      ) : (
        <span />
      )}
    </li>
  );
}
