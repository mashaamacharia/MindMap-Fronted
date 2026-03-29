/**
 * Artifact Types
 * Artifacts are the AI-generated decision documents
 */

import type { ArtifactStatus } from './roles';

export interface StrategicOption {
  label: string;
  rationale: string;
  estimated_effort: 'low' | 'medium' | 'high';
  estimated_impact: 'low' | 'medium' | 'high';
}

export interface RiskItem {
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface DecisionArtifact {
  title: string;
  executive_summary: string;
  decision_context: string;
  strategic_options: StrategicOption[];
  risks: RiskItem[];
  recommended_path: string;
  confidence_score: number;
  assumptions: string[];
  suggested_next_steps: string[];
  domain_code: string | null;
}

export interface ArtifactRead {
  id: string;
  project_id: string;
  org_id: string;
  challenge_id: string;
  version: number;
  status: ArtifactStatus;
  content: DecisionArtifact | null;
  ai_context_snapshot: Record<string, unknown> | null;
  knowledge_snapshot: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator_name?: string | null;
}

export interface ArtifactUpdate {
  content?: DecisionArtifact | null;
  status?: ArtifactStatus | null;
}

export interface ArtifactStatusResponse {
  artifact_id: string;
  status: ArtifactStatus;
}

export interface ArtifactContextResponse {
  artifact_id: string;
  ai_context_snapshot: Record<string, unknown>;
  knowledge_snapshot: Record<string, unknown>;
}

// Re-export ArtifactStatus from roles for convenience
export type { ArtifactStatus } from './roles';
