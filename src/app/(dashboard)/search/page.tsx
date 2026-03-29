'use client';

/**
 * Search Page
 * Global search across Artifacts, Projects, and Knowledge
 * Reads ?q= URL param on load. Min 2 chars enforced.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search as SearchIcon,
  FileText,
  FolderKanban,
  BookOpen,
  Clock,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSmartDate } from '@/lib/utils/formatDate';
import { useSearch } from '@/lib/hooks';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import type { SearchResultItem } from '@/lib/types';

const typeConfig: Record<
  string,
  { label: string; icon: typeof FileText; href: (item: SearchResultItem) => string }
> = {
  artifact: {
    label: 'Artifacts',
    icon: FileText,
    href: (item) => `/artifacts/${item.id}`,
  },
  project: {
    label: 'Projects',
    icon: FolderKanban,
    href: (item) => `/projects/${item.id}`,
  },
  knowledge: {
    label: 'Knowledge',
    icon: BookOpen,
    href: (item) => `/knowledge/${item.id}`,
  },
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Sync URL with query
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`, {
        scroll: false,
      });
    } else if (debouncedQuery.length === 0) {
      router.replace('/search', { scroll: false });
    }
  }, [debouncedQuery, router]);

  const { data, isLoading, error } = useSearch(
    { q: debouncedQuery },
    debouncedQuery.length >= 2
  );

  const hasResults =
    data && data.total > 0;

  const resultSections = data?.results
    ? Object.entries(data.results).filter(([, items]) => items.length > 0)
    : [];

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    router.replace('/search', { scroll: false });
  }, [router]);

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <PageHeader
          title="Search"
          description="Find artifacts, projects, and knowledge across your workspace."
        />

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across your workspace..."
            className="pl-10 pr-10 h-12 text-body-md"
            autoFocus
          />
          {query.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Validation message */}
        {query.length > 0 && query.length < 2 && (
          <p className="text-caption text-muted">
            Enter at least 2 characters to search.
          </p>
        )}

        {/* Loading state */}
        {isLoading && debouncedQuery.length >= 2 && (
          <div className="space-y-6">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {[1, 2].map((item) => (
                    <Skeleton key={item} className="h-20" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-md border border-border bg-surface p-4">
            <p className="text-body-md text-ink">
              Something went wrong while searching. Please try again.
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && debouncedQuery.length >= 2 && (
          <>
            {/* Result count */}
            {data && (
              <p className="text-caption text-muted">
                {data.total} result{data.total !== 1 ? 's' : ''} for &ldquo;{data.query}&rdquo;
              </p>
            )}

            {/* Result sections */}
            {hasResults && resultSections.length > 0 && (
              <div className="space-y-8">
                {resultSections.map(([type, items]) => {
                  const config = typeConfig[type];
                  if (!config) return null;
                  const Icon = config.icon;

                  return (
                    <section key={type}>
                      <div className="mb-3 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
                        <h3 className="text-body-md font-medium text-ink">
                          {config.label}
                        </h3>
                        <Badge variant="outline" className="text-caption">
                          {items.length}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {items.map((item) => (
                          <SearchResultCard
                            key={item.id}
                            item={item}
                            href={config.href(item)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {data && data.total === 0 && (
              <EmptyState
                icon={SearchIcon}
                title="No results found"
                description={`Nothing matched "${debouncedQuery}". Try different words or check your spelling.`}
              />
            )}
          </>
        )}

        {/* Initial state */}
        {!isLoading && debouncedQuery.length < 2 && query.length === 0 && (
          <EmptyState
            icon={SearchIcon}
            title="Search your workspace"
            description="Find decision artifacts, projects, and knowledge items. Start typing to search."
          />
        )}
      </div>
    </div>
  );
}

/**
 * Individual search result card
 */
function SearchResultCard({
  item,
  href,
}: {
  item: SearchResultItem;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1.5 rounded-md border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <h4 className="text-body-md font-medium text-ink line-clamp-1">
          {item.title}
        </h4>
        {item.domain_code && (
          <Badge variant="outline" className="text-caption shrink-0">
            {item.domain_code}
          </Badge>
        )}
        {item.status && (
          <Badge variant="secondary" className="text-caption shrink-0">
            {item.status}
          </Badge>
        )}
      </div>
      <p className="text-caption text-muted line-clamp-2">{item.excerpt}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="flex items-center gap-1 text-caption text-muted">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {formatSmartDate(item.created_at)}
        </span>
        {item.project_title && (
          <span className="text-caption text-muted">
            in {item.project_title}
          </span>
        )}
      </div>
    </Link>
  );
}
