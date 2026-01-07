'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { LoadingOverlay } from '@/components/Loading';
import { FormError } from '@/components/ErrorMessage';
import type { CustomerFormData, CustomerDetail } from '@/lib/types/customer';

interface CustomerFormProps {
  initialData?: CustomerDetail;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  customer_code?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
}

export function CustomerForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CustomerFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<CustomerFormData>({
    customer_code: initialData?.customer_code || '',
    customer_name: initialData?.customer_name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    contact_person: initialData?.contact_person || '',
    notes: initialData?.notes || '',
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 顧客コード
    if (!formData.customer_code.trim()) {
      newErrors.customer_code = '顧客コードを入力してください';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.customer_code)) {
      newErrors.customer_code = '顧客コードは英数字、ハイフン、アンダースコアのみ使用できます';
    } else if (formData.customer_code.length > 20) {
      newErrors.customer_code = '顧客コードは20文字以内で入力してください';
    }

    // 顧客名
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = '顧客名を入力してください';
    } else if (formData.customer_name.length > 100) {
      newErrors.customer_name = '顧客名は100文字以内で入力してください';
    }

    // メールアドレス（任意だが、入力された場合は検証）
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // 電話番号（任意だが、入力された場合は検証）
    if (formData.phone && !/^[0-9-+() ]+$/.test(formData.phone)) {
      newErrors.phone = '有効な電話番号を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.value === 'true' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
      router.push('/customers');
    } catch (error) {
      console.error('Failed to save customer:', error);
      setSubmitError('顧客情報の保存に失敗しました。しばらく時間をおいて再度お試しください。');
    }
  };

  const handleCancel = () => {
    router.push('/customers');
  };

  return (
    <LoadingOverlay isLoading={isLoading} text="保存中...">
      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        {/* 基本情報 */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">基本情報</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customer_code">
                顧客コード <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer_code"
                name="customer_code"
                value={formData.customer_code}
                onChange={handleChange}
                placeholder="例: C001"
                disabled={isEditMode}
                className={errors.customer_code ? 'border-destructive' : ''}
              />
              {errors.customer_code && <FormError message={errors.customer_code} />}
              {isEditMode && (
                <p className="text-xs text-muted-foreground">
                  顧客コードは変更できません
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_name">
                顧客名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="例: 株式会社ABC"
                className={errors.customer_name ? 'border-destructive' : ''}
              />
              {errors.customer_name && <FormError message={errors.customer_name} />}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="例: 東京都千代田区丸の内1-1-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="例: 03-1234-5678"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && <FormError message={errors.phone} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="例: info@example.co.jp"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <FormError message={errors.email} />}
            </div>
          </div>
        </div>

        {/* 追加情報 */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">追加情報</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_person">担当者名</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="例: 山田太郎"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">状態</Label>
              <Select
                id="is_active"
                value={formData.is_active.toString()}
                onChange={handleStatusChange}
              >
                <option value="true">有効</option>
                <option value="false">無効</option>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="顧客に関するメモを入力..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isEditMode ? '更新' : '登録'}
          </Button>
        </div>
      </form>
    </LoadingOverlay>
  );
}
