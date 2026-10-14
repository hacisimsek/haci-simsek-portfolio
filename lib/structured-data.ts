import type { Graph, Person, WebSite } from 'schema-dts';
import { education, profile, skills, socials, t, type Locale } from '@/content';
import { SITE_URL } from '@/lib/seo';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const homeUrl = (locale: Locale) =>
  locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`;

// No email here: structured data is scraped far more than the page itself.
export function personJsonLd(locale: Locale): Exclude<Person, string> {
  const school = education.find((item) => item.track === 'major')!;
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    alternateName: profile.asciiName,
    jobTitle: t(profile.role, locale),
    url: homeUrl(locale),
    image: `${SITE_URL}/${locale}/opengraph-image`,
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

export function websiteJsonLd(): Exclude<WebSite, string> {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: profile.asciiName,
    url: SITE_URL,
    inLanguage: ['en', 'tr'],
    publisher: { '@id': PERSON_ID },
  };
}

export function graphJsonLd(locale: Locale): Graph {
  return {
    '@context': 'https://schema.org',
    '@graph': [personJsonLd(locale), websiteJsonLd()],
  };
}

// JSON inside <script> must not contain "</" or it could end the tag early.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
