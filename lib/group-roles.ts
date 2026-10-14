import type { L10n, Role } from '@/content';

export type RoleGroup = { company: L10n; roles: Role[] };

// Consecutive roles at the same company become one timeline node (a
// promotion); a return to an earlier employer starts a new node.
export function groupRoles(roles: Role[]): RoleGroup[] {
  const groups: RoleGroup[] = [];
  for (const role of roles) {
    const last = groups.at(-1);
    if (last && last.company.en === role.company.en) {
      last.roles.push(role);
    } else {
      groups.push({ company: role.company, roles: [role] });
    }
  }
  return groups;
}
