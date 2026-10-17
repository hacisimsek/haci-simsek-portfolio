import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { profile, socials, t, type Locale } from '@/content';
import { careerYears } from '@/lib/dates';
import { xHandle } from '@/lib/social';
import { alternatesFor } from '@/lib/seo';

const creator = xHandle(socials);

type TitleKey = 'projectsTitle' | 'articlesTitle' | 'contactTitle';

// Next merges metadata shallowly: a page that only set `title` would keep the
// layout's whole openGraph block and share the home page's URL and title.
// Every page builds its social fields here instead.
export async function pageMetadata(
  locale: Locale,
  path: string,
  titleKey?: TitleKey
): Promise<Metadata> {
  const msg = await getTranslations({ locale, namespace: 'Metadata' });
  const description = msg('description', {
    name: profile.name,
    years: careerYears(profile.careerStart),
  });
  const pageTitle = titleKey ? msg(titleKey) : undefined;
  const socialTitle = pageTitle
    ? `${pageTitle} | ${profile.name}`
    : `${profile.name} · ${t(profile.title, locale)}`;
  const alternates = alternatesFor(path, locale);
  // A page-level openGraph block drops the file-based image from
  // app/[locale]/opengraph-image, so name it explicitly.
  const images = [
    {
      url: `/${locale}/opengraph-image/card`,
      width: 1200,
      height: 630,
      alt: `${profile.name} · ${t(profile.title, locale)}`,
    },
  ];

  return {
    ...(pageTitle ? { title: pageTitle } : {}),
    description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: profile.name,
      title: socialTitle,
      description,
      url: alternates.canonical,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      ...(creator ? { creator } : {}),
      title: socialTitle,
      description,
      images,
    },
  };
}
