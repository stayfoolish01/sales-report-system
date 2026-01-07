'use client';

import Link from 'next/link';
import {
  FileText,
  FilePlus,
  Users,
  UserCog,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
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

  // モックデータ（API実装後に実際のデータに置き換え）
  const summaryData = {
    unsubmittedReports: 1,
    unreadComments: 3,
    subordinatesUnsubmitted: 2,
  };

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
          disabled
        />
        <MenuCard
          href="/reports"
          icon={<FileText className="h-6 w-6" />}
          title="日報一覧"
          description="過去の日報を確認する"
          disabled
        />
        <MenuCard
          href="/customers"
          icon={<Users className="h-6 w-6" />}
          title="顧客マスタ"
          description="顧客情報を管理する"
          disabled
        />
        {isAdmin && (
          <MenuCard
            href="/sales-staff"
            icon={<UserCog className="h-6 w-6" />}
            title="営業マスタ"
            description="営業担当者を管理する"
            disabled
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryItem
              icon={<AlertCircle className="h-4 w-4" />}
              label="未提出の日報"
              value={summaryData.unsubmittedReports}
              variant="warning"
            />
            <SummaryItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="未読コメント"
              value={summaryData.unreadComments}
            />
            {isAdmin && (
              <SummaryItem
                icon={<AlertCircle className="h-4 w-4" />}
                label="部下の未提出日報"
                value={summaryData.subordinatesUnsubmitted}
                variant="warning"
              />
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ※ 概要データはダッシュボードAPI（Issue #26）実装後に実際のデータに置き換わります
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
