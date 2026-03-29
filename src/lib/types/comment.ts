/**
 * Comment Types
 * Comments on artifacts
 */

export interface CommentRead {
  id: string;
  artifact_id: string;
  org_id: string;
  author_id: string;
  body: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
  author_avatar_url?: string | null;
}

export interface CommentCreate {
  artifact_id: string;
  body: string;
}

export interface CommentUpdate {
  body: string;
}
