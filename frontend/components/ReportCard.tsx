'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CheckCircle, FileEdit, MessageCircle, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportListItem } from '@/lib/types/report';

interface ReportCardProps {
  report: ReportListItem;
}

export function ReportCard({ report }: ReportCardProps) {
  const isSubmitted = report.status === 'submitted';

  // 訪問先顧客の表示（最大3件）
  const displayCustomers = report.customers.slice(0, 3);
  const remainingCount = report.customers.length - 3;

  // 日付フォーマット
  const formattedDate = format(new Date(report.report_date), 'yyyy年M月d日 (E)', {
    locale: ja,
  });

  return (
    <Link href={`/reports/${report.report_id}`}>
      <div
        className={cn(
          'rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/50',
          !isSubmitted && 'border-l-4 border-l-yellow-500'
        )}
      >
        {/* ヘッダー: 日付、担当者名、ステータス */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium">{formattedDate}</span>
            <span className="text-muted-foreground">{report.sales_name}</span>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* 訪問先顧客 */}
        <div className="flex items-start gap-2 mb-2">
          <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {displayCustomers.length > 0 ? (
              <>
                {displayCustomers.map((customer, index) => (
                  <span
                    key={index}
                    className="text-sm bg-muted px-2 py-0.5 rounded"
                  >
                    {customer}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    他{remainingCount}件
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">訪問記録なし</span>
            )}
          </div>
        </div>

        {/* フッター: コメント数 */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t">
          {report.comment_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>コメント{report.comment_count}件</span>
              {report.has_unread_comments && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

interface StatusBadgeProps {
  status: 'draft' | 'submitted';
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'submitted') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
        <CheckCircle className="h-3 w-3" />
        提出済
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
      <FileEdit className="h-3 w-3" />
      下書き
    </span>
  );
}
