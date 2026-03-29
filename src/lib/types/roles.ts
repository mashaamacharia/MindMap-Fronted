/**
 * Role Types
 * TypeScript union types ONLY. These are type-level constraints for the compiler,
 * not display values. Display labels always come from GET /api/v1/constants/.
 */

export type OrgRole = 'viewer' | 'member' | 'admin' | 'owner';

export type ArtifactStatus = 'processing' | 'draft' | 'reviewing' | 'approved' | 'exported';

export type ProjectStatus = 'active' | 'archived';

export type KnowledgeItemStatus = 'draft' | 'published';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export type JoinRequestStatus = 'pending' | 'approved' | 'declined' | 'cancelled';

export type ExportFormat = 'pdf' | 'pptx';

export type SeniorityLevel =
  | 'c_suite'
  | 'vp_director'
  | 'senior_manager'
  | 'manager'
  | 'individual_contributor';

export type PrimaryFunction =
  | 'strategy'
  | 'technology'
  | 'finance'
  | 'operations'
  | 'people'
  | 'marketing'
  | 'legal';

export type OrgPlan = 'free' | 'pro' | 'enterprise';

export type OrgSizeCategory = '1-50' | '51-200' | '201-1000' | '1001-5000' | '5000+';

export type PrimaryMarket = 'domestic' | 'regional' | 'global';
