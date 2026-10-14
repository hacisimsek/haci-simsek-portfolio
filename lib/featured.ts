import type { FeaturedProject } from '@/content';
import type { Repo } from '@/lib/feeds/github';

export type FeaturedRepo = Repo & { flagship: boolean };

// Hand-picked repos first, in their listed order, then the most recently
// updated others. Picks missing from the feed are skipped, never invented.
export function selectFeatured(
  repos: Repo[],
  featured: FeaturedProject[],
  limit = 6
): FeaturedRepo[] {
  const byName = new Map(repos.map((repo) => [repo.name, repo]));
  const picked: FeaturedRepo[] = featured.flatMap(({ name, flagship }) => {
    const repo = byName.get(name);
    return repo ? [{ ...repo, flagship: flagship ?? false }] : [];
  });
  const taken = new Set(picked.map((repo) => repo.name));
  const rest = repos
    .filter((repo) => !taken.has(repo.name))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map((repo) => ({ ...repo, flagship: false }));
  return [...picked, ...rest].slice(0, limit);
}
