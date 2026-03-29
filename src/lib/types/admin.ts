/**
 * Admin Types
 * Administrative interfaces for user management and system settings
 */

import type { UserRead } from './user';
import type { OrgRole } from './roles';

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
  first_name?: string;
  last_name?: string;
}

export interface AdminUserCreate {
  email: string;
  first_name: string;
  last_name: string;
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

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
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
