'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Save, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/DateRangePicker';
import { VisitRecordInput, type VisitRecordFormData } from '@/components/VisitRecordInput';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingOverlay } from '@/components/Loading';
import type { Customer } from '@/lib/types/report';

export interface ReportFormData {
  report_date: string;
  visit_records: VisitRecordFormData[];
  problem: string;
  plan: string;
}

interface ReportFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ReportFormData>;
  customers: Customer[];
  onSubmit: (data: ReportFormData, isDraft: boolean) => Promise<void>;
  isLoading?: boolean;
}

const defaultFormData: ReportFormData = {
  report_date: format(new Date(), 'yyyy-MM-dd'),
  visit_records: [{ customer_id: null, visit_content: '' }],
  problem: '',
  plan: '',
};

export function ReportForm({
  mode,
  initialData,
  customers,
  onSubmit,
  isLoading = false,
}: ReportFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ReportFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<{
    report_date?: string;
    visit_records?: { [key: number]: { customer_id?: string; visit_content?: string } };
    problem?: string;
    plan?: string;
    general?: string;
  }>({});

  const title = mode === 'create' ? '日報作成' : '日報編集';

  // バリデーション
  const validate = (isDraft: boolean): boolean => {
    const newErrors: typeof errors = {};

    // 日付チェック
    if (!formData.report_date) {
      newErrors.report_date = '日付を選択してください';
    }

    // 提出時のみ訪問記録チェック
    if (!isDraft) {
      if (formData.visit_records.length === 0) {
        newErrors.general = '訪問記録を1件以上入力してください';
      } else {
        const visitErrors: { [key: number]: { customer_id?: string; visit_content?: string } } = {};
        formData.visit_records.forEach((record, index) => {
          const recordErrors: { customer_id?: string; visit_content?: string } = {};
          if (!record.customer_id) {
            recordErrors.customer_id = '顧客を選択してください';
          }
          if (!record.visit_content.trim()) {
            recordErrors.visit_content = '訪問内容を入力してください';
          }
          if (Object.keys(recordErrors).length > 0) {
            visitErrors[index] = recordErrors;
          }
        });
        if (Object.keys(visitErrors).length > 0) {
          newErrors.visit_records = visitErrors;
        }
      }
    }

    // 文字数チェック
    if (formData.problem && formData.problem.length > 1000) {
      newErrors.problem = '課題・相談は1000文字以内で入力してください';
    }
    if (formData.plan && formData.plan.length > 1000) {
      newErrors.plan = '明日の予定は1000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!validate(isDraft)) {
      return;
    }

    try {
      await onSubmit(formData, isDraft);
    } catch (error) {
      console.error('Failed to submit report:', error);
      setErrors({ general: '日報の保存に失敗しました' });
    }
  };

  const handleBack = () => {
    if (
      formData.visit_records.some((r) => r.customer_id || r.visit_content) ||
      formData.problem ||
      formData.plan
    ) {
      if (!confirm('入力内容が破棄されます。よろしいですか？')) {
        return;
      }
    }
    router.back();
  };

  const formattedDate = formData.report_date
    ? format(new Date(formData.report_date), 'yyyy年M月d日 (E)', { locale: ja })
    : '';

  return (
    <LoadingOverlay isLoading={isLoading} text="保存中...">
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {formattedDate && (
              <p className="text-muted-foreground">{formattedDate}</p>
            )}
          </div>
        </div>

        {/* エラーメッセージ */}
        {errors.general && (
          <ErrorMessage message={errors.general} variant="error" />
        )}

        {/* フォーム */}
        <div className="space-y-6">
          {/* 日付 */}
          <div className="rounded-lg border bg-card p-4">
            <div className="max-w-xs">
              <DatePicker
                value={formData.report_date}
                onChange={(date) =>
                  setFormData({ ...formData, report_date: date || '' })
                }
                label="日付 *"
                maxDate={new Date()}
              />
              {errors.report_date && (
                <p className="text-sm text-destructive mt-1">{errors.report_date}</p>
              )}
            </div>
          </div>

          {/* 訪問記録 */}
          <div className="rounded-lg border bg-card p-4">
            <VisitRecordInput
              records={formData.visit_records}
              customers={customers}
              onChange={(records) =>
                setFormData({ ...formData, visit_records: records })
              }
              disabled={isLoading}
              errors={errors.visit_records}
            />
          </div>

          {/* 課題・相談（Problem） */}
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <Label className="text-base font-semibold">
                  課題・相談（Problem）
                </Label>
              </div>
              <Textarea
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                placeholder="課題や相談事項があれば入力してください"
                disabled={isLoading}
                rows={4}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.problem ? (
                  <p className="text-destructive">{errors.problem}</p>
                ) : (
                  <span />
                )}
                <span>{formData.problem.length}/1000</span>
              </div>
            </div>
          </div>

          {/* 明日の予定（Plan） */}
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">明日の予定（Plan）</Label>
              <Textarea
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                placeholder="明日の予定を入力してください"
                disabled={isLoading}
                rows={4}
                maxLength={1000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.plan ? (
                  <p className="text-destructive">{errors.plan}</p>
                ) : (
                  <span />
                )}
                <span>{formData.plan.length}/1000</span>
              </div>
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            下書き保存
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            提出
          </Button>
        </div>
      </div>
    </LoadingOverlay>
  );
}
