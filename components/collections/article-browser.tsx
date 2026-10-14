'use client';

import { ArrowUpRight, BookOpenText } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
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
  const articleMsg = useTranslations('Articles');
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
        <div className="grid gap-4">
          {shown.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block surface-card p-6 transition-colors hover:border-accent/40 sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.45fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                      <BookOpenText aria-hidden className="h-5 w-5" />
                    </div>
                    <span className="meta-chip">Medium</span>
                    <time
                      dateTime={article.publishedAt}
                      className="text-xs text-muted-foreground"
                    >
                      {date.format(new Date(article.publishedAt))}
                    </time>
                  </div>

                  <h2
                    lang="en"
                    className="mt-5 text-2xl font-semibold tracking-tight group-hover:text-accent"
                  >
                    {article.title}
                  </h2>

                  <p
                    lang="en"
                    className="mt-4 line-clamp-4 text-sm leading-7 text-muted-foreground"
                  >
                    {article.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {article.categories.slice(0, 4).map((name) => (
                      <span key={name} className="meta-chip">
                        #{name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-secondary/50">
                    {/* Medium thumbnails come from several CDN hosts; next/image
                        would need each one allow-listed for little gain here. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.thumbnail}
                      alt=""
                      loading="lazy"
                      className="aspect-4/3 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    {articleMsg('readArticle')}
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
