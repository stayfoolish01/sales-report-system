'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  initialValue?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  placeholder = 'コメントを入力...',
  isLoading = false,
  initialValue = '',
  submitLabel = '送信',
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!content.trim()) {
      setError('コメントを入力してください');
      return false;
    }
    if (content.length > 500) {
      setError('コメントは500文字以内で入力してください');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(content.trim());
      setContent('');
      setError(null);
    } catch {
      setError('コメントの送信に失敗しました');
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setError(null);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          placeholder={placeholder}
          disabled={isLoading}
          rows={3}
          maxLength={500}
          className={error ? 'border-destructive' : ''}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {content.length}/500
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            キャンセル
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !content.trim()}
        >
          <Send className="h-4 w-4 mr-1" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
