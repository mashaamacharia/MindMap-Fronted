/**
 * TopNav
 * Surface background, border-bottom
 * Search input, user avatar dropdown (Profile, Org settings for OWNER, Sign out)
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, LogOut, User, Settings, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores';
import { useLogout } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Input } from '@/components/ui/Input';

interface TopNavProps {
  className?: string;
}

/**
 * Top navigation bar with search and user menu
 */
export function TopNav({ className }: TopNavProps) {
  const router = useRouter();
  const { user, role } = useAuthStore();
  const logout = useLogout();
  const [searchQuery, setSearchQuery] = useState('');

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isOwner = role === 'owner';

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-6',
        className
      )}
    >
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <Input
            type="search"
            placeholder="Search projects, artifacts, knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-canvas"
          />
        </div>
      </form>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar_url || undefined}
                alt={user?.full_name || 'User'}
              />
              <AvatarFallback className="bg-charcoal text-ecru text-xs">
                {getInitials(user?.full_name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-body-md font-medium lg:inline-block">
              {user?.full_name || 'User'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-body-md font-medium">{user?.full_name}</p>
            <p className="text-caption text-muted">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" strokeWidth={1.5} />
              Profile
            </Link>
          </DropdownMenuItem>
          {isOwner && (
            <DropdownMenuItem asChild>
              <Link
                href="/settings/organisation"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" strokeWidth={1.5} />
                Organisation settings
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            {logout.isPending ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default TopNav;
