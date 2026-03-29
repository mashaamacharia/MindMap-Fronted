/**
 * Join Request Types
 * Organisation join request interfaces
 */

import type { OrgRole, JoinRequestStatus } from './roles';

export interface JoinRequestRead {
  id: string;
  org_id: string;
  user_id: string;
  status: JoinRequestStatus;
  requested_role: OrgRole;
  reviewed_by: string | null;
  reviewed_at: string | null;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
  requester_name?: string | null;
  requester_email?: string | null;
  reviewer_name?: string | null;
}

export interface JoinRequestApprove {
  role: OrgRole;
}

export interface JoinRequestDecline {
  reason?: string | null;
}
