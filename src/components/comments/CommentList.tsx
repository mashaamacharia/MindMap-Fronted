'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, MoreHorizontal, Check, Undo, Trash2, Edit } from 'lucide-react';
import { 
  useComments, 
  useCreateComment, 
  useUpdateComment,
  useDeleteComment, 
  useResolveComment, 
  useUnresolveComment 
} from '@/lib/hooks';
import { useAuthStore } from '@/lib/stores';
import { formatRelativeDate } from '@/lib/utils';
import type { CommentRead } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
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

interface CommentListProps {
  artifactId: string;
}

function CommentItem({ 
  comment, 
  onResolve, 
  onUnresolve, 
  onDelete,
  onEdit,
  currentUserId,
}: { 
  comment: CommentRead;
  onResolve: (id: string) => void;
  onUnresolve: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (comment: CommentRead) => void;
  currentUserId?: string;
}) {
  const isOwner = currentUserId === comment.author_id;
  const initials = comment.author_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className={`flex gap-3 p-4 rounded-lg ${comment.resolved ? 'bg-green-50 border border-green-200' : 'bg-surface'}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {comment.author_avatar_url && (
          <AvatarImage src={comment.author_avatar_url} alt={comment.author_name || ''} />
        )}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-ink">
              {comment.author_name || 'Unknown'}
            </span>
            <span className="text-xs text-muted">
              {formatRelativeDate(comment.created_at)}
            </span>
            {comment.resolved && (
              <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                <Check className="h-3 w-3" />
                Resolved
              </span>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {comment.resolved ? (
                <DropdownMenuItem onClick={() => onUnresolve(comment.id)}>
                  <Undo className="mr-2 h-4 w-4" />
                  Unresolve
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onResolve(comment.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Resolve
                </DropdownMenuItem>
              )}
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(comment)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="mt-1 text-sm text-ink whitespace-pre-wrap">{comment.body}</p>
      </div>
    </div>
  );
}

export function CommentList({ artifactId }: CommentListProps) {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<CommentRead | null>(null);
  const [editBody, setEditBody] = useState('');
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useComments(artifactId, page);
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const resolveComment = useResolveComment();
  const unresolveComment = useUnresolveComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment.mutateAsync({
        artifact_id: artifactId,
        body: newComment.trim(),
      });
      setNewComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleEdit = (comment: CommentRead) => {
    setEditingComment(comment);
    setEditBody(comment.body);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editBody.trim()) return;

    try {
      await updateComment.mutateAsync({
        commentId: editingComment.id,
        data: { body: editBody.trim() },
      });
      setEditingComment(null);
      setEditBody('');
      toast.success('Comment updated');
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveComment.mutateAsync(id);
      toast.success('Comment resolved');
    } catch {
      toast.error('Failed to resolve comment');
    }
  };

  const handleUnresolve = async (id: string) => {
    try {
      await unresolveComment.mutateAsync(id);
      toast.success('Comment unresolved');
    } catch {
      toast.error('Failed to unresolve comment');
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment.mutateAsync(commentToDelete);
      setCommentToDelete(null);
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newComment.trim() || createComment.isPending}
          >
            {createComment.isPending ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      {data?.results?.length ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted flex items-center gap-2">
            <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
            {data.count} {data.count === 1 ? 'comment' : 'comments'}
          </h3>
          
          <div className="space-y-2">
            {data.results.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onResolve={handleResolve}
                onUnresolve={handleUnresolve}
                onDelete={setCommentToDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.count > 20 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {Math.ceil(data.count / 20)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.count / 20)}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {/* Edit dialog */}
      {editingComment && (
        <AlertDialog open onOpenChange={() => setEditingComment(null)}>
          <AlertDialogContent>
            <form onSubmit={handleEditSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Comment</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="py-4">
                <Textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={4}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={!editBody.trim() || updateComment.isPending}
                >
                  {updateComment.isPending ? 'Saving...' : 'Save'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
