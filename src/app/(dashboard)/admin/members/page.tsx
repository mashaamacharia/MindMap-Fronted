import { MemberTable } from '@/components/admin/MemberTable';
import { InviteForm } from '@/components/admin/InviteForm';
import { JoinRequestList } from '@/components/admin/JoinRequestList';

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-ink">Organization Members</h2>
          <p className="text-sm text-muted">Manage roles and permissions</p>
        </div>
        <InviteForm />
      </div>
      
      <JoinRequestList />
      <MemberTable />
    </div>
  );
}
