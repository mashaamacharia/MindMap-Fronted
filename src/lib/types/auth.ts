/**
 * Authentication Types
 * Auth tokens, detect-path flow, signup/signin interfaces
 */

import type { OrgRole, SeniorityLevel, PrimaryFunction } from './roles';

export interface AuthTokenPair {
  access_token: string;
  token_type: string;
  refresh_token?: string | null;
}

export interface AuthMeResponse {
  user_id: string;
  org_id: string;
  role: OrgRole;
  email: string;
}

export interface DetectPathOrg {
  id?: string;
  name: string;
  slug: string;
  industry: string;
}

export interface DetectPathResponse {
  path: 'owner_signup' | 'invited_member' | 'join_request' | 'returning_user' | 'unverified_user';
  org?: DetectPathOrg | null;
  invitation?: { role: string; invited_by_name: string } | null;
}

export interface SignupRequest {
  full_name: string;
  email: string;
  job_title: string;
  seniority_level: string;
  primary_function: string;
  location: string;
  org_name: string;
  org_slug: string;
  org_industry: string;
  org_size_category: string;
  org_hq_location: string;
  org_primary_market: string;
}

export interface SignupResponse {
  message: string;
  user_id: string;
}

export interface SignupAndRequest {
  full_name: string;
  email: string;
  job_title: string;
  seniority_level: SeniorityLevel;
  primary_function: PrimaryFunction;
  location: string;
  org_slug: string;
  requested_role: 'member' | 'viewer';
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  purpose: 'signup' | 'signin' | 'verify';
}

export interface VerifyOtpRequiresOrgSelection {
  requires_org_selection: true;
  orgs: DetectPathOrg[];
  temp_token: string;
}

export interface VerifyOtpPendingResponse {
  status: 'pending_approval';
  org: DetectPathOrg;
}

export type VerifyOtpResponse =
  | AuthTokenPair
  | VerifyOtpRequiresOrgSelection
  | VerifyOtpPendingResponse;

export interface RequestSigninRequest {
  email: string;
  method: 'magic_link' | 'otp_code';
}

export interface ResendOtpRequest {
  email: string;
  purpose: 'signup' | 'signin' | 'verify';
}

export interface RequestVerificationRequest {
  email: string;
  method: 'magic_link' | 'otp_code';
}

export interface ResendMagicLinkRequest {
  email: string;
  purpose: 'signin' | 'verify';
}

export interface AcceptInvitationRequest {
  invite_token: string;
  full_name: string;
  job_title: string;
  seniority_level: SeniorityLevel;
  primary_function: PrimaryFunction;
  location: string;
}

export interface SelectOrgRequest {
  org_id: string;
}

export interface SelectOrgResponse {
  access_token: string;
  token_type: string;
  org: DetectPathOrg;
  refresh_token?: string | null;
}

export interface DetectPathRequest {
  email: string;
}
