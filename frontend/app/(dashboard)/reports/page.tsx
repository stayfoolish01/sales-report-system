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
import { reportsApi } from '@/lib/api/reports';
import { salesStaffApi } from '@/lib/api/salesStaff';
import type { ReportListItem } from '@/lib/types/report';

const PAGE_SIZE = 10;

interface SalesOption {
  sales_id: number;
  name: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [salesOptions, setSalesOptions] = useState<SalesOption[]>([]);
  const [searchParams, setSearchParams] = useState<ReportSearchParams>({
    dateRange: {
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    salesId: null,
    customerName: '',
    status: 'all',
  });

  // 営業担当者一覧を取得（管理者のみ）
  useEffect(() => {
    const fetchSalesStaff = async () => {
      if (!isAdmin) return;
      try {
        const response = await salesStaffApi.list({ limit: 100 });
        if (response.success && response.data) {
          // APIレスポンスの形式: { items: [...], pagination: {...} }
          const items = response.data.items || response.data || [];
          setSalesOptions(
            items.map((staff: { sales_id: number; name: string }) => ({
              sales_id: staff.sales_id,
              name: staff.name,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch sales staff:', error);
      }
    };
    fetchSalesStaff();
  }, [isAdmin]);

  // 日報一覧を取得
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: PAGE_SIZE,
      };

      if (searchParams.dateRange.startDate) {
        params.start_date = searchParams.dateRange.startDate;
      }
      if (searchParams.dateRange.endDate) {
        params.end_date = searchParams.dateRange.endDate;
      }
      if (searchParams.status !== 'all') {
        params.status = searchParams.status;
      }
      if (searchParams.salesId) {
        params.sales_id = searchParams.salesId;
      }

      const response = await reportsApi.list(params);

      if (response.success && response.data) {
        // APIレスポンスの形式: { items: [...], pagination: {...} }
        const items = response.data.items || response.data || [];
        const pagination = response.data.pagination || response.pagination;

        // APIレスポンスをフロントエンドの型に変換
        const mappedReports: ReportListItem[] = items.map(
          (report: {
            report_id: number;
            sales_id?: number;
            sales_staff?: { sales_id: number; name: string; department?: string };
            report_date: string;
            status: string;
            visit_records?: { customer?: { company_name: string } }[];
            comment_count?: number;
            created_at: string;
            updated_at: string;
          }) => ({
            report_id: report.report_id,
            sales_id: report.sales_id || report.sales_staff?.sales_id || 0,
            sales_name: report.sales_staff?.name || '',
            report_date: report.report_date,
            status: report.status,
            visit_count: report.visit_records?.length || 0,
            customers: report.visit_records?.map(
              (v: { customer?: { company_name: string } }) =>
                v.customer?.company_name || ''
            ).filter(Boolean) || [],
            comment_count: report.comment_count || 0,
            has_unread_comments: false,
            created_at: report.created_at,
            updated_at: report.updated_at,
          })
        );

        // 顧客名フィルター（クライアントサイド）
        let filtered = mappedReports;
        if (searchParams.customerName) {
          filtered = mappedReports.filter((r) =>
            r.customers.some((c) =>
              c.toLowerCase().includes(searchParams.customerName.toLowerCase())
            )
          );
        }

        setReports(filtered);
        setTotalCount(pagination?.total || filtered.length);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports([]);
      setTotalCount(0);
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
          salesOptions={isAdmin ? salesOptions : []}
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
