'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentList } from '@/components/CommentList';
import { CommentForm } from '@/components/CommentForm';
import type { Comment } from '@/lib/types/report';

interface CommentSectionProps {
  comments: Comment[];
  currentUserId: number;
  onAddComment: (content: string) => Promise<void>;
  onEditComment?: (commentId: number, content: string) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
  isLoading?: boolean;
}

export function CommentSection({
  comments,
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  isLoading = false,
}: CommentSectionProps) {
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
  };

  const handleEditSubmit = async (content: string) => {
    if (!editingComment || !onEditComment) return;
    await onEditComment(editingComment.comment_id, content);
    setEditingComment(null);
  };

  const handleEditCancel = () => {
    setEditingComment(null);
  };

  const handleDelete = async (commentId: number) => {
    if (!onDeleteComment) return;
    await onDeleteComment(commentId);
  };

  return (
    <div className="space-y-4">
      {/* コメント一覧 */}
      <CommentList
        comments={comments}
        currentUserId={currentUserId}
        onEdit={onEditComment ? handleEdit : undefined}
        onDelete={onDeleteComment ? handleDelete : undefined}
        isLoading={isLoading}
      />

      {/* 編集フォーム */}
      {editingComment && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium mb-2">コメントを編集</p>
          <CommentForm
            onSubmit={handleEditSubmit}
            initialValue={editingComment.comment_content}
            submitLabel="更新"
            onCancel={handleEditCancel}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* 新規コメント入力 */}
      {!editingComment && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">コメントを追加</span>
          </div>
          <CommentForm
            onSubmit={onAddComment}
            placeholder="コメントを入力..."
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
