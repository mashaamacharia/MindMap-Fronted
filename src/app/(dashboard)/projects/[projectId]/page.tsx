/**
 * Project Detail Page
 * Shows project info and list of challenges
 * Horizontal slide navigation for challenges
 */

'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Archive,
  Clock,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useProject,
  useProjectSummary,
  useChallenges,
  useDeleteProject,
  useArchiveProject,
} from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-canvas text-muted border-border',
  completed: 'bg-sky-50 text-sky-700 border-sky-200',
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: summary } = useProjectSummary(projectId);
  const { data: challenges, isLoading: challengesLoading } = useChallenges(1, 20);
  const deleteProject = useDeleteProject();
  const archiveProject = useArchiveProject();

  // Filter challenges for this project
  const projectChallenges = challenges?.items.filter((c) => c.project_id === projectId) || [];

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted');
      router.push('/projects');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleArchive = async () => {
    try {
      await archiveProject.mutateAsync(projectId);
      toast.success('Project archived');
      setShowArchiveDialog(false);
    } catch {
      toast.error('Failed to archive project');
    }
  };

  if (projectLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you&apos;re looking for doesn&apos;t exist or has been deleted."
        action={
          <Button asChild variant="outline">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Back to projects
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-h2 font-semibold text-ink truncate">
                {project.title}
              </h1>
              <Badge
                variant="outline"
                className={statusColors[project.status]}
              >
                {project.status}
              </Badge>
            </div>
            <p className="mt-1 text-caption text-muted flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              Updated {formatRelativeDate(project.updated_at)}
              {project.owner_name && (
                <span className="ml-2">by {project.owner_name}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Edit
            </Link>
          </Button>
          {project.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchiveDialog(true)}
            >
              <Archive className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Archive
            </Button>
          )}
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

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-h2 font-semibold text-ink">
                {summary.challenge_count}
              </div>
              <p className="text-caption text-muted">Challenges</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-h2 font-semibold text-ink">
                {summary.artifact_count}
              </div>
              <p className="text-caption text-muted">Artifacts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-body-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-md text-muted whitespace-pre-wrap">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Challenges */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-body-lg">Challenges</CardTitle>
          <Button asChild size="sm">
            <Link href={`/challenges/new?project=${projectId}`}>
              <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
              New Challenge
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {challengesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : projectChallenges.length > 0 ? (
            <div className="space-y-3">
              {projectChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-surface group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-md font-medium text-ink group-hover:text-ink">
                      {challenge.raw_text.slice(0, 100)}
                      {challenge.raw_text.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-caption text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {formatRelativeDate(challenge.created_at)}
                      </span>
                      {challenge.domain_title && (
                        <Badge variant="secondary" className="text-caption">
                          {challenge.domain_title}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted group-hover:text-ink transition-colors" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Lightbulb}
              title="No challenges yet"
              description="Create a challenge to start analyzing decisions"
            />
          )}
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{project.title}&quot;? This action
              cannot be undone and will also delete all associated challenges
              and artifacts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive project</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive &quot;{project.title}&quot;?
              You can restore it later from the archived projects section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleArchive}
              disabled={archiveProject.isPending}
            >
              {archiveProject.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Archiving...
                </>
              ) : (
                'Archive'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
