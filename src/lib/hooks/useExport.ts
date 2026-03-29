/**
 * Export Hooks
 * TanStack Query hooks for document export
 */

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import * as exportApi from '@/lib/api/export';

export const exportKeys = {
  all: ['export'] as const,
  history: (artifactId: string) => [...exportKeys.all, 'history', artifactId] as const,
};

/**
 * Trigger blob download via createObjectURL + anchor click
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Hook to export artifact as PDF
 */
export function useExportPdf() {
  return useMutation({
    mutationFn: async ({
      artifactId,
      filename,
    }: {
      artifactId: string;
      filename?: string;
    }) => {
      const blob = await exportApi.exportPdf(artifactId);
      downloadBlob(blob, filename ?? `artifact-${artifactId}.pdf`);
      return blob;
    },
  });
}

/**
 * Hook to export artifact as PPTX
 */
export function useExportPptx() {
  return useMutation({
    mutationFn: async ({
      artifactId,
      filename,
    }: {
      artifactId: string;
      filename?: string;
    }) => {
      const blob = await exportApi.exportPptx(artifactId);
      downloadBlob(blob, filename ?? `artifact-${artifactId}.pptx`);
      return blob;
    },
  });
}

/**
 * Hook to get export history for an artifact
 */
export function useExportHistory(artifactId: string | undefined) {
  return useQuery({
    queryKey: exportKeys.history(artifactId ?? ''),
    queryFn: () => exportApi.getExportHistory(artifactId!),
    enabled: !!artifactId,
  });
}
