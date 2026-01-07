/**
 * 営業担当関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * 営業担当一覧取得クエリのバリデーションスキーマ
 *
 * GET /api/v1/sales-staff
 */
export const listSalesStaffQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, {
      message: 'ページ番号は1以上である必要があります',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 100, {
      message: '1ページあたりの件数は1〜100の範囲で指定してください',
    }),
  search: z
    .string()
    .max(100, {
      message: '検索キーワードは100文字以内で入力してください',
    })
    .optional(),
  department: z
    .string()
    .max(50, {
      message: '部署名は50文字以内で入力してください',
    })
    .optional(),
  role: z
    .enum(['GENERAL', 'ADMIN'], {
      invalid_type_error: '権限はGENERALまたはADMINである必要があります',
    })
    .optional(),
});

/**
 * 営業担当作成リクエストのバリデーションスキーマ
 *
 * POST /api/v1/sales-staff
 */
export const createSalesStaffSchema = z.object({
  name: z
    .string({
      required_error: '名前は必須です',
      invalid_type_error: '名前は文字列である必要があります',
    })
    .min(1, {
      message: '名前を入力してください',
    })
    .max(50, {
      message: '名前は50文字以内で入力してください',
    }),
  email: z
    .string({
      required_error: 'メールアドレスは必須です',
      invalid_type_error: 'メールアドレスは文字列である必要があります',
    })
    .email({
      message: '有効なメールアドレスを入力してください',
    })
    .max(255, {
      message: 'メールアドレスは255文字以内で入力してください',
    }),
  password: z
    .string({
      required_error: 'パスワードは必須です',
      invalid_type_error: 'パスワードは文字列である必要があります',
    })
    .min(8, {
      message: 'パスワードは8文字以上で入力してください',
    })
    .max(100, {
      message: 'パスワードは100文字以内で入力してください',
    }),
  department: z
    .string({
      required_error: '部署は必須です',
      invalid_type_error: '部署は文字列である必要があります',
    })
    .min(1, {
      message: '部署を入力してください',
    })
    .max(50, {
      message: '部署は50文字以内で入力してください',
    }),
  position: z
    .string({
      invalid_type_error: '役職は文字列である必要があります',
    })
    .max(50, {
      message: '役職は50文字以内で入力してください',
    })
    .optional()
    .nullable(),
  manager_id: z
    .number({
      invalid_type_error: '上長IDは数値である必要があります',
    })
    .int({
      message: '上長IDは整数である必要があります',
    })
    .positive({
      message: '上長IDは正の数である必要があります',
    })
    .optional()
    .nullable(),
  role: z
    .enum(['GENERAL', 'ADMIN'], {
      invalid_type_error: '権限はGENERALまたはADMINである必要があります',
    })
    .optional()
    .default('GENERAL'),
});

/**
 * 営業担当更新リクエストのバリデーションスキーマ
 *
 * PUT /api/v1/sales-staff/:salesId
 */
export const updateSalesStaffSchema = z.object({
  name: z
    .string({
      invalid_type_error: '名前は文字列である必要があります',
    })
    .min(1, {
      message: '名前を入力してください',
    })
    .max(50, {
      message: '名前は50文字以内で入力してください',
    })
    .optional(),
  email: z
    .string({
      invalid_type_error: 'メールアドレスは文字列である必要があります',
    })
    .email({
      message: '有効なメールアドレスを入力してください',
    })
    .max(255, {
      message: 'メールアドレスは255文字以内で入力してください',
    })
    .optional(),
  password: z
    .string({
      invalid_type_error: 'パスワードは文字列である必要があります',
    })
    .min(8, {
      message: 'パスワードは8文字以上で入力してください',
    })
    .max(100, {
      message: 'パスワードは100文字以内で入力してください',
    })
    .optional(),
  department: z
    .string({
      invalid_type_error: '部署は文字列である必要があります',
    })
    .min(1, {
      message: '部署を入力してください',
    })
    .max(50, {
      message: '部署は50文字以内で入力してください',
    })
    .optional(),
  position: z
    .string({
      invalid_type_error: '役職は文字列である必要があります',
    })
    .max(50, {
      message: '役職は50文字以内で入力してください',
    })
    .optional()
    .nullable(),
  manager_id: z
    .number({
      invalid_type_error: '上長IDは数値である必要があります',
    })
    .int({
      message: '上長IDは整数である必要があります',
    })
    .positive({
      message: '上長IDは正の数である必要があります',
    })
    .optional()
    .nullable(),
  role: z
    .enum(['GENERAL', 'ADMIN'], {
      invalid_type_error: '権限はGENERALまたはADMINである必要があります',
    })
    .optional(),
});

/**
 * 型定義
 */
export type ListSalesStaffQuery = z.infer<typeof listSalesStaffQuerySchema>;
export type CreateSalesStaffRequest = z.infer<typeof createSalesStaffSchema>;
export type UpdateSalesStaffRequest = z.infer<typeof updateSalesStaffSchema>;
