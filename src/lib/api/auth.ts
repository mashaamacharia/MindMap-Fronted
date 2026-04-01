/**
 * Auth API Functions
 * Passwordless authentication endpoints (OTP + magic link)
 * 
 * IMPORTANT:
 * - refresh and logout endpoints send NO body (cookie-based)
 * - All requests go through the configured axios instance
 */

import api from './axios';
import type {
  DetectPathRequest,
  DetectPathResponse,
  SignupRequest,
  SignupResponse,
  SignupAndRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
  RequestSigninRequest,
  ResendOtpRequest,
  RequestVerificationRequest,
  ResendMagicLinkRequest,
  AcceptInvitationRequest,
  SelectOrgRequest,
  SelectOrgResponse,
  AuthMeResponse,
  AuthTokenPair,
  GenericMessageResponse,
} from '@/lib/types';

/**
 * Detect auth path for email
 * Returns: owner_signup | returning_user | invited_member | join_request
 */
export async function detectPath(data: DetectPathRequest): Promise<DetectPathResponse> {
  const { data: response } = await api.post<DetectPathResponse>('/auth/detect-path', data);
  return response;
}

/**
 * Signup as org owner (creates new org)
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const { data: response } = await api.post<SignupResponse>('/auth/signup', data);
  return response;
}

/**
 * Signup and request to join existing org
 */
export async function signupAndRequest(data: SignupAndRequest): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>(
    '/auth/signup-and-request',
    data
  );
  return response;
}

/**
 * Verify OTP code
 * Response can be: AuthTokenPair | RequiresOrgSelection | PendingApproval
 */
export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const { data: response } = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
  return response;
}

/**
 * Verify magic link token
 */
export async function verifyMagicLink(token: string): Promise<VerifyOtpResponse> {
  const { data: response } = await api.get<VerifyOtpResponse>(
    `/auth/verify-magic-link?token=${encodeURIComponent(token)}`
  );
  return response;
}

/**
 * Request sign-in (sends OTP or magic link)
 */
export async function requestSignin(data: RequestSigninRequest): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>('/auth/request-signin', data);
  return response;
}

/**
 * Resend OTP code
 */
export async function resendOtp(data: ResendOtpRequest): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>('/auth/resend-otp', data);
  return response;
}

/**
 * Request email verification for unverified users
 */
export async function requestVerification(data: RequestVerificationRequest): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>('/auth/request-verification', data);
  return response;
}

/**
 * Resend magic link
 */
export async function resendMagicLink(data: ResendMagicLinkRequest): Promise<GenericMessageResponse> {
  const { data: response } = await api.post<GenericMessageResponse>('/auth/resend-magic-link', data);
  return response;
}

/**
 * Accept invitation
 */
export async function acceptInvitation(data: AcceptInvitationRequest): Promise<AuthTokenPair> {
  const { data: response } = await api.post<AuthTokenPair>('/auth/accept-invitation', data);
  return response;
}

/**
 * Select org (when user belongs to multiple orgs)
 * Uses temp_token from VerifyOtpRequiresOrgSelection response
 */
export async function selectOrg(
  data: SelectOrgRequest,
  tempToken?: string
): Promise<SelectOrgResponse> {
  const { data: response } = await api.post<SelectOrgResponse>(
    '/auth/select-org',
    data,
    tempToken ? { headers: { Authorization: `Bearer ${tempToken}` } } : undefined
  );
  return response;
}

/**
 * Refresh access token
 * IMPORTANT: No body - uses HTTP-only cookie
 */
export async function refresh(): Promise<AuthTokenPair> {
  const { data: response } = await api.post<AuthTokenPair>('/auth/refresh');
  return response;
}

/**
 * Logout current user
 * IMPORTANT: No body - uses HTTP-only cookie
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

/**
 * Get current auth info (user_id, org_id, role, email)
 */
export async function getMe(): Promise<AuthMeResponse> {
  const { data: response } = await api.get<AuthMeResponse>('/auth/me');
  return response;
}
