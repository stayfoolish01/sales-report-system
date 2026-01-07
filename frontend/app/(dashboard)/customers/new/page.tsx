'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CustomerForm } from '@/components/CustomerForm';
import type { CustomerFormData } from '@/lib/types/customer';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);
    try {
      // TODO: APIで顧客を作成
      // await customersApi.createCustomer(data);
      console.log('Creating customer:', data);

      // モック: 1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功後は一覧画面にリダイレクト（CustomerFormで実行）
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">顧客登録</h1>
          <p className="text-muted-foreground">新しい顧客を登録します</p>
        </div>
      </div>

      {/* フォーム */}
      <CustomerForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
