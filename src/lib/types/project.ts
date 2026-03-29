/**
 * Project Types
 * Projects contain challenges and serve as organizational containers
 */

import type { ProjectStatus } from './roles';

export interface ProjectRead {
  id: string;
  org_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  owner_name?: string | null;
}

export interface ProjectCreate {
  title: string;
  description?: string | null;
}

export interface ProjectUpdate {
  title?: string | null;
  description?: string | null;
}

export interface ProjectSummary {
  id: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  challenge_count: number;
  artifact_count: number;
}

// Re-export ProjectStatus from roles for convenience
export type { ProjectStatus } from './roles';
