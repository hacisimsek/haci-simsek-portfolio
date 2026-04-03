'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpenText } from 'lucide-react';

interface Article {
  title: string;
  description: string;
  guid: string;
  categories?: string[];
  thumbnail?: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@hacisimsek'
        );
        const data = await response.json();
        const items = data.items || [];

        const formattedArticles = items.map((item: any) => ({
          title: item.title,
          description: extractTextFromHTML(item.description),
          guid: item.guid,
          categories: item.categories,
          thumbnail: findImage(item.content),
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  function findImage(htmlString: string) {
    const regex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
    const match = regex.exec(htmlString);
    return match
      ? match[1]
      : 'https://cdn-images-1.medium.com/v2/resize:fit:564/0*-BkwD9DCSLszd2ag.jpg';
  }

  function extractTextFromHTML(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }

  return (
    <section className="space-y-6 pb-6 fade-up">
      <div className="section-shell">
        <div className="eyebrow mb-4">Articles</div>
        <h1 className="page-title">
          Writing where implementation detail meets clear thinking
        </h1>
        <p className="mt-5 page-subtitle">
          Notes, tutorials, and practical engineering breakdowns. I use
          writing to clarify tradeoffs, capture lessons, and make complex work
          easier to reason about.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="surface-card h-56 animate-pulse bg-card/70"
            />
          ))}
        </div>
      ) : hasError ? (
        <div className="section-shell">
          <p className="text-base text-destructive">
            Article feed could not be loaded right now.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            The Medium API bridge may be temporarily unavailable.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <a
              key={article.guid}
              href={article.guid}
              target="_blank"
              rel="noopener noreferrer"
              className="group section-shell block transition hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.45fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                      <BookOpenText className="h-5 w-5" />
                    </div>
                    <span className="meta-chip">Medium</span>
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                    {article.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {article.description.length > 360
                      ? `${article.description.slice(0, 360)}...`
                      : article.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {article.categories?.slice(0, 4).map((category) => (
                      <span key={category} className="meta-chip">
                        #{category}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-secondary/50">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="aspect-[4/3] h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    Read article
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
