import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { alternatesFor, SITE_URL } from '@/lib/seo';

const pages = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/articles', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/radar', priority: 0.6, changeFrequency: 'daily' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
] as const;

const absolute = (path: string) => (path === '/' ? SITE_URL : SITE_URL + path);

export function sitemapEntries(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => {
      const { canonical, languages } = alternatesFor(path, locale);
      return {
        url: absolute(canonical),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(languages).map(([key, value]) => [
              key,
              absolute(value),
            ])
          ),
        },
      };
    })
  );
}
