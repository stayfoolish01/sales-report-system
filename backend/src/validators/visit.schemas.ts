/**
 * 訪問記録関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストボディのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * 訪問記録作成リクエストのバリデーションスキーマ
 *
 * POST /api/v1/reports/:reportId/visits
 */
export const createVisitSchema = z.object({
  customer_id: z
    .number({
      required_error: '顧客IDは必須です',
      invalid_type_error: '顧客IDは数値である必要があります',
    })
    .int({
      message: '顧客IDは整数である必要があります',
    })
    .positive({
      message: '顧客IDは正の数である必要があります',
    }),
  visit_content: z
    .string({
      required_error: '訪問内容は必須です',
      invalid_type_error: '訪問内容は文字列である必要があります',
    })
    .min(1, {
      message: '訪問内容を入力してください',
    })
    .max(10000, {
      message: '訪問内容は10000文字以内で入力してください',
    }),
  visit_order: z
    .number({
      invalid_type_error: '訪問順は数値である必要があります',
    })
    .int({
      message: '訪問順は整数である必要があります',
    })
    .positive({
      message: '訪問順は正の数である必要があります',
    })
    .optional(),
});

/**
 * 訪問記録更新リクエストのバリデーションスキーマ
 *
 * PUT /api/v1/reports/:reportId/visits/:visitId
 */
export const updateVisitSchema = z.object({
  customer_id: z
    .number({
      invalid_type_error: '顧客IDは数値である必要があります',
    })
    .int({
      message: '顧客IDは整数である必要があります',
    })
    .positive({
      message: '顧客IDは正の数である必要があります',
    })
    .optional(),
  visit_content: z
    .string({
      invalid_type_error: '訪問内容は文字列である必要があります',
    })
    .min(1, {
      message: '訪問内容を入力してください',
    })
    .max(10000, {
      message: '訪問内容は10000文字以内で入力してください',
    })
    .optional(),
  visit_order: z
    .number({
      invalid_type_error: '訪問順は数値である必要があります',
    })
    .int({
      message: '訪問順は整数である必要があります',
    })
    .positive({
      message: '訪問順は正の数である必要があります',
    })
    .optional(),
});

/**
 * 型定義
 */
export type CreateVisitRequest = z.infer<typeof createVisitSchema>;
export type UpdateVisitRequest = z.infer<typeof updateVisitSchema>;
