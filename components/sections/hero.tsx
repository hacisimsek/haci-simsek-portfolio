import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { profile, t } from '@/content';
import { Link } from '@/i18n/navigation';
import { careerYears } from '@/lib/dates';
import { splitGraphemes } from '@/lib/split-text';
import SystemDiagram from './system-diagram';

export default function Hero() {
  const msg = useTranslations('Hero');
  const locale = useLocale();
  // Letters are grouped by word so a line can only break between words;
  // the stagger index keeps counting across the space.
  const words = profile.name.split(' ').map((word, w, all) => {
    const start = all
      .slice(0, w)
      .reduce((n, prev) => n + splitGraphemes(prev).length + 1, 0);
    return splitGraphemes(word).map((letter, i) => ({
      letter,
      index: start + i,
    }));
  });

  return (
    <section
      id="top"
      className="relative grid gap-8 pt-4 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:pt-8"
    >
      <div className="relative min-w-0">
        <h1 className="max-w-5xl page-title">
          <span className="sr-only">{profile.name}. </span>
          <span
            aria-hidden
            className="block pb-[0.12em] text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.95] font-bold tracking-tighter lg:text-[clamp(3.5rem,min(7vw,12svh),6.75rem)]"
          >
            {words.map((letters, w) => (
              <Fragment key={w}>
                {w > 0 ? ' ' : null}
                <span className="inline-block whitespace-nowrap">
                  {letters.map(({ letter, index }) => (
                    <span
                      key={index}
                      className="letter"
                      style={{ '--i': index } as CSSProperties}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
          <span className="mt-5 block max-w-4xl text-2xl leading-snug font-medium text-muted-foreground sm:text-3xl lg:text-2xl">
            {t(profile.headline, locale)}
          </span>
        </h1>

        <p className="mt-6 text-sm text-muted-foreground sm:text-base">
          {msg('facts', {
            years: careerYears(profile.careerStart),
            role: t(profile.role, locale),
            company: profile.currentCompany,
            city: t(profile.city, locale),
          })}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
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
      <SystemDiagram className="hidden w-full lg:block" />
    </section>
  );
}
