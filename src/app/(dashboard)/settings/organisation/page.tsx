'use client';

/**
 * Organisation Settings Page
 * OWNER-only: org update, member management, transfer ownership
 * All dropdowns from useConstants()
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Users,
  Shield,
  ArrowRightLeft,
  Trash2,
  UserMinus,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  updateOrgSchema,
  inviteSchema,
  transferOwnerSchema,
  type UpdateOrgInput,
  type InviteInput,
  type TransferOwnerInput,
} from '@/lib/schemas';
import { useAuthStore } from '@/lib/stores';
import {
  useOrg,
  useOrgMembers,
  useUpdateOrg,
  useChangeMemberRole,
  useRemoveMember,
  useTransferOwnership,
  useConstants,
  useCreateInvitation,
  useInvitations,
  useRevokeInvitation,
} from '@/lib/hooks';
import { RoleGate, hasMinimumRole } from '@/components/ui/RoleGate';
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
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import type { OrgRole, OrgMemberRead } from '@/lib/types';
import { formatDate } from '@/lib/utils/formatDate';

export default function OrganisationSettingsPage() {
  const router = useRouter();
  const { org, role, user } = useAuthStore();

  // If not owner, show access denied
  if (role !== 'owner' && role !== 'admin') {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState
          icon={Shield}
          title="Access restricted"
          description="Only organisation owners can manage organisation settings."
        />
      </div>
    );
  }

  return (
    <RoleGate minimum="admin" fallback={
      <div className="p-4 lg:p-6">
        <EmptyState
          icon={Shield}
          title="Access restricted"
          description="Only organisation admins and owners can access this page."
        />
      </div>
    }>
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <PageHeader
            title="Organisation settings"
            description="Manage your organisation details, members, and ownership."
          />

          {org?.id && (
            <>
              <OrgDetailsSection orgId={org.id} />
              <Separator />
              <MembersSection orgId={org.id} currentUserId={user?.id} />
              <Separator />
              <InvitationsSection />
              {role === 'owner' && (
                <>
                  <Separator />
                  <TransferOwnershipSection orgId={org.id} currentUserId={user?.id} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </RoleGate>
  );
}

/**
 * Organisation Details Form
 */
function OrgDetailsSection({ orgId }: { orgId: string }) {
  const { data: orgData, isLoading } = useOrg(orgId);
  const { data: constants } = useConstants();
  const updateOrg = useUpdateOrg();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateOrgInput>({
    resolver: zodResolver(updateOrgSchema),
    values: orgData
      ? {
          name: orgData.name,
          industry: orgData.industry,
          size_category: orgData.size_category,
          hq_location: orgData.hq_location,
          primary_market: orgData.primary_market,
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateOrgInput) => {
    try {
      await updateOrg.mutateAsync({ orgId, data });
      toast.success('Organisation updated successfully');
    } catch {
      toast.error('Failed to update organisation');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" strokeWidth={1.5} />
          Organisation details
        </CardTitle>
        <CardDescription>
          Update your organisation information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org_name">Organisation name</Label>
              <Input
                id="org_name"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-caption text-muted">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                {...register('industry')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hq_location">HQ location</Label>
              <Input
                id="hq_location"
                {...register('hq_location')}
              />
            </div>

            <div className="space-y-2">
              <Label>Organisation size</Label>
              <Select
                value={watch('size_category') || ''}
                onValueChange={(value) =>
                  setValue('size_category', value as UpdateOrgInput['size_category'], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {constants?.org_size_categories?.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary market</Label>
            <Select
              value={watch('primary_market') || ''}
              onValueChange={(value) =>
                setValue('primary_market', value as UpdateOrgInput['primary_market'], {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {constants?.primary_markets?.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isDirty || updateOrg.isPending}
            >
              {updateOrg.isPending ? <><Spinner className="mr-2 h-4 w-4" /> Saving...</> : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Members Management Section
 */
function MembersSection({ orgId, currentUserId }: { orgId: string; currentUserId?: string }) {
  const { data: members, isLoading } = useOrgMembers(orgId);
  const changeMemberRole = useChangeMemberRole();
  const removeMember = useRemoveMember();
  const [confirmRemove, setConfirmRemove] = useState<OrgMemberRead | null>(null);

  const handleChangeRole = async (userId: string, newRole: OrgRole) => {
    try {
      await changeMemberRole.mutateAsync({ orgId, userId, data: { role: newRole } });
      toast.success('Member role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleRemove = async () => {
    if (!confirmRemove) return;
    try {
      await removeMember.mutateAsync({ orgId, userId: confirmRemove.user_id });
      toast.success('Member removed');
      setConfirmRemove(null);
    } catch {
      toast.error('Failed to remove member');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" strokeWidth={1.5} />
            Members
          </CardTitle>
          <CardDescription>
            Manage organisation members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-body-md font-medium text-ink truncate">
                      {member.full_name || member.email || 'Unknown'}
                    </p>
                    <p className="text-caption text-muted">
                      {member.email} · Joined {formatDate(member.joined_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {member.user_id === currentUserId ? (
                      <Badge variant="outline">You</Badge>
                    ) : (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleChangeRole(member.user_id, value as OrgRole)
                          }
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setConfirmRemove(member)}
                          className="text-muted hover:text-ink"
                        >
                          <UserMinus className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Invite members to your organisation to collaborate."
            />
          )}
        </CardContent>
      </Card>

      {/* Remove member confirm dialog */}
      <Dialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {confirmRemove?.full_name || confirmRemove?.email} from the organisation? They will lose access immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeMember.isPending}
            >
              {removeMember.isPending ? 'Removing...' : 'Remove member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Invitations Section
 */
function InvitationsSection() {
  const { data: invitations, isLoading } = useInvitations();
  const createInvitation = useCreateInvitation();
  const revokeInvitation = useRevokeInvitation();
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'member' },
  });

  const onInvite = async (data: InviteInput) => {
    try {
      await createInvitation.mutateAsync(data);
      toast.success('Invitation sent');
      reset();
      setShowInviteDialog(false);
    } catch {
      toast.error('Failed to send invitation');
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitation.mutateAsync(id);
      toast.success('Invitation revoked');
    } catch {
      toast.error('Failed to revoke invitation');
    }
  };

  const pendingInvitations = invitations?.items?.filter(
    (inv) => inv.status === 'pending'
  ) || [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Pending invitations</CardTitle>
            <CardDescription>
              Manage outstanding invitations.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowInviteDialog(true)}>
            Invite member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : pendingInvitations.length > 0 ? (
            <div className="space-y-2">
              {pendingInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-body-md text-ink">{inv.email}</p>
                    <p className="text-caption text-muted">
                      Role: {inv.role} · Expires {formatDate(inv.expires_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(inv.id)}
                    className="text-muted hover:text-ink"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-muted py-4 text-center">
              No pending invitations.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Invite dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organisation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite_email">Email address</Label>
              <Input
                id="invite_email"
                type="email"
                {...register('email')}
                placeholder="colleague@company.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-caption text-muted">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={watch('role')}
                onValueChange={(value) =>
                  setValue('role', value as InviteInput['role'], { shouldDirty: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-caption text-muted">{errors.role.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createInvitation.isPending}>
                {createInvitation.isPending ? 'Sending...' : 'Send invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Transfer Ownership Section (OWNER only)
 */
function TransferOwnershipSection({ orgId, currentUserId }: { orgId: string; currentUserId?: string }) {
  const router = useRouter();
  const { data: members } = useOrgMembers(orgId);
  const transferOwnership = useTransferOwnership();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const eligibleMembers = members?.filter(
    (m) => m.user_id !== currentUserId && (m.role === 'admin' || m.role === 'member')
  ) || [];

  const selectedMember = eligibleMembers.find((m) => m.user_id === selectedUserId);

  const handleTransfer = async () => {
    if (!selectedUserId) return;
    try {
      await transferOwnership.mutateAsync({
        orgId,
        data: { target_user_id: selectedUserId },
      });
      toast.success('Ownership transferred. You will be signed out.');
      router.push('/auth/login?message=ownership_transferred');
    } catch {
      toast.error('Failed to transfer ownership');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRightLeft className="h-4 w-4" strokeWidth={1.5} />
            Transfer ownership
          </CardTitle>
          <CardDescription>
            Transfer organisation ownership to another member. You will be signed out and your role will change.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {eligibleMembers.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Transfer to</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleMembers.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.full_name || member.email} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="destructive"
                disabled={!selectedUserId}
                onClick={() => setShowConfirm(true)}
              >
                Transfer ownership
              </Button>
            </>
          ) : (
            <p className="text-caption text-muted">
              No eligible members to transfer ownership to. Invite or promote a member first.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirm transfer dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm ownership transfer</DialogTitle>
            <DialogDescription>
              You are about to transfer ownership to{' '}
              <span className="font-medium text-ink">
                {selectedMember?.full_name || selectedMember?.email}
              </span>
              . This action cannot be undone. You will be signed out immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleTransfer}
              disabled={transferOwnership.isPending}
            >
              {transferOwnership.isPending ? 'Transferring...' : 'Confirm transfer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
