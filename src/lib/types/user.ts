/**
 * User Types
 * User profile and update interfaces
 */

import type { SeniorityLevel, PrimaryFunction } from './roles';

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  job_title?: string | null;
  seniority_level?: SeniorityLevel | null;
  primary_function?: PrimaryFunction | null;
  location?: string | null;
  is_active: boolean;
  is_verified: boolean;
  profile_completed: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSuperadminRead extends UserRead {
  is_superadmin: boolean;
}

export interface UserUpdate {
  full_name?: string | null;
  avatar_url?: string | null;
  job_title?: string | null;
  seniority_level?: SeniorityLevel | null;
  primary_function?: PrimaryFunction | null;
  location?: string | null;
}
