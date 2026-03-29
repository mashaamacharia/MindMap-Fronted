/**
 * Sidebar
 * Surface background, border-right
 * Role-aware nav items, Wordmark (sm) at top
 * 
 * Nav structure:
 * All roles (VIEWER+): Dashboard, Knowledge, Search
 * MEMBER+: Projects, Analyze, Artifacts
 * ADMIN+: Members (/settings/organisation), Audit Log (/admin/audit)
 * SUPERADMIN: Knowledge Mgmt (/admin/knowledge), All Users (/admin/members)
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  FileText,
  BookOpen,
  Search,
  Users,
  ScrollText,
  BookMarked,
  UsersRound,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import { Wordmark } from '@/components/ui/Wordmark';

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

// Role hierarchy: viewer=1, member=2, admin=3, owner=4
const roleHierarchy: Record<string, number> = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
};

function hasMinRole(userRole: string | null, minRole: string): boolean {
  if (!userRole) return false;
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[minRole] || 0);
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  minRole?: string; // Minimum role required
  superadminOnly?: boolean;
}

// All roles (VIEWER+)
const viewerNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Knowledge',
    href: '/knowledge',
    icon: BookOpen,
  },
  {
    label: 'Search',
    href: '/search',
    icon: Search,
  },
];

// MEMBER+
const memberNavItems: NavItem[] = [
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
    minRole: 'member',
  },
  {
    label: 'Analyze',
    href: '/analyze',
    icon: Sparkles,
    minRole: 'member',
  },
  {
    label: 'Artifacts',
    href: '/artifacts',
    icon: FileText,
    minRole: 'member',
  },
];

// ADMIN+
const adminNavItems: NavItem[] = [
  {
    label: 'Members',
    href: '/settings/organisation',
    icon: Users,
    minRole: 'admin',
  },
  {
    label: 'Audit Log',
    href: '/admin/audit',
    icon: ScrollText,
    minRole: 'admin',
  },
];

// SUPERADMIN only
const superadminNavItems: NavItem[] = [
  {
    label: 'Knowledge Mgmt',
    href: '/admin/knowledge',
    icon: BookMarked,
    superadminOnly: true,
  },
  {
    label: 'All Users',
    href: '/admin/members',
    icon: UsersRound,
    superadminOnly: true,
  },
];

/**
 * Sidebar navigation component with role-based menu items
 */
export function Sidebar({ isOpen = true, isCollapsed, onClose, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { role, isSuperadmin } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    // Check role permission
    if (item.superadminOnly && !isSuperadmin) return null;
    if (item.minRole && !hasMinRole(role, item.minRole)) return null;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-body-md font-medium transition-colors',
          isActive(item.href)
            ? 'bg-surface text-ink'
            : 'text-muted hover:bg-surface hover:text-ink'
        )}
      >
        <item.icon className="h-5 w-5" strokeWidth={1.5} />
        {item.label}
      </Link>
    );
  };

  // Filter nav items based on role
  const filteredMemberItems = memberNavItems.filter(
    (item) => !item.minRole || hasMinRole(role, item.minRole)
  );
  const filteredAdminItems = adminNavItems.filter(
    (item) => !item.minRole || hasMinRole(role, item.minRole)
  );
  const filteredSuperadminItems = superadminNavItems.filter(
    (item) => !item.superadminOnly || isSuperadmin
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header with Wordmark and mobile close */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Wordmark size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          {/* Viewer+ nav items */}
          <nav className="flex flex-col gap-1">
            {viewerNavItems.map(renderNavItem)}
          </nav>

          {/* Member+ nav items */}
          {filteredMemberItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <nav className="flex flex-col gap-1">
                {filteredMemberItems.map(renderNavItem)}
              </nav>
            </>
          )}

          {/* Admin+ nav items */}
          {filteredAdminItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="mb-2 px-3 text-caption font-medium text-muted">
                Administration
              </p>
              <nav className="flex flex-col gap-1">
                {filteredAdminItems.map(renderNavItem)}
              </nav>
            </>
          )}

          {/* Superadmin nav items */}
          {filteredSuperadminItems.length > 0 && (
            <>
              <Separator className="my-4" />
              <p className="mb-2 px-3 text-caption font-medium text-muted">
                Superadmin
              </p>
              <nav className="flex flex-col gap-1">
                {filteredSuperadminItems.map(renderNavItem)}
              </nav>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-caption text-muted">M1NDMAP11 v0.1.0</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
