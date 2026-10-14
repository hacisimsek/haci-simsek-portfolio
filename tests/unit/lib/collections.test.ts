// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { filterRepos, languagesOf, matchesQuery } from '@/lib/collections';

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
