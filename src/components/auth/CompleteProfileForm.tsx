/**
 * CompleteProfileForm
 * Profile completion form (required before using AI features)
 * All dropdowns from useConstants()
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { completeProfileSchema, type CompleteProfileInput } from '@/lib/schemas';
import { useConstants } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Spinner } from '@/components/ui/Spinner';

interface CompleteProfileFormProps {
  onSubmit: (data: CompleteProfileInput) => Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
  defaultValues?: Partial<CompleteProfileInput>;
}

/**
 * Complete profile form component
 * Required step before users can access AI features
 */
export function CompleteProfileForm({
  onSubmit,
  isLoading,
  error,
  defaultValues,
}: CompleteProfileFormProps) {
  const { data: constants, isLoading: constantsLoading } = useConstants();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      job_title: defaultValues?.job_title || '',
      seniority_level: defaultValues?.seniority_level,
      primary_function: defaultValues?.primary_function,
      location: defaultValues?.location || '',
    },
  });

  const handleFormSubmit = async (data: CompleteProfileInput) => {
    await onSubmit(data);
  };

  if (constantsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h2 font-semibold text-ink">Complete your profile</h2>
        <p className="text-body-md text-muted mt-2">
          We need a few more details to personalise your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <ErrorMessage error={error ?? 'Failed to update profile. Please try again.'} />
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job_title">Job title</Label>
            <Input
              id="job_title"
              type="text"
              placeholder="Chief Strategy Officer"
              {...register('job_title')}
              aria-invalid={!!errors.job_title}
              disabled={isLoading}
            />
            {errors.job_title && (
            <p className="text-caption text-destructive">{errors.job_title.message}</p>
          )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seniority_level">Seniority level</Label>
            <Select
              defaultValue={defaultValues?.seniority_level}
              onValueChange={(value) =>
                setValue('seniority_level', value as CompleteProfileInput['seniority_level'])
              }
              disabled={isLoading}
            >
              <SelectTrigger id="seniority_level" aria-invalid={!!errors.seniority_level}>
                <SelectValue placeholder="Select seniority level" />
              </SelectTrigger>
              <SelectContent>
                {constants?.seniority_levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.seniority_level && (
            <p className="text-caption text-destructive">{errors.seniority_level.message}</p>
          )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_function">Primary function</Label>
            <Select
              defaultValue={defaultValues?.primary_function}
              onValueChange={(value) =>
                setValue('primary_function', value as CompleteProfileInput['primary_function'])
              }
              disabled={isLoading}
            >
              <SelectTrigger id="primary_function" aria-invalid={!!errors.primary_function}>
                <SelectValue placeholder="Select primary function" />
              </SelectTrigger>
              <SelectContent>
                {constants?.primary_functions.map((func) => (
                  <SelectItem key={func.value} value={func.value}>
                    {func.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primary_function && (
            <p className="text-caption text-destructive">{errors.primary_function.message}</p>
          )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="New York, USA"
              {...register('location')}
              aria-invalid={!!errors.location}
              disabled={isLoading}
            />
            {errors.location && (
            <p className="text-caption text-destructive">{errors.location.message}</p>
          )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              Complete profile
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default CompleteProfileForm;
