import { useLocale, useTranslations } from 'next-intl';
import { experience, t } from '@/content';
import { formatPeriod } from '@/lib/dates';
import { groupRoles } from '@/lib/group-roles';
import { RichText } from '@/lib/rich-text';
import TimelineTrack from './timeline-track';

export default function Career() {
  const msg = useTranslations('Career');
  const locale = useLocale();
  const groups = groupRoles(experience);

  return (
    <section id="career">
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 eyebrow">{msg('eyebrow')}</div>
            <h2 className="section-title">{msg('title')}</h2>
          </div>
          <p className="section-copy">{msg('copy')}</p>
        </div>

        <TimelineTrack>
          <ol className="space-y-10">
            {groups.map((group) => {
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
                    <span className="mt-1.5 block h-6 w-6 shrink-0 rounded-full border-4 border-background bg-primary shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_60%,transparent)] sm:absolute sm:top-0 sm:left-[144px]" />
                    <div>
                      <p
                        id={labelId}
                        className="font-display text-lg font-semibold"
                      >
                        {t(group.company, locale)}
                      </p>
                      <p className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
                        {formatPeriod(last.start, first.end, locale)}
                      </p>
                      {group.roles.length > 1 ? (
                        <p className="mt-3 meta-chip w-fit text-accent">
                          {msg('promoted')}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-4 pl-10 sm:pl-0">
                    {group.roles.map((role) => (
                      <article
                        key={role.id}
                        className="surface-card p-5 sm:p-6"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {t(role.title, locale)}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              <span>
                                {formatPeriod(role.start, role.end, locale)}
                              </span>
                              {role.team ? (
                                <span> · {t(role.team, locale)}</span>
                              ) : null}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {role.kind !== 'employment' ? (
                              <span className="meta-chip text-accent">
                                {msg(`kind.${role.kind}`)}
                              </span>
                            ) : null}
                            <span className="meta-chip">
                              {t(role.focus, locale)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                          {t(role.summary, locale)}
                        </p>

                        <ul className="mt-5 space-y-2">
                          {t(role.highlights, locale).map((bullet) => (
                            <li
                              key={bullet}
                              className="relative pl-5 text-sm leading-7 text-muted-foreground before:absolute before:top-3 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent"
                            >
                              <RichText text={bullet} />
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </TimelineTrack>
      </div>
    </section>
  );
}
