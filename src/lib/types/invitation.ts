/**
 * Invitation Types
 * Organisation invitation interfaces
 */

import type { OrgRole, InvitationStatus } from './roles';

export interface InvitationRead {
  id: string;
  org_id: string;
  invited_by: string;
  email: string;
  role: OrgRole;
  status: InvitationStatus;
  expires_at: string;
  accepted_by: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  invited_by_name?: string | null;
  accepted_by_name?: string | null;
}

export interface InvitationCreate {
  email: string;
  role: OrgRole;
}
