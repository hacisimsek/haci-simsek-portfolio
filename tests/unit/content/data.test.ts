// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { education, experience, profile, skills, socials } from '@/content';

describe('experience', () => {
  it('lists roles newest first with the current role open', () => {
    expect(experience.map((r) => r.id)).toEqual([
      'sisal-senior-specialist',
      'sisal-software-engineer',
      'nuevo-software-engineer',
      'telenity-intern',
      'bau-ai-society',
    ]);
    expect(experience[0].end).toBeNull();
  });

  it('has valid, non-overlapping dates per company', () => {
    for (const role of experience) {
      if (role.end) expect(role.end >= role.start).toBe(true);
    }
    const [senior, engineer] = experience;
    expect(engineer.end).toBe(senior.start);
  });

  it('every role has a summary and at least two highlights', () => {
    for (const role of experience) {
      expect(role.summary.en.length).toBeGreaterThan(20);
      expect(role.highlights.en.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('restores the removed details', () => {
    const text = JSON.stringify(experience);
    for (const term of [
      'AreaPrivata',
      'Orion',
      'RabbitMQ',
      'Redis Sentinel',
      'OSGi',
      '5G',
      'API-driven',
      'Lottery and Terminals',
      'AvivaSA',
      'Tavuk Dünyası',
    ]) {
      expect(text).toContain(term);
    }
  });
});

describe('education', () => {
  it('records the major, the minor and the scholarship', () => {
    expect(education.map((e) => e.track)).toEqual(['major', 'minor']);
    expect(JSON.stringify(education)).toContain('Full scholarship');
    expect(JSON.stringify(education)).not.toMatch(/dual degree/i);
  });
});

describe('skills', () => {
  it('includes the confirmed tools exactly once', () => {
    const all = skills.flatMap((c) => c.items);
    for (const tool of [
      'Java',
      'Spring Boot',
      'RabbitMQ',
      'Redis',
      'Kubernetes',
      'ArgoCD',
      'Docker',
      'Kafka',
      'PostgreSQL',
      'MySQL',
      'Grafana',
      'Prometheus',
      'React',
      'Next.js',
    ]) {
      expect(all).toContain(tool);
    }
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('profile and socials', () => {
  it('keeps contact details in one place', () => {
    expect(profile.email).toBe('hacisimsek23@gmail.com');
    expect(socials.map((s) => s.id)).toEqual([
      'github',
      'linkedin',
      'x',
      'medium',
    ]);
    for (const s of socials) expect(s.href.startsWith('https://')).toBe(true);
  });
});
