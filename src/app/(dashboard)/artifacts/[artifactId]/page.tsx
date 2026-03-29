'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Download,
  FileText,
  Presentation,
  Share2,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import {
  useArtifact,
  useApproveArtifact,
  useShareArtifact,
  useDeleteArtifact,
  useExportPdf,
  useExportPptx,
  useReanalyze,
  useAnalyzeStatus,
} from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores';
import { ArtifactViewer } from '@/components/artifacts';
import { CommentList } from '@/components/comments';
import { RoleGate } from '@/components/ui/RoleGate';
import { SoundWave } from '@/components/ui/SoundWave';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/Separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { useRouter } from 'next/navigation';

export default function ArtifactDetailPage({
  params,
}: {
  params: Promise<{ artifactId: string }>;
}) {
  const { artifactId } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const { data: artifact, isLoading, refetch } = useArtifact(artifactId);
  const approveArtifact = useApproveArtifact();
  const shareArtifact = useShareArtifact();
  const deleteArtifact = useDeleteArtifact();
  const exportPdf = useExportPdf();
  const exportPptx = useExportPptx();
  const reanalyze = useReanalyze();
  const { data: analyzeStatus } = useAnalyzeStatus(
    isReanalyzing ? artifactId : undefined,
    isReanalyzing
  );

  // When re-analysis completes, stop polling and refetch artifact
  useEffect(() => {
    if (isReanalyzing && analyzeStatus && analyzeStatus.status !== 'processing') {
      setIsReanalyzing(false);
      refetch();
      toast.success('Re-analysis complete');
    }
  }, [isReanalyzing, analyzeStatus, refetch]);

  const handleApprove = async () => {
    try {
      await approveArtifact.mutateAsync(artifactId);
      toast.success('Artifact approved successfully');
    } catch {
      toast.error('Failed to approve artifact');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareArtifact.mutateAsync(artifactId);
      await navigator.clipboard.writeText(result.share_url);
      toast.success('Share link copied to clipboard');
    } catch {
      toast.error('Failed to generate share link');
    }
  };

  const handleExportPdf = async () => {
    try {
      const filename = artifact?.content?.title
        ? `${artifact.content.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
        : `artifact-${artifactId}.pdf`;
      await exportPdf.mutateAsync({ artifactId, filename });
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportPptx = async () => {
    try {
      const filename = artifact?.content?.title
        ? `${artifact.content.title.replace(/[^a-z0-9]/gi, '_')}.pptx`
        : `artifact-${artifactId}.pptx`;
      await exportPptx.mutateAsync({ artifactId, filename });
      toast.success('PPTX exported successfully');
    } catch {
      toast.error('Failed to export PPTX');
    }
  };

  const handleReanalyze = async () => {
    try {
      setIsReanalyzing(true);
      await reanalyze.mutateAsync(artifactId);
    } catch {
      setIsReanalyzing(false);
      toast.error('Failed to start re-analysis');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArtifact.mutateAsync(artifactId);
      toast.success('Artifact deleted');
      router.push('/artifacts');
    } catch {
      toast.error('Failed to delete artifact');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState
          title="Artifact not found"
          description="The artifact you're looking for doesn't exist or has been deleted."
          action={
            <Button asChild variant="outline">
              <Link href="/artifacts">
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Back to artifacts
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/artifacts">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                <span className="sr-only">Back to artifacts</span>
              </Link>
            </Button>
            {artifact.challenge_id && (
              <Link
                href={`/projects/${artifact.project_id}/challenges/${artifact.challenge_id}`}
                className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink transition-colors"
              >
                <Lightbulb className="h-4 w-4" strokeWidth={1.5} />
                View Challenge
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export PDF */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exportPdf.isPending}
            >
              {exportPdf.isPending ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <FileText className="mr-2 h-4 w-4" strokeWidth={1.5} />
              )}
              Export PDF
            </Button>

            {/* Export PPTX */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPptx}
              disabled={exportPptx.isPending}
            >
              {exportPptx.isPending ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <Presentation className="mr-2 h-4 w-4" strokeWidth={1.5} />
              )}
              Export PPTX
            </Button>

            {/* Re-analyze */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReanalyze}
              disabled={isReanalyzing || reanalyze.isPending}
            >
              {isReanalyzing ? (
                <Spinner className="mr-2 h-4 w-4" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" strokeWidth={1.5} />
              )}
              {isReanalyzing ? 'Analyzing...' : 'Re-analyse'}
            </Button>

            {/* Approve — ADMIN+ via RoleGate */}
            <RoleGate minimum="admin">
              {artifact.status !== 'approved' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleApprove}
                  disabled={approveArtifact.isPending}
                >
                  <CheckCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  {approveArtifact.isPending ? 'Approving...' : 'Approve'}
                </Button>
              )}
            </RoleGate>

            {/* More actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy share link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-muted focus:text-ink"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete artifact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* SoundWave during re-analysis */}
        {isReanalyzing && (
          <div className="py-8">
            <SoundWave state="thinking" />
            <p className="mt-4 text-center text-caption text-muted">
              Re-analysing this challenge. This may take a moment.
            </p>
          </div>
        )}

        {/* Artifact content */}
        {!isReanalyzing && <ArtifactViewer artifact={artifact} />}

        {/* Comments */}
        {!isReanalyzing && (
          <>
            <Separator className="my-8" />
            <CommentList artifactId={artifactId} />
          </>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete artifact</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the artifact
              and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteArtifact.isPending}
            >
              {deleteArtifact.isPending ? 'Deleting...' : 'Delete artifact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
