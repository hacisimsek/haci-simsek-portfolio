import { useLocale, useTranslations } from 'next-intl';
import { skills, t } from '@/content';

export default function Skills() {
  const msg = useTranslations('Skills');
  const locale = useLocale();
  return (
    <section id="skills" className="fade-up">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
            <h2 className="section-title">{msg('title')}</h2>
          </div>
          <p className="section-copy">{msg('copy')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((category) => (
            <article
              key={category.id}
              className="rounded-[1.6rem] border border-border/70 bg-background/75 p-6"
            >
              <h3 className="text-lg font-semibold">
                {t(category.title, locale)}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {t(category.items, locale).map((item) => (
                  <span key={item} className="meta-chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
