'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createChallengeSchema,
  updateChallengeSchema,
  type CreateChallengeInput,
  type UpdateChallengeInput,
} from '@/lib/schemas';
import { useConstants, useDomains, useProjects } from '@/lib/hooks';
import type { Challenge } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  challenge?: Challenge;
  defaultProjectId?: string;
  onSubmit: (data: CreateChallengeInput | UpdateChallengeInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ChallengeForm({
  challenge,
  defaultProjectId,
  onSubmit,
  onCancel,
  isLoading,
  error,
}: ChallengeFormProps) {
  const isEditing = !!challenge;
  const schema = isEditing ? updateChallengeSchema : createChallengeSchema;

  const { data: constants, isLoading: constantsLoading } = useConstants();
  const { data: domains, isLoading: domainsLoading } = useDomains();
  const { data: projects, isLoading: projectsLoading } = useProjects({
    page: 1,
    page_size: 100,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateChallengeInput | UpdateChallengeInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: challenge?.title || '',
      problem_statement: challenge?.problem_statement || '',
      context: challenge?.context || '',
      constraints: challenge?.constraints || '',
      success_criteria: challenge?.success_criteria || '',
      time_horizon: challenge?.time_horizon || undefined,
      decision_domain: challenge?.decision_domain || undefined,
      project_id: challenge?.project_id || defaultProjectId || undefined,
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
        <ErrorMessage
          message={error.message || 'Failed to save challenge. Please try again.'}
        />
      )}

      <div className="space-y-4">
        {/* Project selection */}
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="project_id">Project</Label>
            <Select
              value={watch('project_id') || ''}
              onValueChange={(value) => setValue('project_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project (optional)" />
              </SelectTrigger>
              <SelectContent>
                {projects?.results?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted">
              Optionally associate this challenge with a project
            </p>
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Challenge title</Label>
          <Input
            id="title"
            placeholder="E.g., Market expansion strategy for Q3"
            {...register('title')}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Problem statement */}
        <div className="space-y-2">
          <Label htmlFor="problem_statement">Problem statement</Label>
          <Textarea
            id="problem_statement"
            placeholder="Describe the core decision or challenge you're facing..."
            rows={4}
            {...register('problem_statement')}
            aria-invalid={!!errors.problem_statement}
          />
          {errors.problem_statement && (
            <p className="text-sm text-red-600">
              {errors.problem_statement.message}
            </p>
          )}
          <p className="text-xs text-muted">
            Be specific about what decision needs to be made
          </p>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label htmlFor="context">Context</Label>
          <Textarea
            id="context"
            placeholder="Provide relevant background information, market conditions, or organizational context..."
            rows={3}
            {...register('context')}
            aria-invalid={!!errors.context}
          />
          {errors.context && (
            <p className="text-sm text-red-600">{errors.context.message}</p>
          )}
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <Label htmlFor="constraints">Constraints</Label>
          <Textarea
            id="constraints"
            placeholder="Budget limits, time constraints, regulatory requirements, resource limitations..."
            rows={3}
            {...register('constraints')}
            aria-invalid={!!errors.constraints}
          />
          {errors.constraints && (
            <p className="text-sm text-red-600">{errors.constraints.message}</p>
          )}
        </div>

        {/* Success criteria */}
        <div className="space-y-2">
          <Label htmlFor="success_criteria">Success criteria</Label>
          <Textarea
            id="success_criteria"
            placeholder="How will you measure if this decision was successful? What outcomes are you targeting?"
            rows={3}
            {...register('success_criteria')}
            aria-invalid={!!errors.success_criteria}
          />
          {errors.success_criteria && (
            <p className="text-sm text-red-600">
              {errors.success_criteria.message}
            </p>
          )}
        </div>

        {/* Time horizon and Domain */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="time_horizon">Time horizon</Label>
            <Select
              value={watch('time_horizon') || ''}
              onValueChange={(value) =>
                setValue('time_horizon', value as CreateChallengeInput['time_horizon'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {constants?.time_horizons?.map((horizon) => (
                  <SelectItem key={horizon.value} value={horizon.value}>
                    {horizon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decision_domain">Decision domain</Label>
            <Select
              value={watch('decision_domain') || ''}
              onValueChange={(value) => setValue('decision_domain', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains?.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save changes'
              : 'Create challenge'}
        </Button>
      </div>
    </form>
  );
}
