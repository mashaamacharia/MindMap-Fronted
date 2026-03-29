/**
 * PageHeader Component
 * Page title with optional description and actions
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Page title (h2) */
  title: string;
  /** Optional description (body-md, muted) */
  description?: string;
  /** Optional action buttons */
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader component
 * Renders a consistent page header with title, description, and actions
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="space-y-1">
        <h2 className="text-h2 text-ink">{title}</h2>
        {description && (
          <p className="text-body-md text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export default PageHeader;
