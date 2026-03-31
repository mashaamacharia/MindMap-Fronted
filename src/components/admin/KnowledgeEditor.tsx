'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, FileText, Clock, Check, X, Edit, Trash2 } from 'lucide-react';
import { createKnowledgeSchema, type CreateKnowledgeInput } from '@/lib/schemas';
import { 
  useAdminKnowledge, 
  useCreateKnowledgeItem, 
  useDeleteKnowledgeItem,
  usePublishKnowledgeItem,
  useUnpublishKnowledgeItem,
  useDomains,
} from '@/lib/hooks';
import { formatRelativeDate } from '@/lib/utils';
import type { KnowledgeItemRead } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

export function KnowledgeEditor() {
  const [page, setPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KnowledgeItemRead | null>(null);

  const { data, isLoading } = useAdminKnowledge(page, 20);
  const { data: domains } = useDomains();
  const createKnowledge = useCreateKnowledgeItem();
  const deleteKnowledge = useDeleteKnowledgeItem();
  const publishKnowledge = usePublishKnowledgeItem();
  const unpublishKnowledge = useUnpublishKnowledgeItem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateKnowledgeInput>({
    resolver: zodResolver(createKnowledgeSchema),
  });

  const onSubmit = async (data: CreateKnowledgeInput) => {
    try {
      await createKnowledge.mutateAsync(data);
      toast.success('Knowledge item created');
      setShowCreateDialog(false);
      reset();
    } catch {
      toast.error('Failed to create knowledge item');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteKnowledge.mutateAsync(itemToDelete.id);
      toast.success('Knowledge item deleted');
      setItemToDelete(null);
    } catch {
      toast.error('Failed to delete knowledge item');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishKnowledge.mutateAsync(id);
      toast.success('Knowledge item published');
    } catch {
      toast.error('Failed to publish');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishKnowledge.mutateAsync(id);
      toast.success('Knowledge item unpublished');
    } catch {
      toast.error('Failed to unpublish');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Knowledge Management</CardTitle>
            <CardDescription>
              Create and manage organizational knowledge items
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Create Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Create Knowledge Item</DialogTitle>
                  <DialogDescription>
                    Add new organizational knowledge for AI analysis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Knowledge item title"
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain_id">Domain</Label>
                    <Select
                      value={watch('domain_id') || ''}
                      onValueChange={(v) => setValue('domain_id', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains?.map((domain) => (
                          <SelectItem key={domain.id} value={domain.id}>
                            {domain.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.domain_id && (
                      <p className="text-sm text-destructive">{errors.domain_id.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      {...register('summary')}
                      placeholder="Brief summary of the knowledge item"
                      rows={2}
                    />
                    {errors.summary && (
                      <p className="text-sm text-destructive">{errors.summary.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Content</Label>
                    <Textarea
                      id="body"
                      {...register('body')}
                      placeholder="Full content of the knowledge item"
                      rows={8}
                    />
                    {errors.body && (
                      <p className="text-sm text-destructive">{errors.body.message}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createKnowledge.isPending}>
                    {createKnowledge.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {data?.items?.length ? (
            <div className="space-y-3">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-ink">{item.title}</h4>
                        <p className="text-xs text-muted mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.domain_code && (
                            <Badge variant="outline" className="text-xs">
                              {item.domain_code}
                            </Badge>
                          )}
                          <Badge
                            variant={item.status === 'published' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeDate(item.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.status === 'draft' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(item.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnpublish(item.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Unpublish
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setItemToDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 mx-auto text-muted mb-3" strokeWidth={1.5} />
              <p className="text-sm text-muted">No knowledge items yet</p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Create First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete knowledge item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{itemToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteKnowledge.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
