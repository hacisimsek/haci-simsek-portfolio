import { ArrowUpRight, Clock3, GraduationCap, Mail } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import LocalTime from '@/components/motion/local-time';
import Spotlight from '@/components/motion/spotlight';
import portrait from '@/assets/images/portrait.jpg';
import { education, profile, socials, t } from '@/content';
import { careerYears } from '@/lib/dates';
import type { Article } from '@/lib/feeds/medium';
import { cn } from '@/lib/utils';

const tile = 'surface-card p-6';

function socialHref(id: 'github' | 'linkedin') {
  return socials.find((social) => social.id === id)!.href;
}

export default function AboutBento({
  latestArticle,
}: {
  latestArticle?: Article;
}) {
  const msg = useTranslations('About');
  const locale = useLocale();
  const years = careerYears(profile.careerStart);
  const major = education.find((item) => item.track === 'major')!;
  const minor = education.find((item) => item.track === 'minor');
  const links = [
    { href: `mailto:${profile.email}`, label: msg('email'), icon: Mail },
    { href: socialHref('github'), label: 'GitHub', icon: GithubIcon },
    { href: socialHref('linkedin'), label: 'LinkedIn', icon: LinkedinIcon },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="grid fade-up gap-4 lg:grid-cols-6"
    >
      <Spotlight
        className={cn(tile, 'border-beam sm:p-8 lg:col-span-4 lg:row-span-2')}
      >
        <div className="mb-5 eyebrow w-fit">{msg('eyebrow')}</div>
        <h2 id="about-title" className="max-w-2xl section-title">
          {msg('title')}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
          {t(profile.intro, locale).replace('{years}', String(years))}
        </p>
        {t(profile.bio, locale).map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-8 flex flex-wrap gap-2">
          {t(profile.expertise, locale).map((item) => (
            <li key={item} className="meta-chip">
              {item}
            </li>
          ))}
        </ul>
      </Spotlight>

      <div className={cn(tile, 'p-3 lg:col-span-2 lg:row-span-2')}>
        <Image
          src={portrait}
          alt={profile.asciiName}
          placeholder="blur"
          preload
          sizes="(min-width: 1024px) 380px, 100vw"
          className="aspect-4/5 h-full w-full rounded-[1.4rem] object-cover"
        />
      </div>

      <Spotlight className={cn(tile, 'lg:col-span-2')}>
        <p className="eyebrow w-fit">
          {msg('currentlyAt', { company: profile.currentCompany })}
        </p>
        <p className="mt-4 text-lg leading-snug font-semibold">
          {t(profile.role, locale)}
        </p>
      </Spotlight>

      <Spotlight className={cn(tile, 'lg:col-span-2')}>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 aria-hidden className="h-4 w-4" />
          {msg('localTime')}
        </p>
        <p className="mt-3 font-display text-4xl font-semibold">
          <LocalTime locale={locale} />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(profile.location, locale)}
        </p>
      </Spotlight>

      <Spotlight className={cn(tile, 'lg:col-span-2')}>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap aria-hidden className="h-4 w-4" />
          {msg('educationTitle')}
        </p>
        <p className="mt-3 leading-snug font-semibold">
          {t(major.degree, locale)}
        </p>
        {minor ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {msg('minor', { degree: t(minor.degree, locale) })}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-accent">
          {msg('scholarship', { school: t(major.school, locale) })}
        </p>
      </Spotlight>

      {latestArticle ? (
        <Spotlight className={cn(tile, 'lg:col-span-3')}>
          <p className="text-sm text-muted-foreground">
            {msg('latestArticle')}
          </p>
          <a
            href={latestArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 flex items-start justify-between gap-4"
          >
            <span className="text-lg leading-snug font-semibold group-hover:text-accent">
              {latestArticle.title}
            </span>
            <ArrowUpRight
              aria-hidden
              className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
            />
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: 'medium',
              timeZone: 'Europe/Istanbul',
            }).format(new Date(latestArticle.publishedAt))}
          </p>
        </Spotlight>
      ) : null}

      <div
        className={cn(
          tile,
          'flex flex-wrap items-center gap-3',
          latestArticle ? 'lg:col-span-3' : 'lg:col-span-6'
        )}
      >
        {links.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
          >
            <Icon aria-hidden className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}
