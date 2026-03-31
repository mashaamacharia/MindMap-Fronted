'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useArtifacts } from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import type { ArtifactRead, ArtifactStatus } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';

function getStatusBadge(status: ArtifactStatus) {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'processing':
      return (
        <Badge variant="secondary">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Generating
        </Badge>
      );
    case 'draft':
    default:
      return <Badge variant="outline">Draft</Badge>;
  }
}

function ArtifactCard({ artifact }: { artifact: ArtifactRead }) {
  const content = artifact.content;

  return (
    <Link href={`/artifacts/${artifact.id}`}>
      <Card className="h-full transition-colors hover:border-charcoal">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted" strokeWidth={1.5} />
              <Badge variant="outline" className="text-xs">
                v{artifact.version}
              </Badge>
            </div>
            {getStatusBadge(artifact.status)}
          </div>
          <h3 className="mt-2 font-medium text-ink line-clamp-2">
            {content?.title || 'Untitled Artifact'}
          </h3>
          {content?.executive_summary && (
            <p className="mt-2 text-sm text-muted line-clamp-2">
              {content.executive_summary}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {formatRelativeDate(artifact.created_at)}
            </p>
            {content?.confidence_score && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(content.confidence_score * 100)}% confidence
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ArtifactsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useArtifacts(page, 20);

  // Filter artifacts by status and search
  const filteredArtifacts = data?.items?.filter((artifact) => {
    const matchesStatus = statusFilter === 'all' || artifact.status === statusFilter;
    const matchesSearch =
      !search ||
      artifact.content?.title?.toLowerCase().includes(search.toLowerCase()) ||
      artifact.content?.executive_summary?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Decision Artifacts
          </h1>
          <p className="mt-1 text-sm text-muted">
            AI-generated decision documents from your challenges
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.5}
            />
            <Input
              type="search"
              placeholder="Search artifacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Artifacts list */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredArtifacts?.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArtifacts.map((artifact) => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.total > 20 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page} of {Math.ceil(data.total / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / 20)}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="No artifacts yet"
            description={
              search || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Analyze a challenge to generate your first decision artifact'
            }
          />
        )}
      </div>
    </div>
  );
}
