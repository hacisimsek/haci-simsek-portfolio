import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Article } from '@/lib/feeds/medium';

export default function LatestWriting({ articles }: { articles: Article[] }) {
  const msg = useTranslations('Home');
  const locale = useLocale();
  if (articles.length === 0) return null;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  return (
    <section aria-labelledby="latest-writing" className="fade-up">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 eyebrow w-fit">{msg('writingEyebrow')}</div>
          <h2 id="latest-writing" className="section-title">
            {msg('writingTitle')}
          </h2>
        </div>
        <Link
          href="/articles"
          className="group inline-flex items-center gap-2 text-sm font-medium hover:text-accent"
        >
          {msg('allArticles')}
          <ArrowRight
            aria-hidden
            className="h-4 w-4 transition group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <a
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden glass transition-colors hover:border-accent/40"
          >
            <div className="overflow-hidden">
              {/* Medium thumbnails come from several CDN hosts; next/image
                  would need each one allow-listed for little gain here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnail}
                alt=""
                loading="lazy"
                className="aspect-16/9 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <time
                dateTime={article.publishedAt}
                className="text-xs text-muted-foreground"
              >
                {date.format(new Date(article.publishedAt))}
              </time>
              <h3 className="mt-2 leading-snug font-semibold group-hover:text-accent">
                {article.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
