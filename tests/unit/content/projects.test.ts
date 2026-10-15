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
    const line = featuredProjects.find(
      (project) => project.name === 'ecommerce-microservices'
    )!.summary.tr;
    expect(line.match(/serbest bırakılıyor/g)).toHaveLength(2);
    expect(line).not.toMatch(/stok bırakılıyor/);
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
    expect(senior.highlights.en[0]).toMatch(/Sisal’s customer account area/);
    expect(senior.highlights.tr[0]).toMatch(/Sisal’in müşteri hesap alanı/);
    expect(engineer.highlights.en[0]).toMatch(
      /\*\*OSGi\*\* \(a modular Java platform\)/
    );
    expect(engineer.highlights.tr[0]).toMatch(
      /\*\*OSGi\*\* \(modüler Java platformu\)/
    );
  });
});
