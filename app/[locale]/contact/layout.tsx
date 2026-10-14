import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { alternatesFor } from '@/lib/seo';

// The contact page is a client component, so its metadata lives here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const msg = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: msg('contactTitle'),
    alternates: alternatesFor('/contact', locale),
  };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
