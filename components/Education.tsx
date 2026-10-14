import { useLocale, useTranslations } from 'next-intl';
import { education, t } from '@/content';
import { formatPeriod } from '@/lib/dates';

export default function Education() {
  const msg = useTranslations('Education');
  const locale = useLocale();
  return (
    <section>
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">{msg('title')}</h2>
          </div>
          <p className="section-copy">{msg('copy')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {education.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.6rem] border border-border/70 bg-background/75 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="meta-chip">{t(item.trackLabel, locale)}</span>
                <span className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                  {formatPeriod(item.start, item.end, locale)}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {t(item.degree, locale)}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {t(item.school, locale)} · {t(item.location, locale)}
              </p>
              {t(item.notes, locale).length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {t(item.notes, locale).map((note) => (
                    <span key={note} className="meta-chip">
                      {note}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
