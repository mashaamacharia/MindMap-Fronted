/**
 * Authentication Schemas
 * Zod validation schemas for passwordless auth forms
 */

import { z } from 'zod';

/**
 * Email entry for detect-path
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

/**
 * OTP verification
 */
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must be 6 digits'),
});

/**
 * Sign-in method selection
 */
export const signinMethodSchema = z.object({
  method: z.enum(['magic_link', 'otp_code']),
});

/**
 * Full owner signup - creates org
 */
export const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  job_title: z.string().min(2, 'Job title must be at least 2 characters'),
  seniority_level: z.string().min(1, 'Seniority level is required'),
  primary_function: z.string().min(1, 'Primary function is required'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  org_name: z.string().min(2, 'Organisation name must be at least 2 characters'),
  org_slug: z.string().min(2, 'Organisation slug must be at least 2 characters'),
  org_industry: z.string().min(1, 'Industry is required'),
  org_size_category: z.string().min(1, 'Organisation size is required'),
  org_hq_location: z.string().min(2, 'HQ location must be at least 2 characters'),
  org_primary_market: z.string().min(1, 'Primary market is required'),
});

/**
 * Signup and request to join existing org
 */
export const signupAndRequestSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  job_title: z.string().min(2, 'Job title must be at least 2 characters'),
  seniority_level: z.enum([
    'c_suite',
    'vp_director',
    'senior_manager',
    'manager',
    'individual_contributor',
  ]),
  primary_function: z.enum([
    'strategy',
    'technology',
    'finance',
    'operations',
    'people',
    'marketing',
    'legal',
  ]),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  org_slug: z.string().min(2, 'Organisation slug is required'),
  requested_role: z.enum(['member', 'viewer']),
});

/**
 * Accept invitation
 */
export const acceptInvitationSchema = z.object({
  invite_token: z.string().min(1, 'Invitation token is required'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  job_title: z.string().min(2, 'Job title must be at least 2 characters'),
  seniority_level: z.enum([
    'c_suite',
    'vp_director',
    'senior_manager',
    'manager',
    'individual_contributor',
  ]),
  primary_function: z.enum([
    'strategy',
    'technology',
    'finance',
    'operations',
    'people',
    'marketing',
    'legal',
  ]),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

/**
 * Complete profile (required before using AI features)
 */
export const completeProfileSchema = z.object({
  job_title: z.string().min(2, 'Job title must be at least 2 characters'),
  seniority_level: z.enum([
    'c_suite',
    'vp_director',
    'senior_manager',
    'manager',
    'individual_contributor',
  ]),
  primary_function: z.enum([
    'strategy',
    'technology',
    'finance',
    'operations',
    'people',
    'marketing',
    'legal',
  ]),
  location: z.string().min(2, 'Location must be at least 2 characters'),
});

// Type exports
export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type SigninMethodInput = z.infer<typeof signinMethodSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SignupAndRequestInput = z.infer<typeof signupAndRequestSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
