// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { experience } from '@/content';
import { buildStats } from '@/lib/stats';

const today = new Date(Date.UTC(2026, 9, 14));

describe('buildStats', () => {
  it('counts years, distinct non-leadership companies, articles and repos', () => {
    expect(
      buildStats({
        careerStart: '2021-06',
        roles: experience,
        articles: 10,
        repos: 24,
        today,
      })
    ).toEqual([
      { id: 'years', value: 5 },
      { id: 'companies', value: 3 },
      { id: 'articles', value: 10 },
      { id: 'repos', value: 24 },
    ]);
  });

  it('omits feed-based stats when a feed is unavailable', () => {
    const ids = buildStats({
      careerStart: '2021-06',
      roles: experience,
      today,
    }).map((stat) => stat.id);
    expect(ids).toEqual(['years', 'companies']);
  });
});
