// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import repos from '../../fixtures/github-repos.json';
import { getRepos, selectRepos } from '@/lib/feeds/github';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('selectRepos', () => {
  it('keeps described, original, active repos sorted by last update', () => {
    expect(selectRepos(repos).map((r) => r.name)).toEqual([
      'notifyhub',
      'ecommerce-microservices',
      'url-shortener-service',
    ]);
  });

  it('maps the fields the page renders', () => {
    expect(selectRepos(repos).at(-1)).toEqual({
      name: 'url-shortener-service',
      description: 'URL shortener.',
      url: 'https://github.com/hacisimsek/url-shortener-service',
      language: null,
      updatedAt: '2026-09-01T10:00:00Z',
    });
  });

  it('rejects a payload that is not a repo list', () => {
    expect(() => selectRepos({ message: 'API rate limit exceeded' })).toThrow();
  });
});

describe('getRepos', () => {
  it('requests 100 repos from the configured API with the token', async () => {
    vi.stubEnv('GITHUB_API_URL', 'http://localhost:3101');
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const fetchMock = vi.fn().mockResolvedValue(Response.json(repos));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getRepos()).resolves.toHaveLength(3);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'http://localhost:3101/users/hacisimsek/repos?per_page=100&sort=updated'
    );
    expect(init.headers.Authorization).toBe('Bearer test-token');
    expect(init.next).toEqual({ revalidate: 3600 });
  });

  it('throws on a non-OK response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('rate limited', { status: 403 }))
    );
    await expect(getRepos()).rejects.toThrow('GitHub responded 403');
  });
});
