import type { Repo } from '@/lib/feeds/github';
import type { Locale } from '@/content';
import { authoredSummary } from '@/lib/featured';
import { projectTitle } from '@/lib/project-title';
import type { Article } from '@/lib/feeds/medium';
import { fold } from '@/lib/fold';

// Every word of the query must appear somewhere in the fields, ignoring case
// and Turkish diacritics on both sides.
export function matchesQuery(
  fields: (string | null | undefined)[],
  query: string
): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fold(fields.filter(Boolean).join(' '));
  return words.every((word) => haystack.includes(word));
}

export type RepoSort = 'recent' | 'name';

export function filterRepos(
  repos: Repo[],
  {
    query,
    language,
    sort,
    locale = 'en',
  }: {
    query: string;
    language: string | null;
    sort: RepoSort;
    /** Searches the text each row shows, authored lines included. */
    locale?: Locale;
  }
): Repo[] {
  return repos
    .filter((repo) => !language || repo.language === language)
    .filter((repo) =>
      matchesQuery(
        [
          repo.name,
          projectTitle(repo.name),
          authoredSummary(repo.name, locale) ?? repo.description,
          repo.language,
        ],
        query
      )
    )
    .sort((a, b) =>
      sort === 'name'
        ? projectTitle(a.name).localeCompare(projectTitle(b.name), 'en')
        : Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );
}

function byFrequency(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'))
    .map(([value]) => value);
}

export function languagesOf(repos: Repo[]): string[] {
  return byFrequency(
    repos.flatMap((repo) => (repo.language ? [repo.language] : []))
  );
}

export type ArticleSort = 'newest' | 'oldest';

export function filterArticles(
  articles: Article[],
  {
    query,
    category,
    sort,
  }: { query: string; category: string | null; sort: ArticleSort }
): Article[] {
  const direction = sort === 'newest' ? -1 : 1;
  return articles
    .filter((article) => !category || article.categories.includes(category))
    .filter((article) =>
      matchesQuery(
        [article.title, article.excerpt, ...article.categories],
        query.replace(/-/g, ' ')
      )
    )
    .sort(
      (a, b) =>
        direction * (Date.parse(a.publishedAt) - Date.parse(b.publishedAt))
    );
}

// Topics that say where a post was published, not what it is about.
export const HIDDEN_TOPICS = new Set(['we-are-sisal']);

/** The few most-used topics, for the filter chips; search still sees all. */
export function categoriesOf(articles: Article[], limit = 5): string[] {
  return byFrequency(articles.flatMap((article) => article.categories))
    .filter((topic) => !HIDDEN_TOPICS.has(topic))
    .slice(0, limit);
}
