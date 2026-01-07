'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  UserCog,
  Search,
  Mail,
  Shield,
  User,
  Check,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SimplePagination } from '@/components/Pagination';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/ErrorMessage';
import type { SalesListItem, SalesSearchParams } from '@/lib/types/sales';

// モックデータ（API実装後に削除）
const mockSales: SalesListItem[] = [
  {
    sales_id: 1,
    name: '山田太郎',
    email: 'yamada@example.com',
    department: '営業部',
    position: '部長',
    role: 'admin',
    manager: null,
    is_active: true,
    created_at: '2025-01-01T09:00:00Z',
    updated_at: '2026-01-05T10:00:00Z',
  },
  {
    sales_id: 2,
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    department: '営業部',
    position: '課長',
    role: 'admin',
    manager: { sales_id: 1, name: '山田太郎' },
    is_active: true,
    created_at: '2025-02-15T09:00:00Z',
    updated_at: '2026-01-06T11:00:00Z',
  },
  {
    sales_id: 3,
    name: '佐藤花子',
    email: 'sato@example.com',
    department: '営業部',
    position: '主任',
    role: 'general',
    manager: { sales_id: 2, name: '鈴木一郎' },
    is_active: true,
    created_at: '2025-03-20T09:00:00Z',
    updated_at: '2026-01-04T09:00:00Z',
  },
  {
    sales_id: 4,
    name: '田中次郎',
    email: 'tanaka@example.com',
    department: '営業部',
    position: '一般',
    role: 'general',
    manager: { sales_id: 2, name: '鈴木一郎' },
    is_active: true,
    created_at: '2025-04-10T09:00:00Z',
    updated_at: '2025-12-01T15:00:00Z',
  },
  {
    sales_id: 5,
    name: '高橋美咲',
    email: 'takahashi@example.com',
    department: '営業部',
    position: '一般',
    role: 'general',
    manager: { sales_id: 3, name: '佐藤花子' },
    is_active: true,
    created_at: '2025-05-05T09:00:00Z',
    updated_at: '2026-01-07T08:00:00Z',
  },
  {
    sales_id: 6,
    name: '伊藤健太',
    email: 'ito@example.com',
    department: '営業部',
    position: '一般',
    role: 'general',
    manager: { sales_id: 3, name: '佐藤花子' },
    is_active: false,
    created_at: '2025-06-15T09:00:00Z',
    updated_at: '2025-11-15T10:00:00Z',
  },
];

const PAGE_SIZE = 10;

export default function SalesPage() {
  const router = useRouter();

  const [salesList, setSalesList] = useState<SalesListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SalesSearchParams>({
    keyword: '',
    department: '',
    role: 'all',
    isActive: 'all',
  });

  // 検索用の一時入力値
  const [keywordInput, setKeywordInput] = useState('');

  // 営業担当一覧を取得（モック）
  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: APIからデータを取得
      // const response = await salesApi.getSales({
      //   ...searchParams,
      //   page: currentPage,
      //   pageSize: PAGE_SIZE,
      // });

      // モックデータをフィルタリング
      let filtered = [...mockSales];

      // キーワード検索（氏名、メール）
      if (searchParams.keyword) {
        const keyword = searchParams.keyword.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(keyword) ||
            s.email.toLowerCase().includes(keyword)
        );
      }

      // 権限フィルター
      if (searchParams.role !== 'all') {
        filtered = filtered.filter((s) => s.role === searchParams.role);
      }

      // 有効/無効フィルター
      if (searchParams.isActive !== 'all') {
        const isActive = searchParams.isActive === 'active';
        filtered = filtered.filter((s) => s.is_active === isActive);
      }

      // ページネーション
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setTotalCount(filtered.length);
      setSalesList(filtered.slice(start, end));
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, keyword: keywordInput }));
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRoleChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      role: value as SalesSearchParams['role'],
    }));
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      isActive: value as SalesSearchParams['isActive'],
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
          <h1 className="text-2xl font-bold">営業マスタ</h1>
          <p className="text-muted-foreground">営業担当者の管理ができます</p>
        </div>
        <Button onClick={() => router.push('/sales/new')}>
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
                placeholder="氏名またはメールアドレスで検索..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={searchParams.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-28"
            >
              <option value="all">権限</option>
              <option value="admin">管理者</option>
              <option value="general">一般</option>
            </Select>
            <Select
              value={searchParams.isActive}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-24"
            >
              <option value="all">状態</option>
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
          <Loading text="営業担当を読み込み中..." />
        ) : salesList.length === 0 ? (
          <EmptyState
            icon={<UserCog className="h-12 w-12" />}
            title="営業担当者が見つかりません"
            description="検索条件を変更するか、新しい営業担当者を登録してください"
            action={{
              label: '営業担当者を登録',
              onClick: () => router.push('/sales/new'),
            }}
          />
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            {/* テーブルヘッダー */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-3">氏名</div>
              <div className="col-span-3">メールアドレス</div>
              <div className="col-span-2">役職</div>
              <div className="col-span-2">上長</div>
              <div className="col-span-1 text-center">状態</div>
              <div className="col-span-1"></div>
            </div>

            {/* テーブルボディ */}
            <div className="divide-y">
              {salesList.map((sales) => (
                <SalesRow
                  key={sales.sales_id}
                  sales={sales}
                  onEdit={() => router.push(`/sales/edit/${sales.sales_id}`)}
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

interface SalesRowProps {
  sales: SalesListItem;
  onEdit: () => void;
}

function SalesRow({ sales, onEdit }: SalesRowProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onEdit}
    >
      {/* モバイル表示 */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{sales.name}</span>
            <RoleBadge role={sales.role} />
          </div>
          <StatusBadge isActive={sales.is_active} />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{sales.email}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{sales.position}</span>
          {sales.manager && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              <span>{sales.manager.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:flex md:col-span-3 items-center gap-2">
        <span className="font-medium">{sales.name}</span>
        <RoleBadge role={sales.role} />
      </div>
      <div className="hidden md:flex md:col-span-3 items-center text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{sales.email}</span>
        </div>
      </div>
      <div className="hidden md:flex md:col-span-2 items-center text-sm text-muted-foreground">
        {sales.position}
      </div>
      <div className="hidden md:flex md:col-span-2 items-center text-sm">
        {sales.manager ? (
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{sales.manager.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
      <div className="hidden md:flex md:col-span-1 items-center justify-center">
        <StatusBadge isActive={sales.is_active} />
      </div>
      <div className="hidden md:flex md:col-span-1 items-center justify-end">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          編集
        </Button>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: 'admin' | 'general' }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        <Shield className="h-3 w-3" />
        管理者
      </span>
    );
  }
  return null;
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
