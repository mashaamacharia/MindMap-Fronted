'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { useChallenge, useArtifacts, useDeleteChallenge } from '@/lib/hooks';
import { formatRelativeDate, formatDate } from '@/lib/utils';
import { AnalyzeButton } from '@/components/analyze';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: challenge, isLoading: challengeLoading } =
    useChallenge(challengeId);
  const { data: artifacts, isLoading: artifactsLoading } = useArtifacts({
    challenge_id: challengeId,
    page: 1,
    page_size: 20,
  });
  const deleteChallenge = useDeleteChallenge();

  const handleDelete = async () => {
    await deleteChallenge.mutateAsync(challengeId);
    router.push('/challenges');
  };

  if (challengeLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState
          title="Challenge not found"
          description="The challenge you're looking for doesn't exist or has been deleted."
          action={
            <Button asChild variant="outline">
              <Link href="/challenges">
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Back to challenges
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/challenges">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                <span className="sr-only">Back to challenges</span>
              </Link>
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-light tracking-tight text-ink truncate">
                  {challenge.title}
                </h1>
                <Badge variant="outline">{challenge.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted flex items-center gap-1">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                Updated {formatRelativeDate(challenge.updated_at)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AnalyzeButton
              challengeId={challengeId}
              disabled={challenge.status === 'analyzed'}
            />
            <Button asChild variant="outline" size="sm">
              <Link href={`/challenges/${challengeId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Delete
            </Button>
          </div>
        </div>

        {/* Project link */}
        {challenge.project && (
          <Link
            href={`/projects/${challenge.project.id}`}
            className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink transition-colors"
          >
            <FolderKanban className="h-4 w-4" strokeWidth={1.5} />
            {challenge.project.name}
          </Link>
        )}

        {/* Challenge Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {challenge.problem_statement || 'No problem statement provided'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {challenge.context || 'No context provided'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Constraints</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {challenge.constraints || 'No constraints provided'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Success Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {challenge.success_criteria || 'No success criteria provided'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Artifacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision Artifacts</CardTitle>
          </CardHeader>
          <CardContent>
            {artifactsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : artifacts?.results?.length ? (
              <div className="space-y-3">
                {artifacts.results.map((artifact) => (
                  <Link
                    key={artifact.id}
                    href={`/artifacts/${artifact.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      <FileText
                        className="h-4 w-4 text-muted"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {artifact.title}
                        </p>
                        <p className="text-xs text-muted">
                          Generated {formatDate(artifact.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">v{artifact.version}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No artifacts yet"
                description="Analyze this challenge to generate a decision artifact"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete challenge</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{challenge.title}&quot;? This
              action cannot be undone and will also delete all associated
              artifacts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteChallenge.isPending}
            >
              {deleteChallenge.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
