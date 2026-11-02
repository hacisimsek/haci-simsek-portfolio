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

  it('calls the flagship saga choreographed in both languages', () => {
    const { summary } = featuredProjects.find(
      (project) => project.name === 'ecommerce-microservices'
    )!;
    expect(summary.en).toMatch(/choreographed saga over Kafka/);
    expect(summary.tr).toMatch(/koreografi tabanlı bir saga/);
  });
});

describe('career glossary', () => {
  it('explains AreaPrivata and OSGi where they first appear', async () => {
    const { profile, experience } = await import('@/content');
    expect(profile.bio.en.join(' ')).toMatch(
      /AreaPrivata, Sisal’s customer account area/
    );
    expect(profile.bio.tr.join(' ')).toMatch(
      /Sisal’in müşteri hesap alanı AreaPrivata/
    );
    const [senior, engineer] = experience;
    const first = (lines: string[], term: string) =>
      lines.find((line) => line.includes(term)) ?? '';
    expect(first(senior.highlights.en, 'AreaPrivata')).toMatch(
      /Sisal’s customer account area/
    );
    expect(first(senior.highlights.tr, 'AreaPrivata')).toMatch(
      /Sisal’in müşteri hesap alanı/
    );
    expect(first(engineer.highlights.en, 'OSGi')).toMatch(
      /\*\*OSGi\*\* \(a modular Java platform\)/
    );
    expect(first(engineer.highlights.tr, 'OSGi')).toMatch(
      /\*\*OSGi\*\* \(modüler Java platformu\)/
    );
  });
});
