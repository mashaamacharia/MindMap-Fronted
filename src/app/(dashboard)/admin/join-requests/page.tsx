'use client';

import { JoinRequestList } from '@/components/admin/JoinRequestList';

export default function AdminJoinRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-ink">Join Requests</h2>
        <p className="text-sm text-muted">Review and manage requests to join your organization</p>
      </div>

      <JoinRequestList />
    </div>
  );
}
