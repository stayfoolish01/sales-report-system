/**
 * 顧客マスタ関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * 顧客一覧取得クエリのバリデーションスキーマ
 *
 * GET /api/v1/customers
 */
export const listCustomersQuerySchema = z.object({
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
});

/**
 * 顧客作成リクエストのバリデーションスキーマ
 *
 * POST /api/v1/customers
 */
export const createCustomerSchema = z.object({
  customer_name: z
    .string({
      required_error: '顧客名は必須です',
      invalid_type_error: '顧客名は文字列である必要があります',
    })
    .min(1, {
      message: '顧客名を入力してください',
    })
    .max(50, {
      message: '顧客名は50文字以内で入力してください',
    }),
  company_name: z
    .string({
      required_error: '会社名は必須です',
      invalid_type_error: '会社名は文字列である必要があります',
    })
    .min(1, {
      message: '会社名を入力してください',
    })
    .max(100, {
      message: '会社名は100文字以内で入力してください',
    }),
  department: z
    .string({
      invalid_type_error: '部署名は文字列である必要があります',
    })
    .max(50, {
      message: '部署名は50文字以内で入力してください',
    })
    .optional()
    .nullable(),
  phone: z
    .string({
      invalid_type_error: '電話番号は文字列である必要があります',
    })
    .max(20, {
      message: '電話番号は20文字以内で入力してください',
    })
    .optional()
    .nullable(),
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
    .optional()
    .nullable(),
  address: z
    .string({
      invalid_type_error: '住所は文字列である必要があります',
    })
    .max(500, {
      message: '住所は500文字以内で入力してください',
    })
    .optional()
    .nullable(),
});

/**
 * 顧客更新リクエストのバリデーションスキーマ
 *
 * PUT /api/v1/customers/:customerId
 */
export const updateCustomerSchema = z.object({
  customer_name: z
    .string({
      invalid_type_error: '顧客名は文字列である必要があります',
    })
    .min(1, {
      message: '顧客名を入力してください',
    })
    .max(50, {
      message: '顧客名は50文字以内で入力してください',
    })
    .optional(),
  company_name: z
    .string({
      invalid_type_error: '会社名は文字列である必要があります',
    })
    .min(1, {
      message: '会社名を入力してください',
    })
    .max(100, {
      message: '会社名は100文字以内で入力してください',
    })
    .optional(),
  department: z
    .string({
      invalid_type_error: '部署名は文字列である必要があります',
    })
    .max(50, {
      message: '部署名は50文字以内で入力してください',
    })
    .optional()
    .nullable(),
  phone: z
    .string({
      invalid_type_error: '電話番号は文字列である必要があります',
    })
    .max(20, {
      message: '電話番号は20文字以内で入力してください',
    })
    .optional()
    .nullable(),
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
    .optional()
    .nullable(),
  address: z
    .string({
      invalid_type_error: '住所は文字列である必要があります',
    })
    .max(500, {
      message: '住所は500文字以内で入力してください',
    })
    .optional()
    .nullable(),
});

/**
 * 型定義
 */
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
export type CreateCustomerRequest = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>;
