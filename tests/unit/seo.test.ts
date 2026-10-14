// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { alternatesFor } from '@/lib/seo';

describe('alternatesFor', () => {
  it('links both languages of an inner page', () => {
    expect(alternatesFor('/projects', 'tr')).toEqual({
      canonical: '/tr/projects',
      languages: {
        en: '/projects',
        tr: '/tr/projects',
        'x-default': '/projects',
      },
    });
  });

  it('uses the bare paths for the home page', () => {
    expect(alternatesFor('/', 'en')).toEqual({
      canonical: '/',
      languages: { en: '/', tr: '/tr', 'x-default': '/' },
    });
  });
});
