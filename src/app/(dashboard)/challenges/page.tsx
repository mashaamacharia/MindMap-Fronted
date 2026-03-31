'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Lightbulb, Clock } from 'lucide-react';
import { useChallenges } from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ChallengesPage() {
  const [search, setSearch] = useState('');

  // Hook expects (page, limit)
  const { data, isLoading } = useChallenges(1, 20);

  // Apply client-side search against the returned items
  const filtered = data?.items?.filter((c) =>
    !search || c.raw_text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-ink">
              Challenges
            </h1>
            <p className="mt-1 text-sm text-muted">
              Define and analyze your decision challenges
            </p>
          </div>
          <Button asChild variant="primary">
            <Link href="/challenges/new">
              <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
              New Challenge
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <Input
            type="search"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Challenges list */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : filtered?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((challenge) => (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                <Card className="h-full transition-colors hover:border-charcoal">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-ink line-clamp-2">
                        {challenge.raw_text}
                      </h3>
                    </div>
                    {challenge.raw_text && (
                      <p className="mt-2 text-sm text-muted line-clamp-2">
                        {challenge.raw_text}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" strokeWidth={1.5} />
                      {formatRelativeDate(challenge.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Lightbulb}
            title="No challenges yet"
            description="Create your first challenge to start analyzing decisions"
            action={
              <Button asChild variant="primary">
                <Link href="/challenges/new">
                  <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Create challenge
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
