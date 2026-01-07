'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReportForm, type ReportFormData } from '@/components/ReportForm';
import { Loading } from '@/components/Loading';
import { PageError } from '@/components/ErrorMessage';
import { useAuthStore } from '@/lib/stores/authStore';
import type { Customer, ReportDetail } from '@/lib/types/report';

// モック顧客データ（API実装後に削除）
const mockCustomers: Customer[] = [
  {
    customer_id: 1,
    customer_name: '鈴木一郎',
    company_name: '株式会社ABC',
    department: '営業部',
  },
  {
    customer_id: 2,
    customer_name: '田中花子',
    company_name: '株式会社XYZ',
    department: '総務部',
  },
  {
    customer_id: 3,
    customer_name: '佐藤次郎',
    company_name: '株式会社DEF',
    department: '開発部',
  },
  {
    customer_id: 4,
    customer_name: '高橋三郎',
    company_name: '株式会社GHI',
    department: '人事部',
  },
  {
    customer_id: 5,
    customer_name: '伊藤四郎',
    company_name: '株式会社JKL',
    department: '経理部',
  },
];

// モック日報データ（API実装後に削除）
const mockReportDetail: ReportDetail = {
  report_id: 1,
  sales: {
    sales_id: 1,
    name: '山田太郎',
    department: '営業一部',
  },
  report_date: '2026-01-07',
  status: 'draft',
  problem: 'ABC社の決裁者へのアプローチ方法について相談したい。',
  plan: 'ABC社：提案資料のブラッシュアップ\nXYZ社：見積書の提出',
  visit_records: [
    {
      visit_id: 1,
      customer: {
        customer_id: 1,
        customer_name: '鈴木一郎',
        company_name: '株式会社ABC',
        department: '営業部',
      },
      visit_content:
        '新商品の提案を実施。好感触だが決裁者との面談が必要。次回は来週の部会で同席いただく予定。',
      visit_order: 1,
      created_at: '2026-01-07T10:00:00Z',
    },
    {
      visit_id: 2,
      customer: {
        customer_id: 2,
        customer_name: '田中花子',
        company_name: '株式会社XYZ',
        department: '総務部',
      },
      visit_content: '契約更新の商談。価格交渉あり。来週までに見積書を提出予定。',
      visit_order: 2,
      created_at: '2026-01-07T14:00:00Z',
    },
  ],
  comments: {
    problem: [],
    plan: [],
  },
  created_at: '2026-01-07T09:00:00Z',
  updated_at: '2026-01-07T18:30:00Z',
};

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const reportId = params.id as string;

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: APIからデータを取得
      // const response = await reportsApi.getReport(reportId);
      // setReport(response.data);

      // モックデータを使用
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReport(mockReportDetail);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('日報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // 権限チェック
  const isOwner = user?.sales_id === report?.sales.sales_id;
  const canEdit = isOwner && report?.status === 'draft';

  const handleSubmit = async (data: ReportFormData, isDraft: boolean) => {
    setIsSaving(true);
    try {
      // TODO: APIを呼び出して日報を更新
      // await reportsApi.updateReport(reportId, {
      //   ...data,
      //   status: isDraft ? 'draft' : 'submitted',
      // });

      // モック処理
      console.log('Updating report:', { reportId, ...data, isDraft });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時は詳細画面へ遷移
      router.push(`/reports/${reportId}`);
    } catch (error) {
      console.error('Failed to update report:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="日報を読み込み中..." />;
  }

  if (error || !report) {
    return (
      <PageError
        title="日報が見つかりません"
        message={error || '指定された日報は存在しないか、アクセス権限がありません。'}
        onRetry={fetchReport}
        onBack={() => router.push('/reports')}
      />
    );
  }

  if (!canEdit) {
    return (
      <PageError
        title="編集できません"
        message="この日報は編集できません。提出済みの日報は編集できません。"
        onBack={() => router.push(`/reports/${reportId}`)}
      />
    );
  }

  // ReportDetailからReportFormDataに変換
  const initialData: ReportFormData = {
    report_date: report.report_date,
    visit_records: report.visit_records.map((record) => ({
      customer_id: record.customer.customer_id,
      visit_content: record.visit_content,
    })),
    problem: report.problem || '',
    plan: report.plan || '',
  };

  return (
    <ReportForm
      mode="edit"
      initialData={initialData}
      customers={mockCustomers}
      onSubmit={handleSubmit}
      isLoading={isSaving}
    />
  );
}
