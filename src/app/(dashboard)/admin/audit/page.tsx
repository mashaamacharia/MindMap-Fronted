'use client';

import { AuditTable } from '@/components/admin/AuditTable';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-ink">Audit Logs</h2>
        <p className="text-sm text-muted">A timeline of all security and administrative events</p>
      </div>
      <AuditTable />
    </div>
  );
}
