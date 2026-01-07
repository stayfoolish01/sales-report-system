'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportForm, type ReportFormData } from '@/components/ReportForm';
import type { Customer } from '@/lib/types/report';

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

export default function NewReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ReportFormData, isDraft: boolean) => {
    setIsLoading(true);
    try {
      // TODO: APIを呼び出して日報を作成
      // const response = await reportsApi.createReport({
      //   ...data,
      //   status: isDraft ? 'draft' : 'submitted',
      // });

      // モック処理
      console.log('Creating report:', { ...data, isDraft });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時は一覧または詳細画面へ遷移
      if (isDraft) {
        router.push('/reports');
      } else {
        // TODO: 作成された日報のIDを使用して詳細画面へ遷移
        // router.push(`/reports/${response.data.report_id}`);
        router.push('/reports');
      }
    } catch (error) {
      console.error('Failed to create report:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReportForm
      mode="create"
      customers={mockCustomers}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
