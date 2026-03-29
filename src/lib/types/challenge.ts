/**
 * Challenge Types
 * Challenges are business problems that executives input for AI analysis
 */

export interface ChallengeRead {
  id: string;
  project_id: string;
  org_id: string;
  raw_text: string;
  domain_id: string | null;
  created_by: string;
  created_at: string;
  domain_code?: string | null;
  domain_title?: string | null;
  creator_name?: string | null;
}

export interface ChallengeCreate {
  project_id: string;
  raw_text: string;
  domain_code?: string | null;
}
