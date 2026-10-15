// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { selectFeatured } from '@/lib/featured';

const repo = (name: string, updatedAt = '2026-01-01T00:00:00Z') => ({
  name,
  description: name,
  url: `https://github.com/hacisimsek/${name}`,
  language: 'Java',
  updatedAt,
});
const featured = [
  { name: 'ecommerce-microservices', flagship: true },
  { name: 'notifyhub' },
  { name: 'circuit-breaker-pattern' },
];

describe('selectFeatured', () => {
  it('puts featured repos first, flagship marked, then fills with recent ones', () => {
    const result = selectFeatured(
      [
        repo('x', '2026-05-01T00:00:00Z'),
        repo('notifyhub'),
        repo('ecommerce-microservices'),
      ],
      featured
    );
    expect(result.map((r) => [r.name, r.flagship])).toEqual([
      ['ecommerce-microservices', true],
      ['notifyhub', false],
      ['x', false],
    ]);
  });

  it('handles an empty feed and a missing flagship', () => {
    expect(selectFeatured([], featured)).toEqual([]);
    expect(selectFeatured([repo('notifyhub')], featured)[0].flagship).toBe(
      false
    );
  });

  it('caps the list', () => {
    const many = Array.from({ length: 10 }, (_, i) => repo(`r${i}`));
    expect(selectFeatured(many, featured)).toHaveLength(6);
  });
});

describe('selectFeatured without fill', () => {
  it('returns only the picks the feed has, never a stand-in', () => {
    const result = selectFeatured(
      [repo('x', '2026-05-01T00:00:00Z'), repo('notifyhub')],
      featured,
      featured.length,
      { fill: false }
    );
    expect(result.map((r) => r.name)).toEqual(['notifyhub']);
  });
});
