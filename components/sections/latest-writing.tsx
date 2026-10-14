import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import ArticleRow from '@/components/articles/article-row';
import { Link } from '@/i18n/navigation';
import type { Article } from '@/lib/feeds/medium';

export default function LatestWriting({ articles }: { articles: Article[] }) {
  const msg = useTranslations('Home');
  const locale = useLocale();
  if (articles.length === 0) return null;
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'Europe/Istanbul',
  });

  return (
    <section aria-labelledby="latest-writing">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="latest-writing" className="section-title">
            {msg('writingTitle')}
          </h2>
        </div>
        <Link
          href="/articles"
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-accent"
        >
          {msg('allArticles')}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </Link>
      </div>

      <ol className="divide-y divide-border/70 border-y border-border/70">
        {articles.map((article) => (
          <ArticleRow
            key={article.url}
            article={article}
            date={date.format(new Date(article.publishedAt))}
          />
        ))}
      </ol>
    </section>
  );
}
