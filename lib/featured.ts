import {
  featuredProjects,
  t,
  type FeaturedProject,
  type Locale,
} from '@/content';
import type { Repo } from '@/lib/feeds/github';

export type FeaturedRepo = Repo & { flagship: boolean };

// Hand-picked repos first, in their listed order, then the most recently
// updated others. Picks missing from the feed are skipped, never invented.
export function selectFeatured(
  repos: Repo[],
  featured: Pick<FeaturedProject, 'name' | 'flagship'>[],
  limit = 6,
  /** Fill up to the limit with recent repos; off where only picks belong
   *  (the limit still caps the picks). */
  { fill = true }: { fill?: boolean } = {}
): FeaturedRepo[] {
  const byName = new Map(repos.map((repo) => [repo.name, repo]));
  const picked: FeaturedRepo[] = featured.flatMap(({ name, flagship }) => {
    const repo = byName.get(name);
    return repo ? [{ ...repo, flagship: flagship ?? false }] : [];
  });
  if (!fill) return picked.slice(0, limit);
  const taken = new Set(picked.map((repo) => repo.name));
  const rest = repos
    .filter((repo) => !taken.has(repo.name))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map((repo) => ({ ...repo, flagship: false }));
  return [...picked, ...rest].slice(0, limit);
}

const authored = new Map(
  featuredProjects.map((project) => [project.name, project.summary])
);

/** The authored line a featured repo shows instead of its GitHub description. */
export function authoredSummary(name: string, locale: Locale) {
  const summary = authored.get(name);
  return summary ? t(summary, locale) : undefined;
}
