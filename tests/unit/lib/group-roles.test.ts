// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { experience, type Role } from '@/content';
import { groupRoles } from '@/lib/group-roles';

const role = (id: string, company: string) =>
  ({ ...experience[0], id, company: { en: company, tr: company } }) as Role;

describe('groupRoles', () => {
  it('folds the Sisal promotion into one node', () => {
    const groups = groupRoles(experience);
    expect(groups.map((group) => group.roles.length)).toEqual([2, 1, 1, 1]);
  });

  it('never merges non-consecutive roles at the same company', () => {
    const groups = groupRoles([role('a', 'A'), role('b', 'B'), role('c', 'A')]);
    expect(groups.map((group) => group.roles.map((r) => r.id))).toEqual([
      ['a'],
      ['b'],
      ['c'],
    ]);
  });
});
