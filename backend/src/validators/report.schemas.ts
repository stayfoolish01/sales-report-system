/**
 * 日報関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストボディのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * 訪問記録のバリデーションスキーマ
 */
const visitSchema = z.object({
  customer_id: z.number({
    required_error: '顧客IDは必須です',
    invalid_type_error: '顧客IDは数値である必要があります',
  }),
  content: z
    .string({
      invalid_type_error: '訪問内容は文字列である必要があります',
    })
    .max(10000, {
      message: '訪問内容は10000文字以内で入力してください',
    })
    .optional()
    .default(''),
});

/**
 * 日報作成リクエストのバリデーションスキーマ
 *
 * POST /api/v1/reports
 */
export const createReportSchema = z.object({
  report_date: z
    .string({
      required_error: '日報日付は必須です',
      invalid_type_error: '日報日付は文字列である必要があります',
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '日報日付はYYYY-MM-DD形式で入力してください',
    }),
  problem: z
    .string({
      invalid_type_error: '課題・相談は文字列である必要があります',
    })
    .max(10000, {
      message: '課題・相談は10000文字以内で入力してください',
    })
    .optional()
    .nullable(),
  plan: z
    .string({
      invalid_type_error: '明日の予定は文字列である必要があります',
    })
    .max(10000, {
      message: '明日の予定は10000文字以内で入力してください',
    })
    .optional()
    .nullable(),
  status: z
    .enum(['DRAFT', 'SUBMITTED'], {
      invalid_type_error: 'ステータスはDRAFTまたはSUBMITTEDである必要があります',
    })
    .optional()
    .default('DRAFT'),
  visits: z.array(visitSchema).optional(),
});

/**
 * 日報更新リクエストのバリデーションスキーマ
 *
 * PUT /api/v1/reports/:id
 */
export const updateReportSchema = z.object({
  problem: z
    .string({
      invalid_type_error: '課題・相談は文字列である必要があります',
    })
    .max(10000, {
      message: '課題・相談は10000文字以内で入力してください',
    })
    .optional()
    .nullable(),
  plan: z
    .string({
      invalid_type_error: '明日の予定は文字列である必要があります',
    })
    .max(10000, {
      message: '明日の予定は10000文字以内で入力してください',
    })
    .optional()
    .nullable(),
  status: z
    .enum(['DRAFT', 'SUBMITTED'], {
      invalid_type_error: 'ステータスはDRAFTまたはSUBMITTEDである必要があります',
    })
    .optional(),
});

/**
 * 日報一覧取得クエリのバリデーションスキーマ
 *
 * GET /api/v1/reports
 */
export const listReportsQuerySchema = z.object({
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
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '開始日はYYYY-MM-DD形式で入力してください',
    })
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: '終了日はYYYY-MM-DD形式で入力してください',
    })
    .optional(),
  status: z
    .enum(['DRAFT', 'SUBMITTED'], {
      invalid_type_error: 'ステータスはDRAFTまたはSUBMITTEDである必要があります',
    })
    .optional(),
});

/**
 * 日報ステータス更新リクエストのバリデーションスキーマ
 *
 * PATCH /api/v1/reports/:id/status
 */
export const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SUBMITTED'], {
    required_error: 'ステータスは必須です',
    invalid_type_error: 'ステータスはDRAFTまたはSUBMITTEDである必要があります',
  }),
});

/**
 * 型定義
 */
export type CreateReportRequest = z.infer<typeof createReportSchema>;
export type UpdateReportRequest = z.infer<typeof updateReportSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
export type UpdateStatusRequest = z.infer<typeof updateStatusSchema>;