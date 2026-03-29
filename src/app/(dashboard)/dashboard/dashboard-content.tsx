'use client';

import Link from 'next/link';
import {
  FolderKanban,
  Lightbulb,
  FileText,
  ArrowRight,
  Plus,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores';
import { useProjects, useChallenges, useArtifacts } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeDate } from '@/lib/utils';
import { ProfileCompletionBanner } from './profile-completion-banner';

export function DashboardContent() {
  const { user } = useAuthStore();
  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    page: 1,
    page_size: 5,
  });
  const { data: challengesData, isLoading: challengesLoading } = useChallenges({
    page: 1,
    page_size: 5,
  });
  const { data: artifactsData, isLoading: artifactsLoading } = useArtifacts({
    page: 1,
    page_size: 5,
  });

  const stats = [
    {
      label: 'Active Projects',
      value: projectsData?.count ?? 0,
      icon: FolderKanban,
      href: '/projects',
    },
    {
      label: 'Open Challenges',
      value: challengesData?.count ?? 0,
      icon: Lightbulb,
      href: '/challenges',
    },
    {
      label: 'Decision Artifacts',
      value: artifactsData?.count ?? 0,
      icon: FileText,
      href: '/artifacts',
    },
  ];

  return (
    <div className="space-y-8">
      <ProfileCompletionBanner />
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-ink">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Executive'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Here&apos;s an overview of your decision workspace
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
            New Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-charcoal">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface">
                  <stat.icon className="h-5 w-5 text-charcoal" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-light text-ink">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Recent Projects
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">
                View all
                <ArrowRight className="ml-1 h-3 w-3" strokeWidth={1.5} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : projectsData?.results?.length ? (
              <div className="space-y-3">
                {projectsData.results.slice(0, 3).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-surface"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {project.name}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {formatRelativeDate(project.updated_at)}
                      </p>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Create your first project to get started"
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/projects/new">
                      <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
                      Create project
                    </Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Challenges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Recent Challenges
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/challenges">
                View all
                <ArrowRight className="ml-1 h-3 w-3" strokeWidth={1.5} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {challengesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : challengesData?.results?.length ? (
              <div className="space-y-3">
                {challengesData.results.slice(0, 3).map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/challenges/${challenge.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-surface"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {challenge.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="h-3 w-3" strokeWidth={1.5} />
                        {formatRelativeDate(challenge.updated_at)}
                      </p>
                    </div>
                    <Badge variant="secondary">{challenge.status}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Lightbulb}
                title="No challenges yet"
                description="Define a challenge to begin analysis"
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/challenges/new">
                      <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
                      Create challenge
                    </Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Artifacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            Recent Decision Artifacts
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/artifacts">
              View all
              <ArrowRight className="ml-1 h-3 w-3" strokeWidth={1.5} />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {artifactsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : artifactsData?.results?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artifactsData.results.slice(0, 3).map((artifact) => (
                <Link
                  key={artifact.id}
                  href={`/artifacts/${artifact.id}`}
                  className="flex flex-col gap-2 rounded-md border border-border p-4 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted" strokeWidth={1.5} />
                    <Badge variant="outline" className="text-xs">
                      v{artifact.version}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm font-medium text-ink">
                    {artifact.title}
                  </p>
                  <p className="text-xs text-muted">
                    {formatRelativeDate(artifact.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No artifacts yet"
              description="Analyze a challenge to generate decision artifacts"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
