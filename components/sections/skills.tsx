import { useLocale, useTranslations } from 'next-intl';
import Spotlight from '@/components/motion/spotlight';
import { skills, t } from '@/content';

export default function Skills() {
  const msg = useTranslations('Skills');
  const locale = useLocale();

  return (
    <section id="skills">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">{msg('title')}</h2>
          </div>
          <p className="section-copy">{msg('copy')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skills.map((category) => (
            <Spotlight key={category.id} className="surface-card p-6">
              <article>
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
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
