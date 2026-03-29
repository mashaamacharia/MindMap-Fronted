/**
 * RoleGate Component
 * Role-based access control wrapper
 * 
 * Hierarchy: viewer=1, member=2, admin=3, owner=4
 * Renders children if user role >= minimum, else fallback or null
 */

'use client';

import type { ReactNode } from 'react';
import { useRole } from '@/lib/stores/authStore';
import type { OrgRole } from '@/lib/types';

interface RoleGateProps {
  /** Minimum role required to view children */
  minimum: OrgRole;
  /** Content to render if role requirement is met */
  children: ReactNode;
  /** Fallback content if role requirement is not met */
  fallback?: ReactNode;
}

const roleHierarchy: Record<OrgRole, number> = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
};

/**
 * Check if user role meets the minimum requirement
 */
export function hasMinimumRole(userRole: OrgRole | null, minimum: OrgRole): boolean {
  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[minimum];
}

/**
 * RoleGate component
 * Conditionally renders children based on user role
 */
export function RoleGate({ minimum, children, fallback = null }: RoleGateProps) {
  const role = useRole();

  if (!hasMinimumRole(role, minimum)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default RoleGate;
