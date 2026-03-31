/**
 * ProjectList
 * Grid display of project cards with empty state
 */

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FolderKanban, Plus } from 'lucide-react';
import type { ProjectRead, ProjectSummary, PaginatedResponse } from '@/lib/types';
import { useDeleteProject, useArchiveProject, useUnarchiveProject, useDuplicateProject } from '@/lib/hooks';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

type ProjectItem = ProjectRead | ProjectSummary;

interface ProjectListProps {
  data?: PaginatedResponse<ProjectItem>;
  isLoading?: boolean;
  onEdit?: (project: ProjectItem) => void;
  onCreateNew?: () => void;
}

export function ProjectList({
  data,
  isLoading,
  onEdit,
  onCreateNew,
}: ProjectListProps) {
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [projectToArchive, setProjectToArchive] = useState<ProjectItem | null>(null);
  const deleteProject = useDeleteProject();
  const archiveProject = useArchiveProject();
  const unarchiveProject = useUnarchiveProject();
  const duplicateProject = useDuplicateProject();

  const handleUnarchive = async (project: ProjectItem) => {
    try {
      await unarchiveProject.mutateAsync(project.id);
      toast.success('Project unarchived');
    } catch {
      toast.error('Failed to unarchive project');
    }
  };

  const handleDuplicate = async (project: ProjectItem) => {
    try {
      await duplicateProject.mutateAsync(project.id);
      toast.success('Project duplicated');
    } catch {
      toast.error('Failed to duplicate project');
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject.mutateAsync(projectToDelete.id);
      setProjectToDelete(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleArchive = async () => {
    if (!projectToArchive) return;
    try {
      await archiveProject.mutateAsync(projectToArchive.id);
      setProjectToArchive(null);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data?.items?.length) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to organize your decision challenges"
        action={
          onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
              Create project
            </Button>
          )
        }
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((project: ProjectItem) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={onEdit}
            onDelete={setProjectToDelete}
            onArchive={setProjectToArchive}
            onUnarchive={handleUnarchive}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{projectToDelete?.title}&quot;? This
              action cannot be undone and will also delete all associated
              challenges and artifacts.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
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

      {/* Archive confirmation dialog */}
      <Dialog
        open={!!projectToArchive}
        onOpenChange={(open) => !open && setProjectToArchive(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive project</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive &quot;{projectToArchive?.title}&quot;?
              You can restore it later from the archived projects section.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToArchive(null)}>
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
    </>
  );
}
