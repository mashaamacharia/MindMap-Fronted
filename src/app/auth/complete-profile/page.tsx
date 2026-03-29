/**
 * Complete Profile Page
 * Required when profile_completed = false
 * All dropdowns from useConstants()
 */

'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CompleteProfileForm } from '@/components/auth';
import { useAuthStore } from '@/lib/stores';
import { useMe } from '@/lib/hooks';
import * as usersApi from '@/lib/api/users';
import type { CompleteProfileInput } from '@/lib/schemas';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, setUser, isAuthenticated } = useAuthStore();
  const { data: currentUser, isLoading: userLoading } = useMe();

  // Complete profile mutation
  const completeProfileMutation = useMutation({
    mutationFn: (data: CompleteProfileInput) => usersApi.completeProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success('Profile completed successfully');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const handleSubmit = async (data: CompleteProfileInput) => {
    await completeProfileMutation.mutateAsync(data);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="p-6 text-center">
        <p className="text-body-md text-muted">Please sign in first</p>
        <Button className="mt-4" onClick={() => router.push('/auth/login')}>
          Sign in
        </Button>
      </Card>
    );
  }

  // Loading state
  if (userLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Spinner size="lg" />
        <p className="text-body-md text-muted">Loading your profile...</p>
      </div>
    );
  }

  // Already completed - redirect
  if (currentUser?.profile_completed) {
    router.push('/dashboard');
    return null;
  }

  return (
    <CompleteProfileForm
      onSubmit={handleSubmit}
      isLoading={completeProfileMutation.isPending}
      error={completeProfileMutation.error}
      defaultValues={{
        job_title: currentUser?.job_title || '',
        seniority_level: currentUser?.seniority_level || undefined,
        primary_function: currentUser?.primary_function || undefined,
        location: currentUser?.location || '',
      }}
    />
  );
}
