'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/components/CustomerForm';
import { Loading } from '@/components/Loading';
import { PageError } from '@/components/ErrorMessage';
import type { CustomerDetail, CustomerFormData } from '@/lib/types/customer';

// モックデータ（API実装後に削除）
const mockCustomerDetail: CustomerDetail = {
  customer_id: 1,
  customer_code: 'C001',
  customer_name: '株式会社ABC',
  address: '東京都千代田区丸の内1-1-1',
  phone: '03-1234-5678',
  email: 'info@abc.co.jp',
  contact_person: '田中一郎',
  notes: '大口顧客。月1回の定期訪問が必要。',
  is_active: true,
  created_at: '2025-01-01T09:00:00Z',
  updated_at: '2026-01-05T10:00:00Z',
};

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: APIから顧客データを取得
        // const response = await customersApi.getCustomer(customerId);
        // setCustomer(response.data);

        // モック: 500ms待機
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCustomer(mockCustomerDetail);
      } catch (err) {
        console.error('Failed to fetch customer:', err);
        setError('顧客情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsSaving(true);
    try {
      // TODO: APIで顧客を更新
      // await customersApi.updateCustomer(customerId, data);
      console.log('Updating customer:', customerId, data);

      // モック: 1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功後は一覧画面にリダイレクト（CustomerFormで実行）
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="顧客情報を読み込み中..." />;
  }

  if (error || !customer) {
    return (
      <PageError
        title="顧客が見つかりません"
        message={error || '指定された顧客は存在しないか、削除された可能性があります。'}
        onBack={() => router.push('/customers')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/customers')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">顧客編集</h1>
          <p className="text-muted-foreground">
            {customer.customer_code} - {customer.customer_name}
          </p>
        </div>
      </div>

      {/* フォーム */}
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
