import '../globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { profile } from '@/content';
import { careerYears } from '@/lib/dates';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
});

// Daily regeneration keeps the computed years of experience and the footer
// year current without a redeploy.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: profile.asciiName,
  description: `Portfolio of ${profile.asciiName}, a software engineer with ${careerYears(profile.careerStart)} years of experience building Java, Spring Boot, distributed systems, and cloud-native solutions in regulated, high-traffic environments.`,
  icons: '/images/favicon_io/favicon.ico',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="app-shell">
              <div className="page-glow page-glow-left" />
              <div className="page-glow page-glow-right" />
              <div className="page-grid" />
              <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-6 pb-10 sm:px-6 lg:px-8">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
