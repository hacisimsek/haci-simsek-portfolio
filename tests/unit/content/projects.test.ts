// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { featuredProjects } from '@/content';

describe('featured projects', () => {
  it('feature four repos, the flagship first', () => {
    expect(featuredProjects.map((project) => project.name)).toEqual([
      'ecommerce-microservices',
      'notifyhub',
      'strangler-fig-pattern',
      'circuit-breaker-pattern',
    ]);
    expect(featuredProjects[0].flagship).toBe(true);
  });

  it('carry authored lines in both languages, without the stale claims', () => {
    for (const project of featuredProjects) {
      for (const text of [project.summary.en, project.summary.tr]) {
        expect(text.trim().length, project.name).toBeGreaterThan(20);
        expect(text, project.name).not.toMatch(/ACID|planned|orchestrat/i);
      }
    }
  });

  it('says "serbest bırakılıyor" consistently in Turkish', () => {
    const line = featuredProjects[0].summary.tr;
    expect(line.match(/serbest bırakılıyor/g)).toHaveLength(2);
  });
});
