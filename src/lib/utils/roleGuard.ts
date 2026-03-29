import type { OrgRole } from '../types';

export function roleGuard(membership_role: OrgRole | null, allowed_roles: OrgRole[]): boolean {
  if (!membership_role) return false;
  return allowed_roles.includes(membership_role);
}
