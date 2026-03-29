/**
 * ProjectForm
 * Form for creating and editing projects
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectCreateSchema, projectUpdateSchema, type ProjectCreateInput, type ProjectUpdateInput } from '@/lib/schemas';
import type { ProjectRead } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';

interface ProjectFormProps {
  project?: ProjectRead;
  onSubmit: (data: ProjectCreateInput | ProjectUpdateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: ProjectFormProps) {
  const isEditing = !!project;
  const schema = isEditing ? projectUpdateSchema : projectCreateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectCreateInput | ProjectUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <ErrorMessage
          message={error.message || 'Failed to save project. Please try again.'}
        />
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Project title</Label>
          <Input
            id="title"
            placeholder="Enter project title"
            {...register('title')}
            aria-invalid={!!errors.title}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-caption text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the project objectives and scope"
            rows={4}
            {...register('description')}
            aria-invalid={!!errors.description}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-caption text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {isEditing ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Save changes' : 'Create project'
          )}
        </Button>
      </div>
    </form>
  );
}
