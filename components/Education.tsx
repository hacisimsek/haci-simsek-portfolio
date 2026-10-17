import { useLocale, useTranslations } from 'next-intl';
import { education, profile, t } from '@/content';
import { formatPeriod } from '@/lib/dates';
import { SEPARATOR } from '@/lib/utils';

export default function Education() {
  const msg = useTranslations('Education');
  const locale = useLocale();
  return (
    <section id="education" aria-labelledby="education-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h2 id="education-title" className="section-title">
          {msg('title')}
        </h2>
        <p className="section-copy">{msg('copy')}</p>
      </div>

      <ol className="divide-y divide-border/70 border-y border-border/70">
        {education.map((item) => (
          <li
            key={item.id}
            className="grid gap-2 py-6 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8"
          >
            <div className="text-sm">
              <p className="text-muted-foreground">
                {formatPeriod(item.start, item.end, locale)}
              </p>
              <p className="mt-1 font-medium text-accent">
                {t(item.trackLabel, locale)}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {t(item.degree, locale)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(item.school, locale)}
                {SEPARATOR}
                {t(item.location, locale)}
              </p>
              {t(item.notes, locale).length > 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(item.notes, locale).join(SEPARATOR)}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <dl className="divide-y divide-border/70 border-b border-border/70 text-sm">
        {(
          [
            ['certification', profile.certifications],
            ['languages', profile.languages],
          ] as const
        ).map(([key, items]) => (
          <div
            key={key}
            className="grid gap-1 py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8"
          >
            <dt className="font-medium text-accent">{msg(key)}</dt>
            <dd className="text-muted-foreground">
              {t(items, locale).join(SEPARATOR)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
