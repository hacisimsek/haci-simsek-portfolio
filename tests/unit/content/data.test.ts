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
      'RabbitMQ',
      'Redis Sentinel',
      'OSGi',
      '5G',
      'API-driven',
      'Lottery and Terminals',
      'AvivaSA',
      'Tavuk Dünyası',
      'VAS and Messaging',
      'Java 21',
      'SOAP',
      'Argo CD',
      'NestJS',
      'MongoDB',
    ]) {
      expect(text).toContain(term);
    }
  });

  it('drops the Orion module', () => {
    expect(JSON.stringify({ profile, experience })).not.toMatch(/Orion/);
  });

  it('leads the current role with the Java 21 migration', () => {
    const [senior] = experience;
    expect(senior.highlights.en[0]).toMatch(
      /Spring Boot 2\.x.*3\.x.*Java 11.*21.*30\+ modules.*\*\*Java 21\*\*/
    );
    expect(senior.highlights.tr[0]).toMatch(
      /30’dan fazla modül.*\*\*Java 21\*\*/
    );
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
    const all = skills.flatMap((c) => c.items.en);
    for (const tool of [
      'Java 11/17/21',
      'Spring Boot',
      'Spring MVC',
      'Spring Data JPA',
      'Spring Security',
      'Hibernate',
      'JDBC',
      'TypeScript',
      'NestJS',
      'SOAP',
      'Idempotency',
      'MongoDB',
      'Jenkins',
      'GitLab CI/CD',
      'SonarQube',
      'JUnit 5',
      'Mockito',
      'TDD',
      'Splunk',
      'Dynatrace',
      'RabbitMQ',
      'Redis',
      'Kubernetes',
      'Argo CD',
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

describe('profile', () => {
  it('leads with the CV title and keeps the Sisal title as the role', () => {
    expect(profile.title).toEqual({
      en: 'Java Backend Developer',
      tr: 'Java Backend Geliştirici',
    });
    expect(profile.role.en).toBe('Software Development Senior Specialist');
    expect(profile.headline.en).toMatch(/^Java backend developer/);
  });

  it('records the certification and languages from the CV', () => {
    expect(profile.certifications.en).toEqual([
      'Advanced Java Programming (TDD)',
    ]);
    expect(profile.languages.en).toEqual(['Turkish (native)', 'English (B2)']);
    expect(profile.languages.tr).toEqual(['Türkçe (anadil)', 'İngilizce (B2)']);
  });

  it('never publishes a phone number', () => {
    expect(JSON.stringify(profile)).not.toMatch(/\+?\d[\d ()-]{8,}\d/);
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
    const all = skills.flatMap((c) => c.items.en);
    expect(all).not.toContain('API gateway');
    expect(all).not.toContain('ArgoCD');
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
