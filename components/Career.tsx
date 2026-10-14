import { useLocale, useTranslations } from 'next-intl';
import { experience, t } from '@/content';
import { formatPeriod } from '@/lib/dates';
import { RichText } from '@/lib/rich-text';

export default function Career() {
  const msg = useTranslations('Career');
  const locale = useLocale();
  return (
    <section id="career" className="fade-up">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
            <h2 className="section-title">{msg('title')}</h2>
          </div>
          <p className="section-copy">{msg('copy')}</p>
        </div>

        <div className="relative space-y-8 before:absolute before:top-3 before:bottom-0 before:left-[11px] before:w-px before:bg-border/80 sm:before:left-[151px]">
          {experience.map((role) => (
            <article
              key={role.id}
              className="relative grid gap-5 sm:grid-cols-[120px_1fr]"
            >
              <div className="relative z-10 flex items-start gap-4 sm:block">
                <span className="mt-2 block h-6 w-6 rounded-full border border-accent/30 bg-accent/90 shadow-[0_0_0_6px_hsl(var(--background))]" />
                <div className="sm:pt-0.5">
                  <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                    {formatPeriod(role.start, role.end, locale)}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {t(role.title, locale)}
                    </h3>
                    <p className="mt-1 text-sm text-accent">
                      {t(role.company, locale)}
                      {role.team ? ` · ${t(role.team, locale)}` : ''}
                    </p>
                  </div>
                  <div className="meta-chip w-fit">{t(role.focus, locale)}</div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {t(role.summary, locale)}
                </p>

                <div className="mt-5 grid gap-3">
                  {t(role.highlights, locale).map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm leading-7 text-muted-foreground"
                    >
                      <RichText text={bullet} />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
