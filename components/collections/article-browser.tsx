'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import ArticleRow from '@/components/articles/article-row';
import {
  categoriesOf,
  filterArticles,
  type ArticleSort,
} from '@/lib/collections';
import type { Article } from '@/lib/feeds/medium';
import CollectionControls from './collection-controls';
import EmptyResults from './empty-results';

export default function ArticleBrowser({ articles }: { articles: Article[] }) {
  const msg = useTranslations('Collections');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<ArticleSort>('newest');
  const shown = filterArticles(articles, { query, category, sort });
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'Europe/Istanbul',
  });

  function reset() {
    setQuery('');
    setCategory(null);
  }

  return (
    <div className="space-y-6">
      <CollectionControls
        query={query}
        onQuery={setQuery}
        placeholder={msg('searchArticles')}
        chips={categoriesOf(articles)}
        chipsLabel={msg('category')}
        active={category}
        onChip={setCategory}
        sort={sort}
        sorts={[
          { value: 'newest', label: msg('sortNewest') },
          { value: 'oldest', label: msg('sortOldest') },
        ]}
        onSort={setSort}
        shown={shown.length}
        total={articles.length}
      />

      {shown.length === 0 ? (
        <EmptyResults onReset={reset} />
      ) : (
        <ol className="divide-y divide-border/70 border-y border-border/70">
          {shown.map((article) => (
            <ArticleRow
              key={article.url}
              article={article}
              heading="h2"
              detailed
              date={date.format(new Date(article.publishedAt))}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
