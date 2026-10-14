import type { Locale } from '@/content/types';

export const SITE_URL = 'https://hacisimsek.com';

// English lives at the bare path and Turkish under /tr (localePrefix
// 'as-needed').
function localizedPath(path: string, locale: Locale) {
  if (locale === 'en') return path;
  return path === '/' ? '/tr' : `/tr${path}`;
}

export function alternatesFor(path: string, locale: Locale) {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      en: localizedPath(path, 'en'),
      tr: localizedPath(path, 'tr'),
      'x-default': localizedPath(path, 'en'),
    },
  };
}
