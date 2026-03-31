/**
 * Projects Page
 * Lists all projects with grid view, search, and filtering
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { useProjects } from '@/lib/hooks';
import type { ProjectRead, ProjectSummary } from '@/lib/types';
import { ProjectList, NewProjectModal } from '@/components/projects';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';

type StatusFilter = 'all' | 'active' | 'archived' | 'completed';

export default function ProjectsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProjects(page, 20);

  // Client-side filtering (API would handle this in production)
  const filteredData = data ? {
    ...data,
    items: data.items.filter((project) => {
      const matchesSearch = !search || 
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        (project.description?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
  } : undefined;

  const handleEdit = (project: ProjectRead | ProjectSummary) => {
    router.push(`/projects/${project.id}/edit`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Projects"
        description="Organize your decision challenges into projects"
        actions={
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
            New Project
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <Input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Projects list */}
      <ProjectList
        data={filteredData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onCreateNew={() => setShowCreateDialog(true)}
      />

      {/* Pagination info and controls */}
      {data && data.total > 0 && (
        <div className="flex flex-col items-center gap-4 py-4">
          <Pagination
            page={page}
            totalPages={Math.ceil(data.total / 20)}
            onPageChange={setPage}
          />
          <div className="text-caption text-muted">
            Showing {data.items.length} of {data.total} projects
          </div>
        </div>
      )}

      {/* Create dialog */}
      <NewProjectModal
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
