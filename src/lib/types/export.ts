/**
 * Export Types
 * Export record interfaces
 */

import type { ExportFormat } from './roles';

export interface ExportRecordRead {
  id: string;
  artifact_id: string;
  project_id: string;
  org_id: string;
  format: ExportFormat;
  exported_by: string;
  file_size_bytes: number | null;
  created_at: string;
  exporter_name?: string | null;
}
