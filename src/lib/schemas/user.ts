/**
 * User Schemas
 * Zod validation schemas for user profile forms
 */

import { z } from 'zod';

/**
 * Update user profile
 */
export const updateUserSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  job_title: z.string().optional(),
  seniority_level: z
    .enum([
      'c_suite',
      'vp_director',
      'senior_manager',
      'manager',
      'individual_contributor',
    ])
    .optional(),
  primary_function: z
    .enum([
      'strategy',
      'technology',
      'finance',
      'operations',
      'people',
      'marketing',
      'legal',
    ])
    .optional(),
  location: z.string().optional(),
  avatar_url: z.string().url('Please enter a valid URL').optional().nullable(),
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
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
