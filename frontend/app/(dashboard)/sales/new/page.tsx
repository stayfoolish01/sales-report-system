'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SalesForm } from '@/components/SalesForm';
import { Loading } from '@/components/Loading';
import type { SalesFormData, SalesListItem } from '@/lib/types/sales';

// モックデータ（API実装後に削除）
const mockManagers: Pick<SalesListItem, 'sales_id' | 'name' | 'position'>[] = [
  { sales_id: 1, name: '山田太郎', position: '部長' },
  { sales_id: 2, name: '鈴木一郎', position: '課長' },
  { sales_id: 3, name: '佐藤花子', position: '主任' },
];

export default function NewSalesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [managers, setManagers] = useState<
    Pick<SalesListItem, 'sales_id' | 'name' | 'position'>[]
  >([]);

  useEffect(() => {
    const fetchManagers = async () => {
      setIsFetching(true);
      try {
        // TODO: APIから上長候補を取得
        // const response = await salesApi.getManagers();
        // setManagers(response.data);

        // モック: 300ms待機
        await new Promise((resolve) => setTimeout(resolve, 300));
        setManagers(mockManagers);
      } catch (error) {
        console.error('Failed to fetch managers:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (data: SalesFormData) => {
    setIsLoading(true);
    try {
      // TODO: APIで営業担当者を作成
      // await salesApi.createSales(data);
      console.log('Creating sales:', data);

      // モック: 1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功後は一覧画面にリダイレクト（SalesFormで実行）
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Loading text="データを読み込み中..." />;
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/sales')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">営業担当者登録</h1>
          <p className="text-muted-foreground">新しい営業担当者を登録します</p>
        </div>
      </div>

      {/* フォーム */}
      <SalesForm managers={managers} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
