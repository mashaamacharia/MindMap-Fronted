/**
 * Organisation Schemas
 * Zod validation schemas for organisation forms
 */

import { z } from 'zod';

/**
 * Update organisation
 */
export const updateOrgSchema = z.object({
  name: z.string().min(2, 'Organisation name must be at least 2 characters').optional(),
  industry: z.string().optional(),
  size_category: z
    .enum(['1-50', '51-200', '201-1000', '1001-5000', '5000+'])
    .optional(),
  hq_location: z.string().optional(),
  primary_market: z.enum(['domestic', 'regional', 'global']).optional(),
});

/**
 * Invite member to organisation
 */
export const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['viewer', 'member', 'admin'], {
    required_error: 'Please select a role',
  }),
});

/**
 * Transfer ownership
 */
export const transferOwnerSchema = z.object({
  target_user_id: z.string().uuid('Invalid user ID'),
});

// Type exports
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type TransferOwnerInput = z.infer<typeof transferOwnerSchema>;
