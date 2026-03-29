/**
 * NewProjectModal
 * Modal dialog for creating a new project
 */

'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateProject } from '@/lib/hooks';
import type { ProjectCreateInput } from '@/lib/schemas';
import { ProjectForm } from './project-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** If true, navigates to the new project after creation */
  navigateOnCreate?: boolean;
}

/**
 * Modal for creating new projects
 * Used from projects list and sidebar
 */
export function NewProjectModal({
  open,
  onOpenChange,
  navigateOnCreate = true,
}: NewProjectModalProps) {
  const router = useRouter();
  const createProject = useCreateProject();

  const handleSubmit = async (data: ProjectCreateInput) => {
    try {
      const project = await createProject.mutateAsync(data);
      toast.success('Project created successfully');
      onOpenChange(false);
      
      if (navigateOnCreate) {
        router.push(`/projects/${project.id}`);
      }
    } catch (error) {
      // Error handled by mutation
      toast.error('Failed to create project');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Projects help you organize related decision challenges together.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createProject.isPending}
          error={createProject.error}
        />
      </DialogContent>
    </Dialog>
  );
}

export default NewProjectModal;
