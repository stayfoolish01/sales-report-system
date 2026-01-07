'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SalesForm } from '@/components/SalesForm';
import { Loading } from '@/components/Loading';
import { PageError } from '@/components/ErrorMessage';
import type { SalesDetail, SalesFormData, SalesListItem } from '@/lib/types/sales';

// モックデータ（API実装後に削除）
const mockSalesDetail: SalesDetail = {
  sales_id: 2,
  name: '鈴木一郎',
  email: 'suzuki@example.com',
  department: '営業部',
  position: '課長',
  role: 'admin',
  manager: { sales_id: 1, name: '山田太郎' },
  subordinates: [
    { sales_id: 3, name: '佐藤花子', position: '主任' },
    { sales_id: 4, name: '田中次郎', position: '一般' },
  ],
  is_active: true,
  created_at: '2025-02-15T09:00:00Z',
  updated_at: '2026-01-06T11:00:00Z',
};

const mockManagers: Pick<SalesListItem, 'sales_id' | 'name' | 'position'>[] = [
  { sales_id: 1, name: '山田太郎', position: '部長' },
  { sales_id: 2, name: '鈴木一郎', position: '課長' },
  { sales_id: 3, name: '佐藤花子', position: '主任' },
];

export default function EditSalesPage() {
  const params = useParams();
  const router = useRouter();
  const salesId = params.id as string;

  const [sales, setSales] = useState<SalesDetail | null>(null);
  const [managers, setManagers] = useState<
    Pick<SalesListItem, 'sales_id' | 'name' | 'position'>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: APIから営業担当者データと上長候補を取得
        // const [salesResponse, managersResponse] = await Promise.all([
        //   salesApi.getSales(salesId),
        //   salesApi.getManagers(),
        // ]);
        // setSales(salesResponse.data);
        // setManagers(managersResponse.data);

        // モック: 500ms待機
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSales(mockSalesDetail);
        setManagers(mockManagers);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('営業担当者情報の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (salesId) {
      fetchData();
    }
  }, [salesId]);

  const handleSubmit = async (data: SalesFormData) => {
    setIsSaving(true);
    try {
      // TODO: APIで営業担当者を更新
      // await salesApi.updateSales(salesId, data);
      console.log('Updating sales:', salesId, data);

      // モック: 1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功後は一覧画面にリダイレクト（SalesFormで実行）
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="営業担当者情報を読み込み中..." />;
  }

  if (error || !sales) {
    return (
      <PageError
        title="営業担当者が見つかりません"
        message={error || '指定された営業担当者は存在しないか、削除された可能性があります。'}
        onBack={() => router.push('/sales')}
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
          onClick={() => router.push('/sales')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">営業担当者編集</h1>
          <p className="text-muted-foreground">
            {sales.name} ({sales.position})
          </p>
        </div>
      </div>

      {/* フォーム */}
      <SalesForm
        initialData={sales}
        managers={managers}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
