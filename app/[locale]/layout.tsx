import 'lenis/dist/lenis.css';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import Header from '@/components/Header';
import AuroraBackground from '@/components/effects/aurora-background';
import GrainOverlay from '@/components/effects/grain-overlay';
import ScrollProgress from '@/components/effects/scroll-progress';
import MotionProvider from '@/components/providers/motion-provider';
import SmoothScroll from '@/components/providers/smooth-scroll';
import Footer from '@/components/Footer';
import JsonLd from '@/components/seo/json-ld';
import VercelInsights from '@/components/seo/vercel-insights';
import ThemeColor from '@/components/seo/theme-color';
import TerminalHost from '@/components/terminal/terminal-host';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { profile } from '@/content';
import { brand } from '@/lib/og/brand';
import { SITE_URL } from '@/lib/seo';
import { pageMetadata } from '@/lib/page-metadata';
import { graphJsonLd } from '@/lib/structured-data';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
});

const geist = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-geist-mono',
  preload: false,
});

// Daily regeneration keeps the computed years of experience and the footer
// year current without a redeploy.
export const revalidate = 86400;

// The dark default; ThemeColor keeps it in step with the theme toggle.
export const viewport: Viewport = {
  themeColor: brand.background,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: profile.asciiName,
      template: `%s | ${profile.asciiName}`,
    },
    ...(await pageMetadata(locale, '/')),
  };
}

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
        className={`${spaceGrotesk.variable} ${geist.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <JsonLd data={graphJsonLd(locale)} />
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeColor />
            <TerminalHost />
            <MotionProvider>
              <SmoothScroll />
              <ScrollProgress />
              <AuroraBackground />
              <GrainOverlay />
              <div className="app-shell">
                <div className="page-grid" />
                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-6 pb-10 sm:px-6 lg:px-8">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </div>
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <VercelInsights />
      </body>
    </html>
  );
}
