'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { LoadingOverlay } from '@/components/Loading';
import { FormError } from '@/components/ErrorMessage';
import type { SalesFormData, SalesDetail, SalesListItem } from '@/lib/types/sales';

interface SalesFormProps {
  initialData?: SalesDetail;
  managers: Pick<SalesListItem, 'sales_id' | 'name' | 'position'>[];
  onSubmit: (data: SalesFormData) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
  position?: string;
}

export function SalesForm({
  initialData,
  managers,
  onSubmit,
  isLoading = false,
}: SalesFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<SalesFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    department: initialData?.department || '営業部',
    position: initialData?.position || '',
    role: initialData?.role || 'general',
    manager_id: initialData?.manager?.sales_id || null,
    is_active: initialData?.is_active ?? true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 氏名
    if (!formData.name.trim()) {
      newErrors.name = '氏名を入力してください';
    } else if (formData.name.length > 50) {
      newErrors.name = '氏名は50文字以内で入力してください';
    }

    // メールアドレス
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // パスワード（新規の場合は必須）
    if (!isEditMode && !formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    // 部署
    if (!formData.department.trim()) {
      newErrors.department = '部署を入力してください';
    }

    // 役職
    if (!formData.position.trim()) {
      newErrors.position = '役職を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSubmitError(null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as 'admin' | 'general',
    }));
  };

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      manager_id: value ? parseInt(value, 10) : null,
    }));
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
      // 編集モードでパスワードが空の場合は除外
      const submitData = { ...formData };
      if (isEditMode && !submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
      router.push('/sales');
    } catch (error) {
      console.error('Failed to save sales:', error);
      setSubmitError('営業担当者情報の保存に失敗しました。しばらく時間をおいて再度お試しください。');
    }
  };

  const handleCancel = () => {
    router.push('/sales');
  };

  // 上長選択リストから自分自身と部下を除外
  const availableManagers = managers.filter((m) => {
    if (initialData) {
      // 自分自身は除外
      if (m.sales_id === initialData.sales_id) return false;
      // 自分の部下も除外（循環参照防止）
      if (initialData.subordinates?.some((s) => s.sales_id === m.sales_id)) {
        return false;
      }
    }
    return true;
  });

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
              <Label htmlFor="name">
                氏名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例: 山田太郎"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <FormError message={errors.name} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                メールアドレス <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="例: yamada@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <FormError message={errors.email} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                パスワード{' '}
                {!isEditMode && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? '変更する場合のみ入力' : '8文字以上'}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && <FormError message={errors.password} />}
              {isEditMode && (
                <p className="text-xs text-muted-foreground">
                  空欄の場合は変更されません
                </p>
              )}
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
          </div>
        </div>

        {/* 組織情報 */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">組織情報</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">
                部署 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="例: 営業部"
                className={errors.department ? 'border-destructive' : ''}
              />
              {errors.department && <FormError message={errors.department} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">
                役職 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="例: 課長"
                className={errors.position ? 'border-destructive' : ''}
              />
              {errors.position && <FormError message={errors.position} />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">権限</Label>
              <Select
                id="role"
                value={formData.role}
                onChange={handleRoleChange}
              >
                <option value="general">一般</option>
                <option value="admin">管理者</option>
              </Select>
              <p className="text-xs text-muted-foreground">
                管理者は全ユーザーの日報閲覧・マスタ管理が可能です
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager_id">上長</Label>
              <Select
                id="manager_id"
                value={formData.manager_id?.toString() || ''}
                onChange={handleManagerChange}
              >
                <option value="">なし</option>
                {availableManagers.map((manager) => (
                  <option key={manager.sales_id} value={manager.sales_id}>
                    {manager.name} ({manager.position})
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                上長は部下の日報を閲覧できます
              </p>
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
