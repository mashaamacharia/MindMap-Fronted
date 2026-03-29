'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, Clock, Check, X } from 'lucide-react';
import { useJoinRequests, useApproveJoinRequest, useDeclineJoinRequest } from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import type { OrgRole, JoinRequestRead } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
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
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

const roleOptions: { value: OrgRole; label: string }[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
];

export function JoinRequestList() {
  const [page, setPage] = useState(1);
  const [requestToApprove, setRequestToApprove] = useState<JoinRequestRead | null>(null);
  const [requestToDecline, setRequestToDecline] = useState<JoinRequestRead | null>(null);
  const [approveRole, setApproveRole] = useState<OrgRole>('member');
  const [declineReason, setDeclineReason] = useState('');

  const { data, isLoading } = useJoinRequests(page, 20, 'pending');
  const approveRequest = useApproveJoinRequest();
  const declineRequest = useDeclineJoinRequest();

  const handleApprove = async () => {
    if (!requestToApprove) return;
    try {
      await approveRequest.mutateAsync({
        requestId: requestToApprove.id,
        data: { role: approveRole },
      });
      toast.success('Request approved');
      setRequestToApprove(null);
      setApproveRole('member');
    } catch {
      toast.error('Failed to approve request');
    }
  };

  const handleDecline = async () => {
    if (!requestToDecline) return;
    try {
      await declineRequest.mutateAsync({
        requestId: requestToDecline.id,
        data: { reason: declineReason || undefined },
      });
      toast.success('Request declined');
      setRequestToDecline(null);
      setDeclineReason('');
    } catch {
      toast.error('Failed to decline request');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.items?.length) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Join Requests</CardTitle>
          <CardDescription>
            Review and manage requests to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.items.map((request: JoinRequestRead) => (
              <div
                key={request.id}
                className="rounded-md border border-border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                      <UserPlus className="h-5 w-5 text-muted" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {request.requester_name || request.requester_email}
                      </p>
                      <p className="text-xs text-muted">{request.requester_email}</p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        Requested {formatRelativeDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{request.status}</Badge>
                </div>
                
                {request.status === 'pending' && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setRequestToApprove(request)}
                    >
                      <Check className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRequestToDecline(request)}
                    >
                      <X className="mr-2 h-4 w-4" strokeWidth={1.5} />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!requestToApprove}
        onOpenChange={(open: boolean) => !open && setRequestToApprove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve join request</AlertDialogTitle>
            <AlertDialogDescription>
              Approve {requestToApprove?.requester_name || requestToApprove?.requester_email} to join your organization
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Assign role</Label>
            <Select
              value={approveRole}
              onValueChange={(v) => setApproveRole(v as OrgRole)}
            >
              <SelectTrigger className="mt-2">
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
              onClick={handleApprove}
              disabled={approveRequest.isPending}
            >
              {approveRequest.isPending ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!requestToDecline}
        onOpenChange={(open: boolean) => !open && setRequestToDecline(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline join request</AlertDialogTitle>
            <AlertDialogDescription>
              Decline the request from {requestToDecline?.requester_name || requestToDecline?.requester_email}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Provide a reason for declining..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDecline}
              className="bg-red-600 hover:bg-red-700"
              disabled={declineRequest.isPending}
            >
              {declineRequest.isPending ? 'Declining...' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
