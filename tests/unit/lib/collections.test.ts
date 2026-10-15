// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  categoriesOf,
  filterArticles,
  filterRepos,
  languagesOf,
  matchesQuery,
} from '@/lib/collections';

const repo = (
  name: string,
  language: string | null,
  updatedAt: string,
  description = `${name} service`
) => ({
  name,
  description,
  url: `https://github.com/hacisimsek/${name}`,
  language,
  updatedAt,
});

const repos = [
  repo('notifyhub', 'Java', '2026-03-01T00:00:00Z', 'Reminder platform'),
  repo('bff-application', 'Java', '2026-05-01T00:00:00Z'),
  repo('wordly', 'TypeScript', '2026-01-01T00:00:00Z', 'Kelime oyunu, özel'),
];

describe('matchesQuery', () => {
  it('ignores case and Turkish diacritics in both directions', () => {
    expect(matchesQuery(['Hacı Şimşek'], 'haci simsek')).toBe(true);
    expect(matchesQuery(['İstanbul'], 'ISTANBUL')).toBe(true);
    expect(matchesQuery(['ozel'], 'Özel')).toBe(true);
  });

  it('needs every word somewhere in the fields', () => {
    expect(matchesQuery(['bff-application', 'Java'], 'java bff')).toBe(true);
    expect(matchesQuery(['bff-application', 'Java'], 'java kafka')).toBe(false);
  });

  it('matches everything for an empty query and skips missing fields', () => {
    expect(matchesQuery(['x', null, undefined], '   ')).toBe(true);
  });
});

describe('filterRepos', () => {
  const names = (list: { name: string }[]) => list.map((r) => r.name);

  it('searches name, description and language', () => {
    expect(
      names(
        filterRepos(repos, {
          query: 'reminder',
          language: null,
          sort: 'recent',
        })
      )
    ).toEqual(['notifyhub']);
    expect(
      names(
        filterRepos(repos, { query: 'ozel', language: null, sort: 'recent' })
      )
    ).toEqual(['wordly']);
  });

  it('finds and sorts repos by the title people read', () => {
    const shown = [
      repo('ecommerce-microservices', 'Java', '2026-02-01T00:00:00Z'),
      repo('apple', 'Java', '2026-02-01T00:00:00Z'),
    ];
    expect(
      names(
        filterRepos(shown, {
          query: 'e-commerce',
          language: null,
          sort: 'recent',
        })
      )
    ).toEqual(['ecommerce-microservices']);
    // By slug "spring-cloud" sorts first; by title "Spring Boot app" does.
    expect(
      names(
        filterRepos(
          [
            repo('spring-cloud', null, '2026-01-01T00:00:00Z'),
            repo('springboot-app', null, '2026-01-01T00:00:00Z'),
          ],
          { query: '', language: null, sort: 'name' }
        )
      )
    ).toEqual(['springboot-app', 'spring-cloud']);
  });

  it('searches the authored line a featured repo shows', () => {
    // notifyhub shows "…Kafka…" instead of its GitHub description.
    expect(
      names(
        filterRepos(repos, {
          query: 'kafka',
          language: null,
          sort: 'recent',
          locale: 'tr',
        })
      )
    ).toEqual(['notifyhub']);
  });

  it('filters by language and sorts by recency or name', () => {
    expect(
      names(filterRepos(repos, { query: '', language: 'Java', sort: 'recent' }))
    ).toEqual(['bff-application', 'notifyhub']);
    expect(
      names(filterRepos(repos, { query: '', language: null, sort: 'name' }))
    ).toEqual(['bff-application', 'notifyhub', 'wordly']);
  });
});

describe('languagesOf', () => {
  it('lists languages by how often they appear', () => {
    expect(
      languagesOf([...repos, repo('x', null, '2026-01-01T00:00:00Z')])
    ).toEqual(['Java', 'TypeScript']);
  });
});

const article = (
  title: string,
  categories: string[],
  publishedAt: string,
  excerpt = ''
) => ({
  title,
  url: `https://medium.com/@hacisimsek/${title}`,
  excerpt,
  categories,
  thumbnail: '',
  publishedAt,
});

const articles = [
  article('Saga', ['microservices', 'saga-pattern'], '2025-05-11T00:00:00Z'),
  article(
    'Breaker',
    ['resilience', 'microservices'],
    '2024-01-01T00:00:00Z',
    'Stop cascading failures'
  ),
  article('Empty', [], '2024-01-02T00:00:00Z'),
];

describe('filterArticles', () => {
  const titles = (list: { title: string }[]) => list.map((a) => a.title);

  it('searches title, excerpt and categories', () => {
    expect(
      titles(
        filterArticles(articles, {
          query: 'cascading',
          category: null,
          sort: 'newest',
        })
      )
    ).toEqual(['Breaker']);
    expect(
      titles(
        filterArticles(articles, {
          query: 'saga pattern',
          category: null,
          sort: 'newest',
        })
      )
    ).toEqual(['Saga']);
  });

  it('filters by category and sorts by date', () => {
    expect(
      titles(
        filterArticles(articles, {
          query: '',
          category: 'microservices',
          sort: 'newest',
        })
      )
    ).toEqual(['Saga', 'Breaker']);
    expect(
      titles(
        filterArticles(articles, { query: '', category: null, sort: 'oldest' })
      )
    ).toEqual(['Breaker', 'Empty', 'Saga']);
  });
});

describe('categoriesOf', () => {
  it('lists the most used categories first, capped', () => {
    expect(categoriesOf(articles)).toEqual([
      'microservices',
      'resilience',
      'saga-pattern',
    ]);
    expect(categoriesOf(articles, 1)).toEqual(['microservices']);
  });
});
