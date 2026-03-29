/**
 * Admin Schemas
 * Zod validation schemas for admin forms
 */

import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'analyst', 'viewer']);

export const adminUserCreateSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  role: userRoleSchema,
});

export const adminUserUpdateSchema = z.object({
  role: userRoleSchema.optional(),
  is_active: z.boolean().optional(),
  first_name: z
    .string()
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  last_name: z
    .string()
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
});

export type AdminUserCreateInput = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
