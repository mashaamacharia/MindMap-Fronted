'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateUserSchema, type UpdateUserInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores';
import { useUpdateProfile, useDeleteAccount, useConstants } from '@/lib/hooks';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';

export default function SettingsPage() {
  const { user, membership } = useAuthStore();
  const { data: constants } = useConstants();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      job_title: user?.job_title || '',
      seniority_level: user?.seniority_level || undefined,
      primary_function: user?.primary_function || undefined,
      location: user?.location || '',
    },
  });

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync();
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-surface"
                />
                <p className="text-xs text-muted">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  aria-invalid={!!errors.full_name}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job title</Label>
                <Input
                  id="job_title"
                  {...register('job_title')}
                  placeholder="e.g. Product Manager"
                  aria-invalid={!!errors.job_title}
                />
                {errors.job_title && (
                  <p className="text-sm text-red-600">{errors.job_title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g. San Francisco, CA"
                  aria-invalid={!!errors.location}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seniority_level">Seniority level</Label>
                  <Select
                    value={watch('seniority_level') || ''}
                    onValueChange={(value) =>
                      setValue('seniority_level', value as UpdateUserInput['seniority_level'], {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {constants?.seniority_levels?.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_function">Primary function</Label>
                  <Select
                    value={watch('primary_function') || ''}
                    onValueChange={(value) =>
                      setValue('primary_function', value as UpdateUserInput['primary_function'], {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select function" />
                    </SelectTrigger>
                    <SelectContent>
                      {constants?.primary_functions?.map((func) => (
                        <SelectItem key={func.value} value={func.value}>
                          {func.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || updateProfile.isPending}
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Organization Info */}
        {membership && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
              <CardDescription>
                Your organization membership details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {membership.org_name || 'Organization'}
                  </p>
                  <p className="text-xs text-muted">
                    {membership.org_slug}
                  </p>
                </div>
                <Badge>{membership.role}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Account status</p>
                <p className="text-xs text-muted">
                  {user?.is_verified ? 'Verified' : 'Unverified'} account created on{' '}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <Badge variant={user?.is_active ? 'default' : 'secondary'}>
                {user?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Delete account</p>
                <p className="text-xs text-muted">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteAccount.isPending ? 'Deleting...' : 'Delete account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
