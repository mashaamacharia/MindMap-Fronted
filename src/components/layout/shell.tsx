'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        showMenuButton
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content with left padding for sidebar on lg screens */}
        <main className={cn('flex-1 overflow-auto lg:ml-64', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
