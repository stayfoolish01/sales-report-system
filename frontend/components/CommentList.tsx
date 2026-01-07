'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MessageSquare, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Comment } from '@/lib/types/report';

interface CommentListProps {
  comments: Comment[];
  currentUserId: number;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  isLoading?: boolean;
}

export function CommentList({
  comments,
  currentUserId,
  onEdit,
  onDelete,
  isLoading = false,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">コメントはまだありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          isOwner={comment.commenter.sales_id === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  isOwner: boolean;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
  isLoading?: boolean;
}

function CommentItem({
  comment,
  isOwner,
  onEdit,
  onDelete,
  isLoading = false,
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = format(
    new Date(comment.created_at),
    'yyyy-MM-dd HH:mm',
    { locale: ja }
  );

  const handleEdit = () => {
    setShowMenu(false);
    onEdit?.(comment);
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (confirm('このコメントを削除してもよろしいですか？')) {
      onDelete?.(comment.comment_id);
    }
  };

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* ヘッダー */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">
              💬 {comment.commenter.name}
            </span>
            {comment.commenter.position && (
              <span className="text-xs text-muted-foreground">
                ({comment.commenter.position})
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>

          {/* 本文 */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {comment.comment_content}
          </p>
        </div>

        {/* アクションメニュー（自分のコメントのみ） */}
        {isOwner && (onEdit || onDelete) && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isLoading}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <>
                {/* オーバーレイ */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                {/* メニュー */}
                <div className="absolute right-0 top-8 z-20 w-32 rounded-md border bg-popover shadow-md">
                  {onEdit && (
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={handleEdit}
                      disabled={isLoading}
                    >
                      <Edit2 className="h-4 w-4" />
                      編集
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      削除
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
