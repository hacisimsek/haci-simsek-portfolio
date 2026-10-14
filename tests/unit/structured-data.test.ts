// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { socials } from '@/content';
import {
  graphJsonLd,
  personJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from '@/lib/structured-data';

describe('personJsonLd', () => {
  it('describes the person in the page language', () => {
    const en = personJsonLd('en');
    expect(en).toMatchObject({
      '@type': 'Person',
      name: 'Hacı Şimşek',
      alternateName: 'Haci Simsek',
      jobTitle: 'Software Development Senior Specialist',
      url: 'https://hacisimsek.com',
      worksFor: { '@type': 'Organization', name: 'Sisal' },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Bahçeşehir University',
      },
      address: { '@type': 'PostalAddress', addressLocality: 'Istanbul' },
    });
    expect(personJsonLd('tr')).toMatchObject({
      jobTitle: 'Kıdemli Yazılım Geliştirme Uzmanı',
      url: 'https://hacisimsek.com/tr',
      alumniOf: { name: 'Bahçeşehir Üniversitesi' },
      address: { addressLocality: 'İstanbul' },
    });
  });

  it('links every profile and never exposes the email address', () => {
    const person = personJsonLd('en') as unknown as Record<string, unknown>;
    expect(person.sameAs).toEqual(socials.map((social) => social.href));
    expect(JSON.stringify(person)).not.toContain('@gmail.com');
    expect((person.knowsAbout as string[]).length).toBeGreaterThan(5);
  });
});

describe('websiteJsonLd', () => {
  it('names the site and its languages', () => {
    expect(websiteJsonLd()).toMatchObject({
      '@type': 'WebSite',
      name: 'Hacı Şimşek',
      url: 'https://hacisimsek.com',
      inLanguage: ['en', 'tr'],
    });
  });
});

describe('serializeJsonLd', () => {
  it('cannot close the surrounding script tag', () => {
    const out = serializeJsonLd({ text: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</');
    expect(JSON.parse(out)).toEqual({
      text: '</script><script>alert(1)</script>',
    });
  });
});

describe('graphJsonLd', () => {
  it('links the nodes by @id under a single @context', () => {
    const graph = graphJsonLd('tr') as unknown as {
      '@context': string;
      '@graph': Record<string, unknown>[];
    };
    expect(graph['@context']).toBe('https://schema.org');
    const [person, website] = graph['@graph'];
    expect(person['@context']).toBeUndefined();
    expect(person['@id']).toBe('https://hacisimsek.com/#person');
    expect(person.image).toBe('https://hacisimsek.com/tr/opengraph-image/card');
    expect(website['@id']).toBe('https://hacisimsek.com/#website');
    expect(website.publisher).toEqual({
      '@id': 'https://hacisimsek.com/#person',
    });
  });
});
