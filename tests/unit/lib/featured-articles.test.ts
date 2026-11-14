import { describe, expect, it } from 'vitest';
import { featuredArticles } from '@/content';
import { selectArticles } from '@/lib/featured';

const post = (slug: string, publishedAt: string) => ({
  title: slug,
  url: `https://medium.com/@hacisimsek/${slug}?source=rss`,
  excerpt: '',
  categories: [],
  thumbnail: '',
  publishedAt,
});

const newest = post('ai-rules-c8e15e1d4c27', '2026-11-10T00:00:00Z');
const saga = post(
  'what-is-the-saga-pattern-aaea405280dc',
  '2025-05-11T00:00:00Z'
);
const idempotency = post(
  'what-is-idempotency-6e183cbc433f',
  '2023-06-05T00:00:00Z'
);
const older = post('clean-architecture-db11250cba7a', '2023-11-05T00:00:00Z');

describe('selectArticles', () => {
  it('puts the picks first, in their order, by Medium post id', () => {
    expect(
      selectArticles(
        [newest, saga, older, idempotency],
        ['6e183cbc433f', 'aaea405280dc'],
        2
      ).map((a) => a.title)
    ).toEqual([idempotency.title, saga.title]);
  });

  // A pick that left the feed must not leave the list short.
  it('fills a missing pick with the newest other post', () => {
    expect(
      selectArticles(
        [older, newest, saga],
        ['aaea405280dc', 'gone0000'],
        3
      ).map((a) => a.title)
    ).toEqual([saga.title, newest.title, older.title]);
  });

  it('picks the posts behind the story', () => {
    expect(featuredArticles).toEqual([
      'aaea405280dc', // Saga
      '6e183cbc433f', // Idempotency
      '6c997be77949', // Circuit breaker
      '742f2f52f297', // Strangler fig
    ]);
  });
});
