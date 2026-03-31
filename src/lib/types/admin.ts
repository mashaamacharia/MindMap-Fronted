/**
 * Admin Types
 * Administrative interfaces for user management and system settings
 */

import type { UserRead } from './user';
import type { OrgRole } from './roles';

/** Alias so admin API can import `User` directly */
export type User = UserRead;

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: OrgRole;
  is_active?: boolean;
  sort_by?: 'created_at' | 'last_login' | 'email';
  sort_order?: 'asc' | 'desc';
}

export interface AdminUserUpdate {
  role?: OrgRole;
  is_active?: boolean;
  full_name?: string;
  job_title?: string;
}

export interface AdminUserCreate {
  email: string;
  full_name: string;
  role: OrgRole;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_projects: number;
  total_challenges: number;
  total_artifacts: number;
  total_documents: number;
  users_by_role: Record<string, number>;
  activity_last_7_days: DailyActivity[];
}

export interface DailyActivity {
  date: string;
  logins: number;
  challenges_created: number;
  artifacts_generated: number;
}

/** Audit log entry returned by the admin audit-logs endpoint */
export interface AuditLogEntry {
  id: string;
  org_id?: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata?: Record<string, unknown> | null;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user_name?: string | null;
  user?: Pick<UserRead, 'id' | 'email' | 'full_name'>;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  user_id?: string;
  action?: string;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
}
