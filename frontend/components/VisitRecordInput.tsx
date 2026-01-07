'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Customer } from '@/lib/types/report';

export interface VisitRecordFormData {
  customer_id: number | null;
  visit_content: string;
}

interface VisitRecordInputProps {
  records: VisitRecordFormData[];
  customers: Customer[];
  onChange: (records: VisitRecordFormData[]) => void;
  disabled?: boolean;
  errors?: { [key: number]: { customer_id?: string; visit_content?: string } };
}

export function VisitRecordInput({
  records,
  customers,
  onChange,
  disabled = false,
  errors = {},
}: VisitRecordInputProps) {
  // 訪問記録を追加
  const handleAdd = () => {
    onChange([...records, { customer_id: null, visit_content: '' }]);
  };

  // 訪問記録を削除
  const handleRemove = (index: number) => {
    onChange(records.filter((_, i) => i !== index));
  };

  // 訪問記録を更新
  const handleChange = (
    index: number,
    field: keyof VisitRecordFormData,
    value: string | number | null
  ) => {
    const newRecords = [...records];
    if (field === 'customer_id') {
      newRecords[index] = {
        ...newRecords[index],
        customer_id: value ? Number(value) : null,
      };
    } else {
      newRecords[index] = {
        ...newRecords[index],
        visit_content: value as string,
      };
    }
    onChange(newRecords);
  };

  // 選択済みの顧客IDリスト（重複選択防止用）
  const selectedCustomerIds = records
    .map((r) => r.customer_id)
    .filter((id): id is number => id !== null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">訪問記録</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          訪問記録を追加
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">訪問記録がありません</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={handleAdd}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-1" />
            最初の訪問記録を追加
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record, index) => (
            <VisitRecordItem
              key={index}
              index={index}
              record={record}
              customers={customers}
              selectedCustomerIds={selectedCustomerIds}
              onChange={(field, value) => handleChange(index, field, value)}
              onRemove={() => handleRemove(index)}
              disabled={disabled}
              canRemove={records.length > 1}
              error={errors[index]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface VisitRecordItemProps {
  index: number;
  record: VisitRecordFormData;
  customers: Customer[];
  selectedCustomerIds: number[];
  onChange: (field: keyof VisitRecordFormData, value: string | number | null) => void;
  onRemove: () => void;
  disabled: boolean;
  canRemove: boolean;
  error?: { customer_id?: string; visit_content?: string };
}

function VisitRecordItem({
  index,
  record,
  customers,
  selectedCustomerIds,
  onChange,
  onRemove,
  disabled,
  canRemove,
  error,
}: VisitRecordItemProps) {
  return (
    <div className="relative rounded-lg border bg-card p-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {index + 1}.
          </span>
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1">削除</span>
          </Button>
        )}
      </div>

      {/* 顧客選択 */}
      <div className="space-y-2 mb-4">
        <Label htmlFor={`customer-${index}`}>顧客 *</Label>
        <Select
          id={`customer-${index}`}
          value={record.customer_id?.toString() ?? ''}
          onChange={(e) => onChange('customer_id', e.target.value || null)}
          disabled={disabled}
          className={error?.customer_id ? 'border-destructive' : ''}
        >
          <option value="">選択してください</option>
          {customers.map((customer) => (
            <option
              key={customer.customer_id}
              value={customer.customer_id}
              disabled={
                selectedCustomerIds.includes(customer.customer_id) &&
                record.customer_id !== customer.customer_id
              }
            >
              {customer.company_name} - {customer.customer_name}
              {customer.department && ` (${customer.department})`}
            </option>
          ))}
        </Select>
        {error?.customer_id && (
          <p className="text-sm text-destructive">{error.customer_id}</p>
        )}
      </div>

      {/* 訪問内容 */}
      <div className="space-y-2">
        <Label htmlFor={`content-${index}`}>訪問内容 *</Label>
        <Textarea
          id={`content-${index}`}
          value={record.visit_content}
          onChange={(e) => onChange('visit_content', e.target.value)}
          placeholder="訪問内容を入力してください"
          disabled={disabled}
          rows={4}
          maxLength={500}
          className={error?.visit_content ? 'border-destructive' : ''}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {error?.visit_content ? (
            <p className="text-destructive">{error.visit_content}</p>
          ) : (
            <span />
          )}
          <span>{record.visit_content.length}/500</span>
        </div>
      </div>
    </div>
  );
}
