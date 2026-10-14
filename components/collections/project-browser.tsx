'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ProjectRow from '@/components/projects/project-row';
import { filterRepos, languagesOf, type RepoSort } from '@/lib/collections';
import type { Repo } from '@/lib/feeds/github';
import CollectionControls from './collection-controls';
import EmptyResults from './empty-results';

export default function ProjectBrowser({ repos }: { repos: Repo[] }) {
  const msg = useTranslations('Collections');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<string | null>(null);
  const [sort, setSort] = useState<RepoSort>('recent');
  const shown = filterRepos(repos, { query, language, sort });

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
        <ol className="divide-y divide-border/70 border-y border-border/70">
          {shown.map((project) => (
            <ProjectRow key={project.url} repo={project} heading="h2" />
          ))}
        </ol>
      )}
    </div>
  );
}
