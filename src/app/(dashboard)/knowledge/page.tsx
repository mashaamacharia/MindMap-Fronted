'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, FileText, Filter } from 'lucide-react';
import { useKnowledge, useDomains } from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import type { KnowledgeItemRead } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

function KnowledgeCard({ item }: { item: KnowledgeItemRead }) {
  return (
    <Link href={`/knowledge/${item.id}`}>
      <Card className="h-full transition-colors hover:border-charcoal">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface flex-shrink-0">
              <FileText className="h-5 w-5 text-charcoal" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-ink line-clamp-2">
                {item.title}
              </h3>
              {item.domain_code && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {item.domain_code}
                </Badge>
              )}
            </div>
          </div>
          {item.summary && (
            <p className="mt-3 text-sm text-muted line-clamp-3">
              {item.summary}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {formatRelativeDate(item.created_at)}
            </p>
            <Badge 
              variant={item.status === 'published' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {item.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data: domains, isLoading: domainsLoading } = useDomains();
  const { data, isLoading } = useKnowledge({
    domain_code: domainFilter !== 'all' ? domainFilter : undefined,
    page,
    limit: 8,
  });

  // Filter by search locally (API might not support search)
  const filteredItems = data?.items?.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.summary?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-muted">
            Browse organizational knowledge used for AI-powered decision analysis
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              strokeWidth={1.5}
            />
            <Input
              type="search"
              placeholder="Search knowledge base..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {!domainsLoading &&
                  domains?.map((domain) => (
                    <SelectItem key={domain.id} value={domain.code}>
                      {domain.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Knowledge list */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredItems?.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <KnowledgeCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.total > 8 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page} of {Math.ceil(data.total / 8)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / 8)}
                  className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No knowledge items found"
            description={
              search || domainFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Knowledge items will appear here once published by administrators'
            }
          />
        )}
      </div>
    </div>
  );
}
