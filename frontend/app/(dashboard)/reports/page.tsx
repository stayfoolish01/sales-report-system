'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { FilePlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportCard } from '@/components/ReportCard';
import { ReportSearchForm, type ReportSearchParams } from '@/components/ReportSearchForm';
import { SimplePagination } from '@/components/Pagination';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/ErrorMessage';
import { useAuthStore } from '@/lib/stores/authStore';
import type { ReportListItem } from '@/lib/types/report';

// モックデータ（API実装後に削除）
const mockReports: ReportListItem[] = [
  {
    report_id: 1,
    sales_id: 1,
    sales_name: '山田太郎',
    report_date: '2026-01-07',
    status: 'submitted',
    visit_count: 2,
    customers: ['株式会社ABC', '株式会社XYZ'],
    comment_count: 2,
    has_unread_comments: true,
    created_at: '2026-01-07T09:00:00Z',
    updated_at: '2026-01-07T18:30:00Z',
  },
  {
    report_id: 2,
    sales_id: 1,
    sales_name: '山田太郎',
    report_date: '2026-01-06',
    status: 'submitted',
    visit_count: 1,
    customers: ['株式会社DEF'],
    comment_count: 1,
    has_unread_comments: false,
    created_at: '2026-01-06T09:00:00Z',
    updated_at: '2026-01-06T18:00:00Z',
  },
  {
    report_id: 3,
    sales_id: 1,
    sales_name: '山田太郎',
    report_date: '2026-01-05',
    status: 'draft',
    visit_count: 1,
    customers: ['株式会社GHI'],
    comment_count: 0,
    has_unread_comments: false,
    created_at: '2026-01-05T09:00:00Z',
    updated_at: '2026-01-05T17:00:00Z',
  },
  {
    report_id: 4,
    sales_id: 2,
    sales_name: '鈴木一郎',
    report_date: '2026-01-07',
    status: 'submitted',
    visit_count: 3,
    customers: ['株式会社JKL', '株式会社MNO', '株式会社PQR', '株式会社STU'],
    comment_count: 0,
    has_unread_comments: false,
    created_at: '2026-01-07T09:00:00Z',
    updated_at: '2026-01-07T19:00:00Z',
  },
];

const mockSalesOptions = [
  { sales_id: 1, name: '山田太郎' },
  { sales_id: 2, name: '鈴木一郎' },
  { sales_id: 3, name: '佐藤花子' },
];

const PAGE_SIZE = 10;

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ReportSearchParams>({
    dateRange: {
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    salesId: null,
    customerName: '',
    status: 'all',
  });

  // 日報一覧を取得（モック）
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: APIからデータを取得
      // const response = await reportsApi.getReports({
      //   ...searchParams,
      //   page: currentPage,
      //   pageSize: PAGE_SIZE,
      // });

      // モックデータをフィルタリング
      let filtered = [...mockReports];

      // ステータスフィルター
      if (searchParams.status !== 'all') {
        filtered = filtered.filter((r) => r.status === searchParams.status);
      }

      // 営業担当者フィルター
      if (searchParams.salesId) {
        filtered = filtered.filter((r) => r.sales_id === searchParams.salesId);
      }

      // 顧客名フィルター
      if (searchParams.customerName) {
        filtered = filtered.filter((r) =>
          r.customers.some((c) =>
            c.toLowerCase().includes(searchParams.customerName.toLowerCase())
          )
        );
      }

      // 日付範囲フィルター
      if (searchParams.dateRange.startDate) {
        filtered = filtered.filter(
          (r) => r.report_date >= searchParams.dateRange.startDate!
        );
      }
      if (searchParams.dateRange.endDate) {
        filtered = filtered.filter(
          (r) => r.report_date <= searchParams.dateRange.endDate!
        );
      }

      // ページネーション
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      setTotalCount(filtered.length);
      setReports(filtered.slice(start, end));
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (params: ReportSearchParams) => {
    setSearchParams(params);
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
          <h1 className="text-2xl font-bold">日報一覧</h1>
          <p className="text-muted-foreground">
            日報の検索・閲覧ができます
          </p>
        </div>
        <Button onClick={() => router.push('/reports/new')}>
          <FilePlus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      {/* 検索フォーム */}
      <div className="rounded-lg border bg-card p-4">
        <ReportSearchForm
          initialValues={searchParams}
          salesOptions={isAdmin ? mockSalesOptions : []}
          showSalesFilter={isAdmin}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      {/* 検索結果 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            検索結果: {totalCount}件
          </p>
        </div>

        {isLoading ? (
          <Loading text="日報を読み込み中..." />
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="日報が見つかりません"
            description="検索条件を変更するか、新しい日報を作成してください"
            action={{
              label: '日報を作成',
              onClick: () => router.push('/reports/new'),
            }}
          />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.report_id} report={report} />
            ))}
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
