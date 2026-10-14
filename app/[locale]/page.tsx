import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, FileText, FolderGit2, Layers3 } from 'lucide-react';
import About from '@/components/About';
import Career from '@/components/Career';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import Hero from '@/components/sections/hero';
import { Link } from '@/i18n/navigation';

const featuredAreas = [
  { key: 'projects', href: '/projects', icon: FolderGit2 },
  { key: 'writing', href: '/articles', icon: FileText },
  { key: 'focus', href: '/contact', icon: Layers3 },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const msg = await getTranslations({ locale, namespace: 'Home' });

  return (
    <div className="space-y-6 pb-6">
      <Hero />
      <About />
      <Career />
      <Skills />
      <Education />

      <section className="fade-up">
        <div className="section-shell">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
              <h2 className="section-title">{msg('title')}</h2>
            </div>
            <p className="section-copy">{msg('copy')}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {featuredAreas.map(({ key, href, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className="group rounded-[1.8rem] border border-border/70 bg-background/75 p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-32px_color-mix(in_oklab,var(--foreground)_65%,transparent)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">
                  {msg(`${key}Title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {msg(`${key}Text`)}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  {msg('explore')}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
