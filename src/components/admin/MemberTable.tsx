'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Shield, UserMinus } from 'lucide-react';
import { useOrgMembers, useChangeMemberRole, useRemoveMember } from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores';
import { formatDate } from '@/lib/utils';
import type { OrgMemberRead, OrgRole } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

const roleOptions: { value: OrgRole; label: string }[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

function getRoleBadgeVariant(role: OrgRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'owner':
      return 'default';
    case 'admin':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function MemberTable() {
  const { membership } = useAuthStore();
  const [selectedMember, setSelectedMember] = useState<OrgMemberRead | null>(null);
  const [newRole, setNewRole] = useState<OrgRole | ''>('');
  const [memberToRemove, setMemberToRemove] = useState<OrgMemberRead | null>(null);

  const { data: members, isLoading } = useOrgMembers(membership?.org_id);
  const changeMemberRole = useChangeMemberRole();
  const removeMember = useRemoveMember();

  const handleRoleChange = async () => {
    if (!selectedMember || !newRole || !membership?.org_id) return;
    try {
      await changeMemberRole.mutateAsync({
        orgId: membership.org_id,
        userId: selectedMember.user_id,
        data: { role: newRole },
      });
      toast.success('Role updated successfully');
      setSelectedMember(null);
      setNewRole('');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !membership?.org_id) return;
    try {
      await removeMember.mutateAsync({
        orgId: membership.org_id,
        userId: memberToRemove.user_id,
      });
      toast.success('Member removed');
      setMemberToRemove(null);
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Members</CardTitle>
          <CardDescription>
            Manage members and their roles in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members?.length ? (
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-charcoal text-ecru text-xs">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {member.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                    <p className="text-xs text-muted hidden sm:block">
                      Joined {member.joined_at ? formatDate(member.joined_at) : 'N/A'}
                    </p>
                    {member.role !== 'owner' && membership?.role === 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setNewRole(member.role);
                            }}
                          >
                            <Shield className="mr-2 h-4 w-4" strokeWidth={1.5} />
                            Change role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setMemberToRemove(member)}
                            className="text-destructive focus:text-destructive"
                          >
                            <UserMinus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                            Remove member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-8">No members found</p>
          )}
        </CardContent>
      </Card>

      {/* Change role dialog */}
      <AlertDialog
        open={!!selectedMember}
        onOpenChange={(open: boolean) => !open && setSelectedMember(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change member role</AlertDialogTitle>
            <AlertDialogDescription>
              Update the role for {selectedMember?.full_name || selectedMember?.email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(v) => setNewRole(v as OrgRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              disabled={changeMemberRole.isPending || newRole === selectedMember?.role}
            >
              {changeMemberRole.isPending ? 'Saving...' : 'Save'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove member dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open: boolean) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.full_name || memberToRemove?.email} from the organization?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMember.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
