import type { Person, WebSite, WithContext } from 'schema-dts';
import { education, profile, skills, socials, t, type Locale } from '@/content';
import { SITE_URL } from '@/lib/seo';

const homeUrl = (locale: Locale) =>
  locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`;

// No email here: structured data is scraped far more than the page itself.
export function personJsonLd(locale: Locale): WithContext<Person> {
  const school = education.find((item) => item.track === 'major')!;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.asciiName,
    jobTitle: t(profile.role, locale),
    url: homeUrl(locale),
    worksFor: { '@type': 'Organization', name: profile.currentCompany },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: t(school.school, locale),
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: t(profile.city, locale),
      addressCountry: 'TR',
    },
    sameAs: socials.map((social) => social.href),
    knowsAbout: [
      ...new Set(skills.flatMap((category) => t(category.items, locale))),
    ],
  };
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: profile.asciiName,
    url: SITE_URL,
    inLanguage: ['en', 'tr'],
  };
}

// JSON inside <script> must not contain "</" or it could end the tag early.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
