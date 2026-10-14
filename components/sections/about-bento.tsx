import { Clock3, Mail } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { GithubIcon, LinkedinIcon } from '@/components/icons/brand-icons';
import LocalTime from '@/components/motion/local-time';
import Spotlight from '@/components/motion/spotlight';
import portrait from '@/assets/images/portrait.jpg';
import { profile, socials, t } from '@/content';
import { careerYears } from '@/lib/dates';
import { cn } from '@/lib/utils';

const tile = 'surface-card p-6';

function socialHref(id: 'github' | 'linkedin') {
  return socials.find((social) => social.id === id)!.href;
}

export default function AboutBento() {
  const msg = useTranslations('About');
  const locale = useLocale();
  const years = careerYears(profile.careerStart);
  const links = [
    { href: `mailto:${profile.email}`, label: msg('email'), icon: Mail },
    { href: socialHref('github'), label: 'GitHub', icon: GithubIcon },
    { href: socialHref('linkedin'), label: 'LinkedIn', icon: LinkedinIcon },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="grid gap-4 lg:grid-cols-6"
    >
      <Spotlight className={cn(tile, 'sm:p-8 lg:col-span-4 lg:row-span-2')}>
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
          alt={profile.name}
          placeholder="blur"
          sizes="(min-width: 1024px) 380px, 100vw"
          className="aspect-4/5 h-full w-full rounded-[1.4rem] object-cover"
        />
      </div>

      <Spotlight className={cn(tile, 'lg:col-span-2')}>
        <p className="text-sm text-muted-foreground">
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

      <div
        className={cn(tile, 'flex flex-wrap items-center gap-3 lg:col-span-2')}
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
