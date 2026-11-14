// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { featuredProjects, hiddenRepos, repoSummaries } from '@/content';
import { authoredSummary } from '@/lib/featured';

describe('featured projects', () => {
  it('feature five repos, the flagship first', () => {
    expect(featuredProjects.map((project) => project.name)).toEqual([
      'ecommerce-microservices',
      'gateway-bench',
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

  it('gives the gateway benchmark its measured result', () => {
    const { summary } = featuredProjects.find(
      (project) => project.name === 'gateway-bench'
    )!;
    expect(summary.en).toMatch(/20k requests a second.*4\.6k/);
    expect(summary.tr).toMatch(/saniyede 20 bin.*4,6 bin/);
  });

  it('calls the flagship saga choreographed in both languages', () => {
    const { summary } = featuredProjects.find(
      (project) => project.name === 'ecommerce-microservices'
    )!;
    expect(summary.en).toMatch(/choreographed saga over Kafka/);
    expect(summary.tr).toMatch(/koreografi tabanlı bir saga/);
  });
});

describe('other repositories', () => {
  it('leave out this site, mixed collections and early exercises', () => {
    expect(hiddenRepos).toEqual([
      'haci-simsek-portfolio',
      'Java-Spring',
      'SwiftAndIOSApplications',
      'LoadBalancerWithJava',
    ]);
  });

  it('carry an authored line in both languages instead of GitHub text', () => {
    for (const [name, summary] of Object.entries(repoSummaries)) {
      for (const text of [summary.en, summary.tr]) {
        expect(text.trim().length, name).toBeGreaterThan(20);
        expect(text, name).not.toMatch(/^I |designed for scalab/i);
      }
    }
    expect(authoredSummary('url-shortener-service', 'tr')).toBe(
      repoSummaries['url-shortener-service'].tr
    );
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
