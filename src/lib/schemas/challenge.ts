/**
 * Challenge Schemas
 * Zod validation schemas for challenge forms
 */

import { z } from 'zod';

/**
 * Create challenge
 */
export const createChallengeSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  raw_text: z.string().min(10, 'Please provide more detail (at least 10 characters)'),
  domain_code: z.string().optional().nullable(),
});

// Type exports
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
