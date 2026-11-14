'use client';

import { FileText, FolderGit2, Newspaper, PenLine, Search } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import EmptyResults from '@/components/collections/empty-results';
import type { RadarItem, RadarKind, RadarPick } from '@/lib/feeds/radar';
import { cn } from '@/lib/utils';
import RadarRow, { RadarIcon } from './radar-row';

type Sort = 'top' | 'newest';
const KINDS: RadarKind[] = ['repo', 'news', 'paper', 'post'];
const LANE_ICONS = {
  repo: FolderGit2,
  news: Newspaper,
  paper: FileText,
  post: PenLine,
};
// "Top" mixes sources by their own rank; ties keep this order.
const SOURCES = ['github', 'hn', 'hf', 'devto', 'lobsters', 'simon'];
// Rows a lane shows before "Show all".
const LANE = 6;
const SEEN_KEY = 'radar:seen';
// Visits closer together than this count as one, so a reload keeps the dots.
const VISIT_GAP = 30 * 60_000;

function filterRadar(
  items: RadarItem[],
  {
    query,
    kind,
    sort,
    sourceName,
  }: {
    query: string;
    kind: string | null;
    sort: Sort;
    sourceName: (item: RadarItem) => string;
  }
) {
  const needle = query.trim().toLocaleLowerCase();
  return items
    .filter((item) => !kind || item.kind === kind)
    .filter(
      (item) =>
        !needle ||
        [item.title, item.summary, item.language ?? '', sourceName(item)]
          .join(' ')
          .toLocaleLowerCase()
          .includes(needle)
    )
    .sort((a, b) =>
      sort === 'newest'
        ? Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
        : a.rank - b.rank ||
          SOURCES.indexOf(a.source) - SOURCES.indexOf(b.source)
    );
}

// undefined until read once per page load; null on a first visit.
let lastVisit: number | null | undefined;

/** When the visitor was last here, kept only in their own browser. */
function readLastVisit() {
  if (lastVisit !== undefined) return lastVisit;
  try {
    const now = Date.now();
    const saved = JSON.parse(localStorage.getItem(SEEN_KEY) ?? 'null') as {
      since: number | null;
      at: number;
    } | null;
    lastVisit =
      saved && now - saved.at < VISIT_GAP ? saved.since : (saved?.at ?? null);
    localStorage.setItem(
      SEEN_KEY,
      JSON.stringify({ since: lastVisit, at: now })
    );
  } catch {
    // Storage blocked: no dots, nothing else changes.
    lastVisit = null;
  }
  return lastVisit;
}
const noSubscribe = () => () => {};

export default function RadarBrowser({
  items,
  picks,
}: {
  items: RadarItem[];
  picks: RadarPick[];
}) {
  const msg = useTranslations('Radar');
  const collections = useTranslations('Collections');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('top');
  const [open, setOpen] = useState<RadarKind[]>([]);
  const since = useSyncExternalStore(noSubscribe, readLastVisit, () => null);
  const sourceName = (item: RadarItem) => msg(`sources.${item.source}`);
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Istanbul',
  });
  const count = new Intl.NumberFormat(locale, { notation: 'compact' });
  const fresh = (item: RadarItem) =>
    since !== null && Date.parse(item.publishedAt) > since;
  const searching = query.trim() !== '';
  const lanes = KINDS.map((kind) => ({
    kind,
    items: filterRadar(items, { query, kind, sort, sourceName }),
  })).filter((lane) => lane.items.length > 0);
  const freshCount = items.filter(fresh).length;

  const row = (item: RadarItem, max: number) => (
    <RadarRow
      key={item.id}
      item={item}
      max={max}
      source={item.kind === 'post' ? sourceName(item) : undefined}
      date={date.format(new Date(item.publishedAt))}
      count={(value) => count.format(value)}
      fresh={fresh(item)}
    />
  );

  return (
    <div className="space-y-8">
      {picks.length > 0 && !searching ? (
        <section aria-labelledby="radar-picks">
          <h2
            id="radar-picks"
            className="mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase"
          >
            {msg('picks')}
          </h2>
          {/* Phones swipe through the picks; wider screens show them side by side. */}
          <ul className="flex snap-x snap-mandatory gap-px overflow-x-auto rounded-2xl border border-border/70 bg-border/70 sm:grid sm:grid-cols-2 sm:overflow-hidden lg:grid-cols-4">
            {picks.map(({ item, signal }) => (
              <li
                key={item.id}
                className="group spotlight relative w-[78%] shrink-0 snap-start bg-card p-4 [--spotlight-bleed:0] sm:w-auto"
              >
                {/* The picture when the source has one; otherwise, and if it
                    fails to load, the site icon on a quiet tile. */}
                <div className="relative -mx-4 -mt-4 mb-4 aspect-[2/1] overflow-hidden border-b border-border/60 bg-foreground/5">
                  <RadarIcon
                    item={item}
                    size={40}
                    className="absolute inset-0 m-auto h-10 w-10 rounded-lg"
                  />
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 78vw"
                      // Screenshots of white pages glare in the dark theme;
                      // they come up to full brightness on hover.
                      className="object-cover transition-[filter] duration-300 dark:brightness-[0.72] dark:group-hover:brightness-100"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  ) : null}
                </div>
                <p className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{msg(`kinds.${item.kind}`)}</span>
                  <span className="font-mono text-accent tabular-nums">
                    {item.kind === 'repo' ? (
                      <>
                        <span aria-hidden>
                          {msg('perDayShort', { count: count.format(signal) })}
                        </span>
                        <span className="sr-only">
                          {msg('perDay', { count: signal })}
                        </span>
                      </>
                    ) : (
                      msg('pointsShort', {
                        n: signal,
                        count: count.format(signal),
                      })
                    )}
                  </span>
                </p>
                <h3
                  lang="en"
                  className="mt-2 line-clamp-2 leading-snug font-medium"
                >
                  {/* The whole card is the link's hit area. */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 hover:text-accent focus-visible:outline-hidden focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  >
                    {item.title}
                  </a>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sourceName(item)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-80">
          <span className="sr-only">{collections('search')}</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={msg('search')}
            className="h-11 w-full rounded-full border border-border/70 bg-background/60 pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10"
          />
        </label>
        <div className="flex items-center gap-4">
          {freshCount > 0 ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent"
              />
              {msg('newSince', { count: freshCount })}
            </p>
          ) : null}
          <div
            role="group"
            aria-label={msg('sort')}
            className="inline-flex rounded-full border border-border/70 p-0.5 text-xs"
          >
            {(['top', 'newest'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={sort === value}
                onClick={() => setSort(value)}
                className={cn(
                  'min-h-11 rounded-full px-3 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden md:min-h-8',
                  sort === value
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {msg(value === 'top' ? 'sortTop' : 'sortNewest')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lanes.length === 0 ? (
        <EmptyResults onReset={() => setQuery('')} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {lanes.map((lane) => {
            const all = searching || open.includes(lane.kind);
            const Icon = LANE_ICONS[lane.kind];
            // Per source: Posts mixes DEV reactions with Lobsters votes.
            const best = new Map<string, number>();
            for (const item of lane.items) {
              const score = item.stars ?? item.points ?? 0;
              best.set(
                item.source,
                Math.max(best.get(item.source) ?? 0, score)
              );
            }
            return (
              <section
                key={lane.kind}
                aria-labelledby={`lane-${lane.kind}`}
                className="min-w-0 rounded-2xl border border-border bg-card px-5 pt-5 pb-3"
              >
                <header className="flex items-start gap-3 border-b border-border pb-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon aria-hidden className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2
                      id={`lane-${lane.kind}`}
                      className="flex items-baseline justify-between gap-3 font-display text-lg font-semibold"
                    >
                      {msg(`kinds.${lane.kind}`)}
                      <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                        {lane.items.length}
                      </span>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {msg(`lanes.${lane.kind}`)}
                    </p>
                  </div>
                </header>
                <ol className="divide-y divide-border">
                  {(all ? lane.items : lane.items.slice(0, LANE)).map((item) =>
                    row(item, best.get(item.source) ?? 0)
                  )}
                </ol>
                {!searching && lane.items.length > LANE ? (
                  <button
                    type="button"
                    aria-expanded={all}
                    onClick={() =>
                      setOpen((kinds) =>
                        all
                          ? kinds.filter((kind) => kind !== lane.kind)
                          : [...kinds, lane.kind]
                      )
                    }
                    className="mt-1 min-h-11 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden md:min-h-8"
                  >
                    {all
                      ? msg('showLess')
                      : msg('showAll', { count: lane.items.length })}
                  </button>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
      <p role="status" className="sr-only">
        {searching
          ? collections('showing', {
              shown: lanes.reduce((n, lane) => n + lane.items.length, 0),
              total: items.length,
            })
          : null}
      </p>
    </div>
  );
}
