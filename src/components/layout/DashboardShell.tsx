/**
 * DashboardShell
 * Sidebar + main content area, reads uiStore, responsive
 * Main wrapper for all dashboard pages
 */

'use client';

import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Dashboard shell with sidebar and top navigation
 * Handles responsive sidebar state via uiStore
 */
export function DashboardShell({ children, className }: DashboardShellProps) {
  const { sidebar, toggleSidebar, setSidebarOpen } = useUIStore();

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebar.isOpen}
        isCollapsed={sidebar.isCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top navigation */}
        <TopNav />

        {/* Page content */}
        <main className={cn('flex-1 overflow-auto p-6', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
