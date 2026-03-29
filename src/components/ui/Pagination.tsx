/**
 * Pagination Component
 * Previous/Next buttons, current page / total pages, disabled states
 */

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Optional className */
  className?: string;
}

/**
 * Pagination component
 * Renders Previous/Next navigation with page indicator
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        aria-label="Previous page"
      >
        <ChevronLeft className="mr-1 h-4 w-4" strokeWidth={1.5} />
        Previous
      </Button>

      <span className="text-caption text-muted">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        aria-label="Next page"
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  );
}

export default Pagination;
