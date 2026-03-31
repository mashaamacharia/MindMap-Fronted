'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

import Image from 'next/image';

export function Shell({ children, className }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-canvas relative">
      {/* Universal Hero Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-bg.PNG"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Layered overlay: canvas wash + subtle dark veil */}
        <div className="absolute inset-0 bg-canvas/80" />
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      <div className="relative z-10">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton
        />
      </div>

      <div className="flex flex-1 relative z-10">
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
