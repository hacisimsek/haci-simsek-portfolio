'use client';

import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import EmptyResults from '@/components/collections/empty-results';
import type { RadarItem, RadarKind, RadarPick } from '@/lib/feeds/radar';
import { cn } from '@/lib/utils';
import RadarRow from './radar-row';

type Sort = 'top' | 'newest';
const KINDS: RadarKind[] = ['repo', 'news', 'paper', 'post'];
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

  const row = (item: RadarItem, index: number) => (
    <RadarRow
      key={item.id}
      item={item}
      rank={sort === 'top' ? index + 1 : undefined}
      source={sourceName(item)}
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
                className="spotlight relative w-[78%] shrink-0 snap-start bg-background p-4 [--spotlight-bleed:0] sm:w-auto"
              >
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
                      msg('points', { count: count.format(signal) })
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
            className="h-10 w-full rounded-full border border-border/70 bg-background/60 pr-4 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {lanes.map((lane) => {
            const all = searching || open.includes(lane.kind);
            return (
              <section
                key={lane.kind}
                aria-labelledby={`lane-${lane.kind}`}
                className="min-w-0"
              >
                <h2
                  id={`lane-${lane.kind}`}
                  className="flex items-baseline justify-between border-b border-border/70 pb-2 text-sm font-semibold"
                >
                  {msg(`kinds.${lane.kind}`)}
                  <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                    {lane.items.length}
                  </span>
                </h2>
                <ol className="divide-y divide-border/50">
                  {(all ? lane.items : lane.items.slice(0, LANE)).map(row)}
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
