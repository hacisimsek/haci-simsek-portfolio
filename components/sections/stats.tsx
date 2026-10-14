import { useLocale, useTranslations } from 'next-intl';
import NumberTicker from '@/components/motion/number-ticker';
import type { Stat } from '@/lib/stats';

export default function Stats({ stats }: { stats: Stat[] }) {
  const msg = useTranslations('Stats');
  const locale = useLocale();

  return (
    <section aria-label={msg('label')} className="fade-up">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col-reverse gap-2 glass px-6 py-5"
          >
            <dt className="text-sm text-muted-foreground">{msg(stat.id)}</dt>
            <dd className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <NumberTicker value={stat.value} locale={locale} />
              {stat.id === 'years' ? (
                <span aria-hidden className="text-accent">
                  +
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
