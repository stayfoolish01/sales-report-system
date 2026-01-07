'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Users, Search, Building2, Phone, Mail, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SimplePagination } from '@/components/Pagination';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/ErrorMessage';
import type { CustomerListItem, CustomerSearchParams } from '@/lib/types/customer';

// モックデータ（API実装後に削除）
const mockCustomers: CustomerListItem[] = [
  {
    customer_id: 1,
    customer_code: 'C001',
    customer_name: '株式会社ABC',
    address: '東京都千代田区丸の内1-1-1',
    phone: '03-1234-5678',
    email: 'info@abc.co.jp',
    is_active: true,
    created_at: '2025-01-01T09:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  {
    customer_id: 2,
    customer_code: 'C002',
    customer_name: '株式会社XYZ',
    address: '大阪府大阪市北区梅田2-2-2',
    phone: '06-9876-5432',
    email: 'contact@xyz.co.jp',
    is_active: true,
    created_at: '2025-02-15T09:00:00Z',
    updated_at: '2026-01-06T11:00:00Z',
  },
  {
    customer_id: 3,
    customer_code: 'C003',
    customer_name: '有限会社DEF',
    address: '愛知県名古屋市中区栄3-3-3',
    phone: '052-1111-2222',
    email: 'sales@def.co.jp',
    is_active: true,
    created_at: '2025-03-20T09:00:00Z',
    updated_at: '2026-01-04T09:00:00Z',
  },
  {
    customer_id: 4,
    customer_code: 'C004',
    customer_name: '合同会社GHI',
    address: '福岡県福岡市博多区博多駅前4-4-4',
    phone: '092-3333-4444',
    email: 'hello@ghi.co.jp',
    is_active: false,
    created_at: '2025-04-10T09:00:00Z',
    updated_at: '2025-12-01T15:00:00Z',
  },
  {
    customer_id: 5,
    customer_code: 'C005',
    customer_name: '株式会社JKL',
    address: '北海道札幌市中央区大通西5-5-5',
    phone: '011-5555-6666',
    email: 'info@jkl.co.jp',
    is_active: true,
    created_at: '2025-05-05T09:00:00Z',
    updated_at: '2026-01-07T08:00:00Z',
  },
  {
    customer_id: 6,
    customer_code: 'C006',
    customer_name: '株式会社MNO',
    address: '神奈川県横浜市西区みなとみらい6-6-6',
    phone: '045-7777-8888',
    email: 'support@mno.co.jp',
    is_active: true,
    created_at: '2025-06-15T09:00:00Z',
    updated_at: '2026-01-03T14:00:00Z',
  },
  {
    customer_id: 7,
    customer_code: 'C007',
    customer_name: '有限会社PQR',
    address: '京都府京都市下京区四条通7-7-7',
    phone: '075-9999-0000',
    email: 'mail@pqr.co.jp',
    is_active: false,
    created_at: '2025-07-20T09:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
  },
];

const PAGE_SIZE = 10;

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<CustomerSearchParams>({
    keyword: '',
    isActive: 'all',
  });

  // 検索用の一時入力値
  const [keywordInput, setKeywordInput] = useState('');

  // 顧客一覧を取得（モック）
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: APIからデータを取得
      // const response = await customersApi.getCustomers({
      //   ...searchParams,
      //   page: currentPage,
      //   pageSize: PAGE_SIZE,
      // });

      // モックデータをフィルタリング
      let filtered = [...mockCustomers];

      // キーワード検索（顧客名、顧客コード）
      if (searchParams.keyword) {
        const keyword = searchParams.keyword.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.customer_name.toLowerCase().includes(keyword) ||
            c.customer_code.toLowerCase().includes(keyword)
        );
      }

      // 有効/無効フィルター
      if (searchParams.isActive !== 'all') {
        const isActive = searchParams.isActive === 'active';
        filtered = filtered.filter((c) => c.is_active === isActive);
      }

      // ページネーション
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setTotalCount(filtered.length);
      setCustomers(filtered.slice(start, end));
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, keyword: keywordInput }));
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      isActive: value as CustomerSearchParams['isActive'],
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">顧客マスタ</h1>
          <p className="text-muted-foreground">顧客情報の管理・検索ができます</p>
        </div>
        <Button onClick={() => router.push('/customers/new')}>
          <Plus className="h-4 w-4 mr-2" />
          新規登録
        </Button>
      </div>

      {/* 検索フォーム */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="顧客名または顧客コードで検索..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={searchParams.isActive}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-32"
            >
              <option value="all">すべて</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </Select>
            <Button onClick={handleSearch}>検索</Button>
          </div>
        </div>
      </div>

      {/* 検索結果 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">検索結果: {totalCount}件</p>
        </div>

        {isLoading ? (
          <Loading text="顧客情報を読み込み中..." />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="顧客が見つかりません"
            description="検索条件を変更するか、新しい顧客を登録してください"
            action={{
              label: '顧客を登録',
              onClick: () => router.push('/customers/new'),
            }}
          />
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            {/* テーブルヘッダー */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-2">顧客コード</div>
              <div className="col-span-3">顧客名</div>
              <div className="col-span-3">住所</div>
              <div className="col-span-2">連絡先</div>
              <div className="col-span-1 text-center">状態</div>
              <div className="col-span-1"></div>
            </div>

            {/* テーブルボディ */}
            <div className="divide-y">
              {customers.map((customer) => (
                <CustomerRow
                  key={customer.customer_id}
                  customer={customer}
                  onEdit={() => router.push(`/customers/edit/${customer.customer_id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-6">
            <SimplePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface CustomerRowProps {
  customer: CustomerListItem;
  onEdit: () => void;
}

function CustomerRow({ customer, onEdit }: CustomerRowProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onEdit}
    >
      {/* モバイル表示 */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">
            {customer.customer_code}
          </span>
          <StatusBadge isActive={customer.is_active} />
        </div>
        <div className="font-medium">{customer.customer_name}</div>
        {customer.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{customer.address}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {customer.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:flex md:col-span-2 items-center">
        <span className="font-mono text-sm">{customer.customer_code}</span>
      </div>
      <div className="hidden md:flex md:col-span-3 items-center font-medium">
        {customer.customer_name}
      </div>
      <div className="hidden md:flex md:col-span-3 items-center text-sm text-muted-foreground">
        <span className="truncate">{customer.address || '-'}</span>
      </div>
      <div className="hidden md:flex md:col-span-2 items-center">
        <div className="space-y-1 text-sm">
          {customer.phone && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{customer.email}</span>
            </div>
          )}
          {!customer.phone && !customer.email && (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      </div>
      <div className="hidden md:flex md:col-span-1 items-center justify-center">
        <StatusBadge isActive={customer.is_active} />
      </div>
      <div className="hidden md:flex md:col-span-1 items-center justify-end">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          編集
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      {isActive ? (
        <>
          <Check className="h-3 w-3" />
          有効
        </>
      ) : (
        <>
          <X className="h-3 w-3" />
          無効
        </>
      )}
    </span>
  );
}
