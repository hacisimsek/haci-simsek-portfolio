import { useLocale, useTranslations } from 'next-intl';
import { skills, t } from '@/content';

export default function Skills() {
  const msg = useTranslations('Skills');
  const locale = useLocale();

  return (
    <section id="skills" aria-labelledby="skills-title">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="skills-title" className="section-title">
          {msg('title')}
        </h2>
        <p className="section-copy">{msg('copy')}</p>
      </div>

      <dl className="divide-y divide-border/70 border-y border-border/70">
        {skills.map((category) => (
          <div
            key={category.id}
            className="grid gap-2 py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8"
          >
            <dt className="font-semibold">{t(category.title, locale)}</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 leading-7 text-muted-foreground">
                {t(category.items, locale).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
