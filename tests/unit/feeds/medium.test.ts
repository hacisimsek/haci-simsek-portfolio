// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ARTICLE_FALLBACK_THUMBNAIL,
  getArticles,
  parseMediumFeed,
} from '@/lib/feeds/medium';

const xml = readFileSync(
  new URL('../../fixtures/medium-feed.xml', import.meta.url),
  'utf8'
);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('parseMediumFeed', () => {
  it('maps every item in feed order', () => {
    expect(parseMediumFeed(xml).map((a) => a.title)).toEqual([
      'What is the Saga Pattern?',
      'Understanding Circuit Breaker Pattern in Microservices',
      'No Content Post',
    ]);
  });

  it('builds a clean article from a full item', () => {
    expect(parseMediumFeed(xml)[0]).toEqual({
      title: 'What is the Saga Pattern?',
      url: 'https://medium.com/@hacisimsek/what-is-the-saga-pattern-aaea405280dc',
      excerpt:
        'What is the Saga Pattern? Managing distributed transactions & consistency. if (a < b) {}',
      categories: [
        'distributed-transaction',
        'saga-pattern',
        'microservices',
        'orchestration',
        'choreography',
      ],
      thumbnail: 'https://cdn-images-1.medium.com/max/1024/1*saga.png',
      publishedAt: '2025-05-11T07:49:30.000Z',
    });
  });

  it('handles a single category, no images and missing content', () => {
    const [, single, empty] = parseMediumFeed(xml);
    expect(single.categories).toEqual(['resilience']);
    expect(single.thumbnail).toBe(ARTICLE_FALLBACK_THUMBNAIL);
    expect(empty.categories).toEqual([]);
    expect(empty.excerpt).toBe('');
  });

  it('rejects documents that are not an RSS feed', () => {
    expect(() =>
      parseMediumFeed('<html><body>Blocked</body></html>')
    ).toThrow();
  });
});

describe('getArticles', () => {
  it('fetches the configured feed with revalidation', async () => {
    vi.stubEnv('MEDIUM_FEED_URL', 'http://localhost:3101/feed/@hacisimsek');
    const fetchMock = vi.fn().mockResolvedValue(new Response(xml));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getArticles()).resolves.toHaveLength(3);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://localhost:3101/feed/@hacisimsek');
    expect(init.next).toEqual({ revalidate: 21600 });
  });

  it('throws on a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('busy', { status: 503 }))
    );
    await expect(getArticles()).rejects.toThrow('Medium responded 503');
  });
});
