/**
 * Knowledge Schemas
 * Zod validation schemas for knowledge item forms
 */

import { z } from 'zod';

/**
 * Create knowledge item
 */
export const createKnowledgeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  domain_id: z.string().uuid('Invalid domain ID'),
});

/**
 * Update knowledge item
 */
export const updateKnowledgeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional().nullable(),
  body: z.string().min(10, 'Body must be at least 10 characters').optional().nullable(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').optional().nullable(),
  domain_id: z.string().uuid('Invalid domain ID').optional().nullable(),
});

// Type exports
export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;
export type UpdateKnowledgeInput = z.infer<typeof updateKnowledgeSchema>;
