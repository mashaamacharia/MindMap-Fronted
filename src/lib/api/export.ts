/**
 * Export API Functions
 * Document export endpoints (PDF, PPTX)
 */

import api from './axios';
import type { ExportRecordRead } from '@/lib/types';

/**
 * Export artifact as PDF
 * Returns a Blob
 */
export async function exportPdf(artifactId: string): Promise<Blob> {
  const { data } = await api.post<Blob>(`/export/pdf/${artifactId}`, null, {
    responseType: 'blob',
  });
  return data;
}

/**
 * Export artifact as PPTX
 * Returns a Blob
 */
export async function exportPptx(artifactId: string): Promise<Blob> {
  const { data } = await api.post<Blob>(`/export/pptx/${artifactId}`, null, {
    responseType: 'blob',
  });
  return data;
}

/**
 * Get export history for an artifact
 */
export async function getExportHistory(artifactId: string): Promise<ExportRecordRead[]> {
  const { data } = await api.get<ExportRecordRead[]>(`/export/history/${artifactId}`);
  return data;
}
