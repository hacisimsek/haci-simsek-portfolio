'use client';

import { ArrowUpRight, Clock3, FolderGit2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import TiltCard from '@/components/motion/tilt-card';
import { filterRepos, languagesOf, type RepoSort } from '@/lib/collections';
import type { Repo } from '@/lib/feeds/github';
import CollectionControls from './collection-controls';
import EmptyResults from './empty-results';

export default function ProjectBrowser({ repos }: { repos: Repo[] }) {
  const msg = useTranslations('Collections');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [sort, setSort] = useState<RepoSort>('recent');
  const shown = filterRepos(repos, { query, language, sort });
  const date = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'Europe/Istanbul',
  });

  function reset() {
    setQuery('');
    setLanguage(null);
  }

  return (
    <div className="space-y-6">
      <CollectionControls
        query={query}
        onQuery={setQuery}
        placeholder={msg('searchProjects')}
        chips={languagesOf(repos)}
        chipsLabel={msg('language')}
        active={language}
        onChip={setLanguage}
        sort={sort}
        sorts={[
          { value: 'recent', label: msg('sortRecent') },
          { value: 'name', label: msg('sortName') },
        ]}
        onSort={setSort}
        shown={shown.length}
        total={repos.length}
      />

      {shown.length === 0 ? (
        <EmptyResults onReset={reset} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((project) => (
            <TiltCard
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group spotlight flex min-h-64 flex-col surface-card p-6 hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <FolderGit2 aria-hidden className="h-5 w-5" />
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground"
                />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight break-words">
                {project.name}
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-7 text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {project.language ? (
                  <span className="meta-chip">{project.language}</span>
                ) : null}
                <span className="meta-chip">
                  <Clock3 aria-hidden className="mr-2 h-3.5 w-3.5" />
                  {date.format(new Date(project.updatedAt))}
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
