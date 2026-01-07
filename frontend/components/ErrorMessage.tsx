'use client';

import { AlertCircle, AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorVariant = 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: ErrorVariant;
  onRetry?: () => void;
  className?: string;
}

const variantConfig = {
  error: {
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    textColor: 'text-destructive',
    iconColor: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-700 dark:text-yellow-500',
    iconColor: 'text-yellow-600',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-700 dark:text-blue-500',
    iconColor: 'text-blue-600',
  },
};

export function ErrorMessage({
  title,
  message,
  variant = 'error',
  onRetry,
  className,
}: ErrorMessageProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-medium mb-1', config.textColor)}>{title}</h4>
          )}
          <p className={cn('text-sm', config.textColor)}>{message}</p>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="mt-3 -ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              再試行
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlertBannerProps {
  message: string;
  variant?: ErrorVariant;
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({
  message,
  variant = 'info',
  onDismiss,
  className,
}: AlertBannerProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-lg border px-4 py-3',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn('h-4 w-4 flex-shrink-0', config.iconColor)} />
        <p className={cn('text-sm', config.textColor)}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'hover:opacity-70 transition-opacity',
            config.iconColor
          )}
          aria-label="閉じる"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-medium text-lg">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function PageError({
  title = 'エラーが発生しました',
  message = 'ページの読み込み中にエラーが発生しました。しばらく時間をおいて再度お試しください。',
  onRetry,
  onBack,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      <div className="flex gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            戻る
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </Button>
        )}
      </div>
    </div>
  );
}

interface FormErrorProps {
  message: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  return (
    <p className={cn('text-sm text-destructive', className)}>
      {message}
    </p>
  );
}
