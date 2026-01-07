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
 * 型定義
 */
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
