// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildCommands } from '@/components/command/commands';
import { socials } from '@/content';

const t = (key: string) => `[${key}]`;

describe('buildCommands', () => {
  const groups = buildCommands({ t, socials });
  const items = groups.flatMap((group) => group.items);
  const byId = (id: string) => items.find((item) => item.id === id);

  it('returns the four groups in order with translated headings', () => {
    expect(groups.map((group) => group.id)).toEqual([
      'navigate',
      'preferences',
      'contact',
      'links',
    ]);
    expect(groups[0].heading).toBe('[groups.navigate]');
  });

  it('navigates to sections and pages', () => {
    expect(byId('nav-home')?.action).toEqual({ type: 'navigate', href: '/' });
    expect(byId('nav-about')?.action).toEqual({
      type: 'navigate',
      href: '/#about',
    });
    expect(byId('nav-projects')?.action).toEqual({
      type: 'navigate',
      href: '/projects',
    });
    expect(byId('nav-contact')?.action).toEqual({
      type: 'navigate',
      href: '/contact',
    });
  });

  it('opens the terminal', () => {
    expect(byId('open-terminal')?.action).toEqual({ type: 'terminal' });
    expect(byId('open-terminal')?.keywords).toContain('shell');
  });

  it('switches theme and language', () => {
    expect(byId('theme-dark')?.action).toEqual({
      type: 'theme',
      theme: 'dark',
    });
    expect(byId('theme-light')?.action).toEqual({
      type: 'theme',
      theme: 'light',
    });
    expect(byId('theme-system')?.action).toEqual({
      type: 'theme',
      theme: 'system',
    });
    expect(byId('locale-en')?.action).toEqual({ type: 'locale', locale: 'en' });
    expect(byId('locale-tr')?.action).toEqual({ type: 'locale', locale: 'tr' });
  });

  it('copies the email and opens every social link', () => {
    expect(byId('copy-email')?.action).toEqual({ type: 'copy-email' });
    for (const social of socials) {
      expect(byId(`link-${social.id}`)?.action).toEqual({
        type: 'external',
        href: social.href,
      });
    }
  });

  it('gives every item a unique id and folded keywords', () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    const contact = buildCommands({
      t: (key) => (key === 'nav.contact' ? 'İletişim' : key),
      socials,
    })
      .flatMap((group) => group.items)
      .find((item) => item.id === 'nav-contact');
    expect(contact?.label).toBe('İletişim');
    expect(contact?.keywords).toContain('iletisim');
    // English section names keep working on the Turkish site.
    expect(contact?.keywords).toContain('contact');
  });
});
