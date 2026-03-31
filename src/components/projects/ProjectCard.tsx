/**
 * ProjectCard
 * Card component for displaying a project in the grid
 */

'use client';

import Link from 'next/link';
import { MoreHorizontal, Pencil, Trash2, Archive, ArchiveRestore, Copy, Clock, FolderKanban } from 'lucide-react';
import type { ProjectRead, ProjectSummary } from '@/lib/types';
import { cn, formatRelativeDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface ProjectCardProps {
  project: ProjectRead | ProjectSummary;
  onEdit?: (project: ProjectRead | ProjectSummary) => void;
  onDelete?: (project: ProjectRead | ProjectSummary) => void;
  onArchive?: (project: ProjectRead | ProjectSummary) => void;
  onUnarchive?: (project: ProjectRead | ProjectSummary) => void;
  onDuplicate?: (project: ProjectRead | ProjectSummary) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-canvas text-muted border-border',
  completed: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function ProjectCard({ project, onEdit, onDelete, onArchive, onUnarchive, onDuplicate }: ProjectCardProps) {
  // Handle both ProjectRead and ProjectSummary types
  const challengeCount = 'challenge_count' in project ? project.challenge_count : 0;
  const artifactCount = 'artifact_count' in project ? project.artifact_count : 0;
  const description = 'description' in project ? project.description : null;
  
  return (
    <Card className="group transition-all hover:border-ink/20 hover:shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <Link href={`/projects/${project.id}`} className="flex-1 min-w-0">
          <CardTitle className="text-body-lg font-medium line-clamp-1 group-hover:text-ink transition-colors">
            {project.title}
          </CardTitle>
        </Link>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn('text-caption', statusColors[project.status])}
          >
            {project.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Pencil className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Edit
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(project)}>
                  <Copy className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Duplicate
                </DropdownMenuItem>
              )}
              {project.status === 'active' && onArchive && (
                <DropdownMenuItem onClick={() => onArchive(project)}>
                  <Archive className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Archive
                </DropdownMenuItem>
              )}
              {project.status === 'archived' && onUnarchive && (
                <DropdownMenuItem onClick={() => onUnarchive(project)}>
                  <ArchiveRestore className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Unarchive
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(project)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/projects/${project.id}`} className="block">
          {description && (
            <p className="text-caption text-muted line-clamp-2 mb-4">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between text-caption text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FolderKanban className="h-3.5 w-3.5" strokeWidth={1.5} />
                {challengeCount} challenge{challengeCount !== 1 ? 's' : ''}
              </span>
              {artifactCount > 0 && (
                <span>{artifactCount} artifact{artifactCount !== 1 ? 's' : ''}</span>
              )}
            </div>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {formatRelativeDate(project.created_at)}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
