'use client';

import { KnowledgeEditor } from '@/components/admin/KnowledgeEditor';

export default function KnowledgeAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-ink">Knowledge Base Administration</h2>
        <p className="text-sm text-muted">Manage the information used for strategic analysis</p>
      </div>
      <KnowledgeEditor />
    </div>
  );
}
