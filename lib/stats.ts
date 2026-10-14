import type { Role, YearMonth } from '@/content';
import { careerYears } from '@/lib/dates';

export type Stat = {
  id: 'years' | 'companies' | 'articles' | 'repos';
  value: number;
};

// Feed-based counts are optional: an unavailable feed drops its stat instead
// of showing zero.
export function buildStats({
  careerStart,
  roles,
  articles,
  repos,
  today,
}: {
  careerStart: YearMonth;
  roles: Role[];
  articles?: number;
  repos?: number;
  today?: Date;
}): Stat[] {
  const companies = new Set(
    roles
      .filter((role) => role.kind !== 'leadership')
      .map((role) => role.company.en)
  );
  const stats: Stat[] = [
    { id: 'years', value: careerYears(careerStart, today) },
    { id: 'companies', value: companies.size },
  ];
  if (articles !== undefined) stats.push({ id: 'articles', value: articles });
  if (repos !== undefined) stats.push({ id: 'repos', value: repos });
  return stats;
}
