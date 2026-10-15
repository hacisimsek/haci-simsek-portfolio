import { ArrowUpRight } from 'lucide-react';
import type { Article } from '@/lib/feeds/medium';
import { HIDDEN_TOPICS } from '@/lib/collections';
import { projectTitle } from '@/lib/project-title';
import { cn, SEPARATOR } from '@/lib/utils';

// One article as a ruled list row. The date sits after the title in the DOM
// so the link's name starts with the title, and is moved first visually.
export default function ArticleRow({
  article,
  date,
  heading: Heading = 'h3',
  detailed = false,
}: {
  article: Article;
  date: string;
  heading?: 'h2' | 'h3';
  /** Adds the topics, for the full article list. Medium's excerpts are
   *  truncated and repeat the title, so they are not shown. */
  detailed?: boolean;
}) {
  const topics = article.categories
    .filter((topic) => !HIDDEN_TOPICS.has(topic))
    .slice(0, 4)
    .map(projectTitle);

  return (
    <li>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid gap-x-8 gap-y-2 py-6 transition-colors sm:grid-cols-[9rem_minmax(0,1fr)_auto]"
      >
        <div className="min-w-0">
          <Heading
            lang="en"
            className={cn(
              'font-semibold tracking-tight break-words transition-colors group-hover:text-accent',
              detailed ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
            )}
          >
            {article.title}
          </Heading>
          {detailed && topics.length > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {topics.join(SEPARATOR)}
            </p>
          ) : null}
        </div>
        <time
          dateTime={article.publishedAt}
          className="order-first text-sm text-muted-foreground sm:pt-1"
        >
          {date}
        </time>
        <ArrowUpRight
          aria-hidden
          className="hidden h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground sm:mt-1.5 sm:block"
        />
      </a>
    </li>
  );
}
