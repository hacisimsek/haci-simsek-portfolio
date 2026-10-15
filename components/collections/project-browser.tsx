'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import ProjectRow from '@/components/projects/project-row';
import { featuredProjects } from '@/content';
import { filterRepos, languagesOf, type RepoSort } from '@/lib/collections';
import { selectFeatured } from '@/lib/featured';
import type { Repo } from '@/lib/feeds/github';
import CollectionControls from './collection-controls';
import EmptyResults from './empty-results';

export default function ProjectBrowser({ repos }: { repos: Repo[] }) {
  const msg = useTranslations('Collections');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [sort, setSort] = useState<RepoSort>('recent');
  const home = useTranslations('Home');
  const shown = filterRepos(repos, { query, language, sort, locale });
  // The authored picks lead, in their curated order; the rest follow sorted.
  const picks = selectFeatured(
    shown,
    featuredProjects,
    featuredProjects.length,
    {
      fill: false,
    }
  );
  const others = shown.filter(
    (repo) => !picks.some((pick) => pick.name === repo.name)
  );

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
        <div className="space-y-12">
          {picks.length > 0 ? (
            <section aria-labelledby="projects-selected">
              <h2 id="projects-selected" className="section-title mb-2">
                {msg('selected')}
              </h2>
              <ol className="divide-y divide-border/70 border-y border-border/70">
                {picks.map((repo) => (
                  <ProjectRow
                    key={repo.url}
                    repo={repo}
                    label={repo.flagship ? home('flagship') : undefined}
                  />
                ))}
              </ol>
            </section>
          ) : null}
          {others.length > 0 ? (
            <section aria-labelledby="projects-others">
              <h2 id="projects-others" className="section-title mb-2">
                {msg('others')}
              </h2>
              <ol className="divide-y divide-border/70 border-y border-border/70">
                {others.map((repo) => (
                  <ProjectRow key={repo.url} repo={repo} />
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
