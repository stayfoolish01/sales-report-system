'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  FilePlus,
  Users,
  UserCog,
  AlertCircle,
  MessageSquare,
  CalendarCheck,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { dashboardApi, type DashboardSummary } from '@/lib/api/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// メニューカード用の型
interface MenuCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
}

function MenuCard({ href, icon, title, description, disabled }: MenuCardProps) {
  const content = (
    <Card
      className={`transition-all hover:shadow-md ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:border-primary'
      }`}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );

  if (disabled) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

// 概要カード用の型
interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  variant?: 'default' | 'warning';
}

function SummaryItem({
  icon,
  label,
  value,
  variant = 'default',
}: SummaryItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`rounded-full p-2 ${
          variant === 'warning'
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className={`text-xl font-bold ${
            variant === 'warning' && value > 0 ? 'text-destructive' : ''
          }`}
        >
          {value}件
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await dashboardApi.getSummary();
        if (response.success && response.data) {
          setSummaryData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      {/* メニューカード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MenuCard
          href="/reports/new"
          icon={<FilePlus className="h-6 w-6" />}
          title="日報作成"
          description="本日の日報を作成する"

        />
        <MenuCard
          href="/reports"
          icon={<FileText className="h-6 w-6" />}
          title="日報一覧"
          description="過去の日報を確認する"

        />
        <MenuCard
          href="/customers"
          icon={<Users className="h-6 w-6" />}
          title="顧客マスタ"
          description="顧客情報を管理する"

        />
        {isAdmin && (
          <MenuCard
            href="/sales"
            icon={<UserCog className="h-6 w-6" />}
            title="営業マスタ"
            description="営業担当者を管理する"
  
          />
        )}
      </div>

      {/* 本日の概要 */}
      <Card>
        <CardHeader>
          <CardTitle>本日の概要</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-4">
              読み込み中...
            </div>
          ) : summaryData ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryItem
                  icon={<AlertCircle className="h-4 w-4" />}
                  label="未提出の日報"
                  value={summaryData.unsubmitted_reports}
                  variant="warning"
                />
                <SummaryItem
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="直近のコメント"
                  value={summaryData.unread_comments}
                />
                <SummaryItem
                  icon={<CalendarCheck className="h-4 w-4" />}
                  label="本日の訪問"
                  value={summaryData.today_visits}
                />
                <SummaryItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="今月の日報"
                  value={summaryData.this_month_reports}
                />
                {isAdmin && summaryData.subordinates_unsubmitted > 0 && (
                  <SummaryItem
                    icon={<AlertCircle className="h-4 w-4" />}
                    label="部下の未提出日報"
                    value={summaryData.subordinates_unsubmitted}
                    variant="warning"
                  />
                )}
              </div>

              {/* 未提出日報のリスト */}
              {summaryData.unsubmitted_reports_list.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-destructive mb-3">
                    未提出の日報（クリックで編集）
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {summaryData.unsubmitted_reports_list.map((report) => (
                      <Link
                        key={report.report_id}
                        href={`/reports/${report.report_id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        {new Date(report.report_date).toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 直近のコメントリスト */}
              {summaryData.recent_comments_list && summaryData.recent_comments_list.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-3">
                    直近のコメント（クリックで日報を表示）
                  </h3>
                  <div className="space-y-2">
                    {summaryData.recent_comments_list.map((comment) => (
                      <Link
                        key={comment.comment_id}
                        href={`/reports/${comment.report_id}`}
                        className="block p-3 rounded-md text-sm bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{comment.commenter_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.report_date).toLocaleDateString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                            })}の日報
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.comment_content}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              データの取得に失敗しました
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
