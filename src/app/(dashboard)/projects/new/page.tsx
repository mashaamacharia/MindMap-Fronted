'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCreateProject } from '@/lib/hooks';
import type { ProjectCreateInput } from '@/lib/schemas';
import { ProjectForm } from '@/components/projects';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const handleSubmit = async (data: ProjectCreateInput) => {
    const project = await createProject.mutateAsync(data);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              <span className="sr-only">Back to projects</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Create New Project
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm
              onSubmit={handleSubmit}
              onCancel={() => router.push('/projects')}
              isLoading={createProject.isPending}
              error={createProject.error}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
