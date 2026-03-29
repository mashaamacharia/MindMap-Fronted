/**
 * Comment Schemas
 * Zod validation schemas for comment forms
 */

import { z } from 'zod';

/**
 * Create comment
 */
export const createCommentSchema = z.object({
  artifact_id: z.string().uuid('Invalid artifact ID'),
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be less than 2000 characters'),
});

/**
 * Update comment
 */
export const updateCommentSchema = z.object({
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be less than 2000 characters'),
});

// Type exports
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
