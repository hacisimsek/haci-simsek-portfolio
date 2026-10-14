// @vitest-environment node
import { describe, expect, it } from 'vitest';
import manifest from '@/app/manifest';
import robots from '@/app/robots';
import { sitemapEntries } from '@/lib/sitemap-entries';

describe('sitemapEntries', () => {
  const entries = sitemapEntries();

  it('lists every page in both languages with absolute URLs', () => {
    expect(entries.map((entry) => entry.url).sort()).toEqual(
      [
        'https://hacisimsek.com',
        'https://hacisimsek.com/articles',
        'https://hacisimsek.com/contact',
        'https://hacisimsek.com/projects',
        'https://hacisimsek.com/tr',
        'https://hacisimsek.com/tr/articles',
        'https://hacisimsek.com/tr/contact',
        'https://hacisimsek.com/tr/projects',
      ].sort()
    );
  });

  it('links each page to its translation', () => {
    const projects = entries.find(
      (entry) => entry.url === 'https://hacisimsek.com/tr/projects'
    );
    expect(projects?.alternates?.languages).toEqual({
      en: 'https://hacisimsek.com/projects',
      tr: 'https://hacisimsek.com/tr/projects',
      'x-default': 'https://hacisimsek.com/projects',
    });
  });

  it('ranks the home page highest', () => {
    const home = entries.find(
      (entry) => entry.url === 'https://hacisimsek.com'
    );
    expect(home?.priority).toBe(1);
  });
});

describe('robots', () => {
  it('allows crawling and points to the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://hacisimsek.com/sitemap.xml',
    });
  });
});

describe('manifest', () => {
  it('names the site and uses the generated icons and theme colours', () => {
    expect(manifest()).toMatchObject({
      name: 'Haci Simsek',
      short_name: 'Haci Simsek',
      start_url: '/',
      display: 'standalone',
      background_color: '#05070f',
      theme_color: '#05070f',
      icons: [
        { src: '/icon', sizes: '512x512', type: 'image/png' },
        { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
      ],
    });
  });
});
