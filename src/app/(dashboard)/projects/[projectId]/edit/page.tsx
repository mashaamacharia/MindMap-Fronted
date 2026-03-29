'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useProject, useUpdateProject } from '@/lib/hooks';
import type { UpdateProjectInput } from '@/lib/schemas';
import { ProjectForm } from '@/components/projects';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();

  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const handleSubmit = async (data: UpdateProjectInput) => {
    await updateProject.mutateAsync({ id: projectId, data });
    router.push(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 lg:p-6">
        <EmptyState
          title="Project not found"
          description="The project you're trying to edit doesn't exist."
          action={
            <Button asChild variant="outline">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Back to projects
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="sr-only">Back to project</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Edit Project
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              project={project}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/projects/${projectId}`)}
              isLoading={updateProject.isPending}
              error={updateProject.error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
