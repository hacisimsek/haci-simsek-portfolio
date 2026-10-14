// @vitest-environment node
import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { experience, featuredProjects, skills, socials } from '@/content';
import { COMMANDS, complete, run } from '@/lib/terminal/interpreter';
import en from '../../../messages/en.json';
import tr from '../../../messages/tr.json';

const ctx = (locale: 'en' | 'tr') => {
  const t = createTranslator({
    locale,
    messages: locale === 'en' ? en : tr,
    namespace: 'Terminal',
  });
  return {
    locale,
    t: (key: string, values?: Record<string, string | number>) =>
      t(key as Parameters<typeof t>[0], values),
  };
};
const text = (result: ReturnType<typeof run>) =>
  result.lines.map((line) => line.text).join('\n');

describe('run', () => {
  it('lists every command in help', () => {
    const out = text(run('help', ctx('en')));
    for (const command of COMMANDS) expect(out).toContain(command);
  });

  it('introduces the person in the page language', () => {
    expect(text(run('whoami', ctx('en')))).toContain('Hacı Şimşek');
    expect(text(run('whoami', ctx('en')))).toContain(
      'Software Development Senior Specialist'
    );
    expect(text(run('whoami', ctx('tr')))).toContain(
      'Kıdemli Yazılım Geliştirme Uzmanı'
    );
  });

  it('prints skills, experience and projects from the content layer', () => {
    expect(run('skills', ctx('tr')).lines.length).toBeGreaterThanOrEqual(
      skills.length
    );
    expect(text(run('skills', ctx('tr')))).toContain('Mikroservisler');
    expect(run('experience', ctx('en')).lines.length).toBeGreaterThanOrEqual(
      experience.length
    );
    const projects = run('projects', ctx('en')).lines.filter((l) => l.href);
    expect(projects.map((l) => l.text)).toEqual(
      featuredProjects.map((p) => p.name)
    );
    expect(projects[0].href).toBe(
      'https://github.com/hacisimsek/ecommerce-microservices'
    );
  });

  it('lists contact details as links', () => {
    const links = run('contact', ctx('en')).lines.filter((l) => l.href);
    expect(links[0].href).toMatch(/^mailto:/);
    expect(links.slice(1).map((l) => l.href)).toEqual(
      socials.map((s) => s.href)
    );
  });

  it('changes theme and language, and explains bad arguments', () => {
    expect(run('theme light', ctx('en')).effect).toEqual({
      type: 'theme',
      theme: 'light',
    });
    const badTheme = run('theme blue', ctx('en'));
    expect(badTheme.effect).toBeUndefined();
    expect(badTheme.lines[0]).toMatchObject({ kind: 'error' });
    expect(text(badTheme)).toContain('theme <dark|light|system>');

    expect(run('lang tr', ctx('en')).effect).toEqual({
      type: 'locale',
      locale: 'tr',
    });
    expect(run('lang de', ctx('en')).lines[0].kind).toBe('error');
  });

  it('clears, closes and hires', () => {
    expect(run('clear', ctx('en')).effect).toEqual({ type: 'clear' });
    expect(run('exit', ctx('en')).effect).toEqual({ type: 'close' });
    const hire = run('sudo hire-me', ctx('en'));
    expect(hire.effect).toEqual({ type: 'navigate', href: '/contact' });
    expect(hire.lines.length).toBeGreaterThan(0);
    const refused = run('sudo rm -rf /', ctx('en'));
    expect(refused.effect).toBeUndefined();
    expect(refused.lines[0].kind).toBe('error');
  });

  it('is forgiving about spacing and case, and names unknown commands', () => {
    expect(text(run('  HELP  ', ctx('en')))).toContain('whoami');
    expect(run('', ctx('en')).lines).toEqual([]);
    const unknown = run('<img src=x onerror=alert(1)>', ctx('tr'));
    expect(unknown.lines[0].kind).toBe('error');
    expect(unknown.lines[0].text).toContain('<img');
  });
});

describe('complete', () => {
  it('completes unique prefixes and lists ambiguous ones', () => {
    expect(complete('wh')).toEqual(['whoami']);
    expect(complete('s')).toEqual(['skills', 'sudo']);
    expect(complete('xyz')).toEqual([]);
    expect(complete('')).toEqual([...COMMANDS]);
  });
});

describe('polish', () => {
  it('names the language it switches to', () => {
    expect(text(run('lang tr', ctx('en')))).toContain('Turkish');
    expect(text(run('lang en', ctx('tr')))).toContain('İngilizce');
  });

  it('mentions the keyboard shortcuts in help', () => {
    const out = text(run('help', ctx('en')));
    expect(out).toContain('Tab');
    expect(out).toContain('Ctrl+L');
  });

  it('builds project links from the GitHub profile in socials', () => {
    const github = socials.find((social) => social.id === 'github')!.href;
    const links = run('projects', ctx('en')).lines.filter((l) => l.href);
    expect(links.every((l) => l.href!.startsWith(`${github}/`))).toBe(true);
  });
});
