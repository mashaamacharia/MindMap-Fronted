'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createChallengeSchema, type CreateChallengeInput } from '@/lib/schemas';
import { useConstants, useDomains, useProjects } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/Skeleton';

interface ChallengeFormProps {
  defaultProjectId?: string;
  onSubmit: (data: CreateChallengeInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ChallengeForm({
  defaultProjectId,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: ChallengeFormProps) {
  const schema = createChallengeSchema;

  const { data: constants, isLoading: constantsLoading } = useConstants();
  const { data: domains, isLoading: domainsLoading } = useDomains();
  const { data: projects, isLoading: projectsLoading } = useProjects(1, 100);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateChallengeInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: defaultProjectId || '',
      raw_text: '',
      domain_code: undefined,
    },
  });

  const isOptionsLoading = constantsLoading || domainsLoading || projectsLoading;

  if (isOptionsLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <ErrorMessage error={error ?? 'Failed to save challenge. Please try again.'} />
      )}

      <div className="space-y-4">
        {/* Project selection */}
        <div className="space-y-2">
          <Label htmlFor="project_id">Project</Label>
          <Select
            value={watch('project_id') || undefined}
            onValueChange={(value) => setValue('project_id', value === 'none' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {projects?.items?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted">Optionally associate this challenge with a project</p>
        </div>

        {/* Raw text */}
        <div className="space-y-2">
          <Label htmlFor="raw_text">Describe your challenge</Label>
          <Textarea
            id="raw_text"
            placeholder="Describe the business problem or decision you need help with..."
            rows={6}
            {...register('raw_text')}
            aria-invalid={!!errors.raw_text}
          />
          {errors.raw_text && <p className="text-sm text-destructive">{errors.raw_text.message}</p>}
        </div>

        {/* Domain */}
        <div className="space-y-2">
          <Label htmlFor="domain_code">Decision domain</Label>
          <Select
            value={watch('domain_code') || undefined}
            onValueChange={(value) => setValue('domain_code', value === 'none' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select domain (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Auto-detect</SelectItem>
              {domains?.map((domain) => (
                <SelectItem key={domain.id} value={domain.code}>
                  {domain.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create challenge'}
        </Button>
      </div>
    </form>
  );
}
