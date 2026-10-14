import { useLocale, useTranslations } from 'next-intl';
import { experience, t } from '@/content';
import { formatPeriod } from '@/lib/dates';
import { groupRoles } from '@/lib/group-roles';
import { RichText } from '@/lib/rich-text';
import { SEPARATOR } from '@/lib/utils';
import TimelineTrack from './timeline-track';

export default function Career() {
  const msg = useTranslations('Career');
  const locale = useLocale();
  const groups = groupRoles(experience);

  return (
    <section id="career" aria-labelledby="career-title">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="career-title" className="section-title">
          {msg('title')}
        </h2>
        <p className="section-copy">{msg('copy')}</p>
      </div>

      <TimelineTrack>
        <ol className="space-y-12">
          {groups.map((group, groupIndex) => {
            // Only the current employer is open; earlier highlights fold.
            const current = groupIndex === 0;
            const first = group.roles[0];
            const last = group.roles.at(-1)!;
            const labelId = `company-${first.id}`;
            return (
              <li
                key={first.id}
                aria-labelledby={labelId}
                className="relative grid gap-5 sm:grid-cols-[140px_1fr] sm:gap-8"
              >
                <div className="relative z-10 flex items-start gap-4 sm:block">
                  <span className="mt-1.5 block h-6 w-6 shrink-0 rounded-full border-4 border-background bg-primary sm:absolute sm:top-0 sm:left-[144px]" />
                  <div>
                    <p
                      id={labelId}
                      className="font-display text-lg font-semibold"
                    >
                      {t(group.company, locale)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPeriod(last.start, first.end, locale)}
                    </p>
                    {group.roles.length > 1 ? (
                      <p className="mt-2 text-sm font-medium text-accent">
                        {msg('promoted')}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-6 pl-10 sm:pl-0">
                  {group.roles.map((role) => (
                    <article
                      key={role.id}
                      className="max-w-[70ch] border-t border-border/70 pt-6 first:border-t-0 first:pt-0"
                    >
                      <h3 className="text-xl font-semibold">
                        {t(role.title, locale)}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span>
                          {formatPeriod(role.start, role.end, locale)}
                        </span>
                        {role.team ? (
                          <span>
                            {SEPARATOR}
                            {t(role.team, locale)}
                          </span>
                        ) : null}
                        <span>
                          {SEPARATOR}
                          {t(role.focus, locale)}
                        </span>
                      </p>
                      {role.kind !== 'employment' ? (
                        <p className="mt-1 text-sm font-medium text-accent">
                          {msg(`kind.${role.kind}`)}
                        </p>
                      ) : null}

                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        {t(role.summary, locale)}
                      </p>

                      {current ? (
                        <Highlights items={t(role.highlights, locale)} />
                      ) : (
                        <details className="group/more mt-3">
                          <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-foreground hover:text-accent">
                            {msg('more')}
                          </summary>
                          <Highlights items={t(role.highlights, locale)} />
                        </details>
                      )}
                    </article>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </TimelineTrack>
    </section>
  );
}

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((bullet) => (
        <li
          key={bullet}
          className="relative pl-5 text-sm leading-7 text-muted-foreground before:absolute before:top-3 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
        >
          <RichText text={bullet} />
        </li>
      ))}
    </ul>
  );
}
