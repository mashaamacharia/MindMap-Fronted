/**
 * Organisation Types
 * Organisation and member management interfaces
 */

import type { OrgRole, OrgSizeCategory, PrimaryMarket, OrgPlan } from './roles';

export interface OrganisationRead {
  id: string;
  name: string;
  slug: string;
  industry: string;
  size_category: OrgSizeCategory;
  hq_location: string;
  primary_market: PrimaryMarket;
  plan: OrgPlan;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganisationUpdate {
  name?: string | null;
  industry?: string | null;
  size_category?: OrgSizeCategory | null;
  hq_location?: string | null;
  primary_market?: PrimaryMarket | null;
}

export interface OrgMemberRead {
  id: string;
  org_id: string;
  user_id: string;
  role: OrgRole;
  invited_at: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  email?: string | null;
}

export interface OrgMemberUpdate {
  role: OrgRole;
}

export interface TransferOwnershipRequest {
  target_user_id: string;
}
