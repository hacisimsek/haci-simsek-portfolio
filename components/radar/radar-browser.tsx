'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import CollectionControls from '@/components/collections/collection-controls';
import EmptyResults from '@/components/collections/empty-results';
import type { RadarItem, RadarKind } from '@/lib/feeds/radar';
import RadarRow from './radar-row';

type Sort = 'top' | 'newest';
const KINDS: RadarKind[] = ['repo', 'news', 'paper', 'post'];
// "Top" mixes sources by their own rank; ties keep this order.
const SOURCES = ['github', 'hn', 'hf', 'devto', 'lobsters', 'simon'];

export function filterRadar(
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

export default function RadarBrowser({ items }: { items: RadarItem[] }) {
  const msg = useTranslations('Radar');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('top');
  const sourceName = (item: RadarItem) => msg(`sources.${item.source}`);
  const shown = filterRadar(items, { query, kind, sort, sourceName });
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Istanbul',
  });
  const count = new Intl.NumberFormat(locale, { notation: 'compact' });

  return (
    <div className="space-y-6">
      <CollectionControls
        query={query}
        onQuery={setQuery}
        placeholder={msg('search')}
        chips={KINDS.filter((value) => items.some((i) => i.kind === value))}
        chipsLabel={msg('kind')}
        chipLabel={(value) => msg(`kinds.${value as RadarKind}`)}
        active={kind}
        onChip={setKind}
        sort={sort}
        sorts={[
          { value: 'top', label: msg('sortTop') },
          { value: 'newest', label: msg('sortNewest') },
        ]}
        onSort={setSort}
        shown={shown.length}
        total={items.length}
      />

      {shown.length === 0 ? (
        <EmptyResults
          onReset={() => {
            setQuery('');
            setKind(null);
          }}
        />
      ) : (
        <ol className="divide-y divide-border/70 border-y border-border/70">
          {shown.map((item) => (
            <RadarRow
              key={item.id}
              item={item}
              source={sourceName(item)}
              date={date.format(new Date(item.publishedAt))}
              count={(value) => count.format(value)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
