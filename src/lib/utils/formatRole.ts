import type { OrgRole } from '../types';

export function formatRole(role: OrgRole | string | null): string {
  if (!role) return '';
  // Convert roles like 'admin' to 'Admin'
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
