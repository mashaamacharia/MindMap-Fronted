'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { useKnowledgeItem } from '@/lib/hooks';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Separator } from '@/components/ui/Separator';

export default function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ knowledgeId: string }>;
}) {
  const { knowledgeId } = use(params);

  const { data: item, isLoading } = useKnowledgeItem(knowledgeId);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState
          title="Knowledge item not found"
          description="The knowledge item you're looking for doesn't exist or has been removed."
          action={
            <Button asChild variant="outline">
              <Link href="/knowledge">
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Back to Knowledge Base
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Back button */}
        <Button asChild variant="ghost" size="sm">
          <Link href="/knowledge">
            <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Back to Knowledge Base
          </Link>
        </Button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {item.domain_code && (
              <Badge variant="outline">
                <Tag className="h-3 w-3 mr-1" strokeWidth={1.5} />
                {item.domain_code}
              </Badge>
            )}
            <Badge 
              variant={item.status === 'published' ? 'default' : 'secondary'}
            >
              {item.status}
            </Badge>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            {item.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted">
            {item.creator_name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" strokeWidth={1.5} />
                {item.creator_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {formatDate(item.created_at)}
            </span>
            {item.published_at && (
              <span className="text-green-600">
                Published {formatDate(item.published_at)}
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* Summary */}
        {item.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted leading-relaxed">
                {item.summary}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Body content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-ink">
              <div className="whitespace-pre-wrap leading-relaxed">
                {item.body}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
