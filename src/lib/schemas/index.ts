/**
 * Zod Schemas Barrel Export
 * All validation schemas exported from a single entry point
 */

export * from './auth';
export * from './user';
export * from './project';
export * from './challenge';
export * from './comment';
export * from './organisation';
export * from './knowledge';

// Backwards-compatible aliases for older consumer names
export { createProjectSchema as projectCreateSchema, updateProjectSchema as projectUpdateSchema } from './project';
export type { CreateProjectInput as ProjectCreateInput, UpdateProjectInput as ProjectUpdateInput } from './project';
