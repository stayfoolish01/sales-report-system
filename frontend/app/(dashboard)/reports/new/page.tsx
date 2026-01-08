'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { ReportForm, type ReportFormData } from '@/components/ReportForm';
import { reportsApi } from '@/lib/api/reports';
import { customersApi } from '@/lib/api/customers';
import type { Customer } from '@/lib/types/report';
import { Loading } from '@/components/Loading';

// APIエラーレスポンスの型
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export default function NewReportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  // 顧客一覧を取得
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customersApi.list({ limit: 100 });
        if (response.success && response.data) {
          // APIレスポンスの形式: { items: [...], pagination: {...} }
          const items = response.data.items || response.data || [];
          setCustomers(items);
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (data: ReportFormData, isDraft: boolean) => {
    setIsLoading(true);
    try {
      // フォームデータ（visit_records）をAPIの形式（visits）に変換
      const visits = data.visit_records
        ?.filter((record) => record.customer_id !== null)
        .map((record) => ({
          customer_id: record.customer_id as number,
          visit_date: data.report_date,
          purpose: '訪問',
          content: record.visit_content,
        }));

      // APIを呼び出して日報を作成
      const response = await reportsApi.create({
        report_date: data.report_date,
        problem: data.problem || undefined,
        plan: data.plan || undefined,
        visits: visits && visits.length > 0 ? visits : undefined,
      });

      if (response.success) {
        // 下書きでなければ提出（ステータスを SUBMITTED に変更）
        if (!isDraft && response.data?.report_id) {
          await reportsApi.updateStatus(response.data.report_id, 'SUBMITTED');
        }

        // 成功時は一覧または詳細画面へ遷移
        if (isDraft) {
          router.push('/reports');
        } else if (response.data?.report_id) {
          router.push(`/reports/${response.data.report_id}`);
        } else {
          router.push('/reports');
        }
      }
    } catch (error) {
      console.error('Failed to create report:', error);
      // APIエラーからメッセージを抽出
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data as ApiErrorResponse;
        if (errorData.error?.message) {
          throw new Error(errorData.error.message);
        }
      }
      throw new Error('日報の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCustomers) {
    return <Loading text="顧客データを読み込み中..." />;
  }

  return (
    <ReportForm
      mode="create"
      customers={customers}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
