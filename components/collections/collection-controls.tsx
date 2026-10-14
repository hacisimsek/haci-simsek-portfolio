'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Search box, toggle chips and a sort menu shared by the project and article
// browsers.
export default function CollectionControls<Sort extends string>({
  query,
  onQuery,
  placeholder,
  chips,
  chipsLabel,
  active,
  onChip,
  sort,
  sorts,
  onSort,
  shown,
  total,
}: {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  chips: string[];
  chipsLabel: string;
  active: string | null;
  onChip: (value: string | null) => void;
  sort: Sort;
  sorts: { value: Sort; label: string }[];
  onSort: (value: Sort) => void;
  shown: number;
  total: number;
}) {
  const msg = useTranslations('Collections');
  const count = msg('showing', { shown, total });
  // Screen readers hear the count once typing pauses, not on every key.
  const [announced, setAnnounced] = useState(count);
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnounced(count), 400);
    return () => window.clearTimeout(timer);
  }, [count]);
  const chip = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={active === value}
      onClick={() => onChip(value)}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition',
        active === value
          ? 'border-accent bg-accent text-accent-foreground'
          : 'border-border/70 bg-background/60 text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4 glass p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-2 block text-sm font-medium">
            {msg('search')}
          </span>
          <span className="relative block">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder={placeholder}
              className="h-11 w-full rounded-full border border-border/70 bg-background/60 pr-4 pl-11 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </span>
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">{msg('sort')}</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value as Sort)}
            className="h-11 rounded-full border border-border/70 bg-background/60 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {chips.length > 1 ? (
        <div
          role="group"
          aria-label={chipsLabel}
          className="flex flex-wrap gap-2"
        >
          {chip(msg('all'), null)}
          {chips.map((value) => chip(value, value))}
        </div>
      ) : null}
      <p aria-hidden="true" className="text-sm text-muted-foreground">
        {count}
      </p>
      <p role="status" className="sr-only">
        {announced}
      </p>
    </div>
  );
}
