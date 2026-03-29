'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';
import type { AuditLogRead } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

export function AuditTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs({ page, limit: 50 });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Logs</CardTitle>
        <CardDescription>
          Tracking all administrative and security actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items?.length ? (
                data.items.map((log: AuditLogRead) => (
                  <tr key={log.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{log.user_name || 'System'}</p>
                      <p className="text-[10px] text-muted">{log.user_id}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {log.resource_type}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No audit logs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
