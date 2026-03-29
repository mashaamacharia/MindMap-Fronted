'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Shield, Mail, Activity, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { membership } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Role guard - redirect if not admin or owner
  useEffect(() => {
    if (membership && membership.role !== 'admin' && membership.role !== 'owner') {
      router.replace('/projects');
    }
  }, [membership, router]);

  if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted" strokeWidth={1.5} />
          <h2 className="mt-4 text-lg font-medium text-ink">Access denied</h2>
          <p className="mt-1 text-sm text-muted">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'members', label: 'Members', icon: Users, href: '/admin/members' },
    { id: 'audit', label: 'Audit Logs', icon: Activity, href: '/admin/audit' },
    { id: 'knowledge', label: 'Knowledge Admin', icon: Shield, href: '/admin/knowledge' },
    { id: 'settings', label: 'Organization', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Administration
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage organization members, security logs, and settings
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start h-[calc(100vh-14rem)]">
          {/* Admin Sidebar */}
          <aside 
            className={cn(
              "relative hidden md:flex flex-col bg-surface border border-border rounded-lg transition-all duration-300 ease-in-out h-full overflow-y-auto",
              isCollapsed ? "w-16 items-center" : "w-64"
            )}
          >
            <div className={cn("p-4 flex items-center border-b border-border/50", isCollapsed ? "justify-center" : "justify-end")}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted hover:text-ink"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            
            <nav className="flex-1 p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                      isActive 
                        ? "bg-charcoal text-ecru font-medium" 
                        : "text-muted hover:bg-surface-hover hover:text-ink",
                      isCollapsed && "justify-center px-0 py-3"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Tab Content Area */}
          <main className="flex-1 min-w-0 bg-surface border border-border rounded-lg p-6 h-full overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
