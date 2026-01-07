'use client';

import { cn } from '@/lib/utils';

interface UnreadBadgeProps {
  count: number;
  className?: string;
  maxCount?: number;
}

export function UnreadBadge({
  count,
  className,
  maxCount = 99,
}: UnreadBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full',
        className
      )}
    >
      {displayCount}
    </span>
  );
}

interface UnreadDotProps {
  className?: string;
}

export function UnreadDot({ className }: UnreadDotProps) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse',
        className
      )}
    />
  );
}
