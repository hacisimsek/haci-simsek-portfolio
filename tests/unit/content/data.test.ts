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

describe('accuracy guards', () => {
  it('describes lottery and terminals as past work and AreaPrivata as current', () => {
    const [sisal] = profile.bio.en;
    expect(sisal).toMatch(/first on the lottery and terminals platform/);
    expect(sisal).toMatch(/now on .*AreaPrivata/);
  });

  it('lists only skills backed by the CV or confirmed by the owner', () => {
    const all = skills.flatMap((c) => c.items);
    expect(all).not.toContain('TypeScript');
    expect(all).not.toContain('API gateway');
  });
});

describe('Turkish translations', () => {
  type Node = unknown;
  const isL10n = (value: Node): value is { en: unknown; tr: unknown } =>
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    'tr' in value;

  function check(value: Node, path: string, problems: string[]) {
    if (isL10n(value)) {
      const { en, tr } = value;
      if (Array.isArray(en)) {
        if (!Array.isArray(tr) || tr.length !== en.length) {
          problems.push(`${path}: array length differs`);
        } else if (tr.some((item) => !String(item).trim())) {
          problems.push(`${path}: empty item`);
        }
      } else if (!String(tr ?? '').trim()) {
        problems.push(`${path}: empty`);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        check(item, `${path}[${index}]`, problems)
      );
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, child] of Object.entries(value)) {
        check(child, `${path}.${key}`, problems);
      }
    }
  }

  it('gives every localized field a Turkish value of the same shape', () => {
    const problems: string[] = [];
    check({ profile, experience, education, skills }, 'content', problems);
    expect(problems).toEqual([]);
  });

  it('keeps the same number of bold markers in both languages', () => {
    const count = (text: string) => (text.match(/\*\*[^*]+\*\*/g) ?? []).length;
    for (const role of experience) {
      role.highlights.en.forEach((line, index) => {
        expect(count(role.highlights.tr[index])).toBe(count(line));
      });
    }
  });
});
