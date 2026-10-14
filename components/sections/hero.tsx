import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import WordRotate from '@/components/motion/word-rotate';
import FallbackOrb from '@/components/three/fallback-orb';
import HeroVisual from '@/components/three/hero-visual';
import { Button } from '@/components/ui/button';
import { profile, t } from '@/content';
import { Link } from '@/i18n/navigation';
import { splitGraphemes } from '@/lib/split-text';

export default function Hero() {
  const msg = useTranslations('Hero');
  const locale = useLocale();
  const roles = t(profile.rotatingRoles, locale);
  const letters = splitGraphemes(profile.name);

  return (
    <section
      id="top"
      className="relative grid min-h-[calc(100svh-9rem)] items-center gap-8 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
    >
      <div className="relative min-w-0">
        {/* Phones get a faint static orb behind the name, never WebGL. */}
        <FallbackOrb className="pointer-events-none absolute top-0 -right-1/3 -z-10 w-[85vw] -translate-y-1/4 opacity-40 lg:hidden" />
        <h1 className="max-w-5xl page-title">
          <span className="sr-only">{profile.name}. </span>
          <span
            aria-hidden
            className="block pb-[0.12em] text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.95] font-bold tracking-tighter lg:text-[clamp(4rem,7.5vw,7.25rem)]"
          >
            {letters.map((letter, index) => (
              <span
                key={index}
                className="letter"
                style={{ '--i': index } as CSSProperties}
              >
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            ))}
          </span>
          <span className="mt-6 block max-w-3xl text-2xl leading-snug font-medium text-muted-foreground sm:text-3xl">
            {t(profile.headline, locale)}
          </span>
        </h1>

        <p className="mt-8 flex flex-wrap items-baseline gap-x-3 font-mono text-sm text-muted-foreground sm:text-base">
          <span aria-hidden className="text-accent">
            ~/
          </span>
          <span className="text-foreground">
            <WordRotate words={roles} />
          </span>
        </p>
        <ul aria-label={msg('rolesLabel')} className="sr-only">
          {roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-accent px-7 text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/projects">
              {msg('viewProjects')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-7"
          >
            <Link href="/contact">{msg('startConversation')}</Link>
          </Button>
          <p className="hidden text-sm text-muted-foreground md:block">
            {msg.rich('paletteHint', {
              kbd: (chunks) => (
                <kbd className="rounded-md border border-border px-1.5 py-0.5 font-mono text-xs text-foreground">
                  {chunks}
                </kbd>
              ),
            })}
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <HeroVisual>
          <FallbackOrb />
        </HeroVisual>
      </div>
    </section>
  );
}
