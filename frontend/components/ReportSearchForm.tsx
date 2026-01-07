'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { DateRangePicker, type DateRange } from '@/components/DateRangePicker';
import type { ReportStatus } from '@/lib/types/report';

export interface ReportSearchParams {
  dateRange: DateRange;
  salesId: number | null;
  customerName: string;
  status: ReportStatus | 'all';
}

interface SalesOption {
  sales_id: number;
  name: string;
}

interface ReportSearchFormProps {
  initialValues?: Partial<ReportSearchParams>;
  salesOptions?: SalesOption[];
  showSalesFilter?: boolean;
  onSearch: (params: ReportSearchParams) => void;
  isLoading?: boolean;
}

const defaultValues: ReportSearchParams = {
  dateRange: { startDate: null, endDate: null },
  salesId: null,
  customerName: '',
  status: 'all',
};

export function ReportSearchForm({
  initialValues,
  salesOptions = [],
  showSalesFilter = false,
  onSearch,
  isLoading = false,
}: ReportSearchFormProps) {
  const [params, setParams] = useState<ReportSearchParams>({
    ...defaultValues,
    ...initialValues,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleReset = () => {
    setParams(defaultValues);
    onSearch(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 期間 */}
        <div className="sm:col-span-2">
          <DateRangePicker
            value={params.dateRange}
            onChange={(dateRange) => setParams({ ...params, dateRange })}
            labels={{ start: '開始日', end: '終了日' }}
          />
        </div>

        {/* 営業担当者（上長のみ表示） */}
        {showSalesFilter && (
          <div>
            <Label className="text-xs text-muted-foreground">営業担当者</Label>
            <Select
              value={params.salesId?.toString() ?? ''}
              onChange={(e) =>
                setParams({
                  ...params,
                  salesId: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">全員</option>
              {salesOptions.map((sales) => (
                <option key={sales.sales_id} value={sales.sales_id}>
                  {sales.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* ステータス */}
        <div>
          <Label className="text-xs text-muted-foreground">ステータス</Label>
          <Select
            value={params.status}
            onChange={(e) =>
              setParams({
                ...params,
                status: e.target.value as ReportStatus | 'all',
              })
            }
          >
            <option value="all">すべて</option>
            <option value="submitted">提出済</option>
            <option value="draft">下書き</option>
          </Select>
        </div>

        {/* 顧客名 */}
        <div>
          <Label className="text-xs text-muted-foreground">顧客名</Label>
          <Input
            type="text"
            value={params.customerName}
            onChange={(e) =>
              setParams({ ...params, customerName: e.target.value })
            }
            placeholder="部分一致検索"
          />
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          リセット
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          検索
        </Button>
      </div>
    </form>
  );
}
