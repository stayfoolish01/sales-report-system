/**
 * コメント関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストボディのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * コメント作成リクエストのバリデーションスキーマ
 *
 * POST /api/v1/reports/:reportId/comments
 */
export const createCommentSchema = z.object({
  comment_type: z.enum(['PROBLEM', 'PLAN'], {
    required_error: 'コメント種別は必須です',
    invalid_type_error: 'コメント種別はPROBLEMまたはPLANである必要があります',
  }),
  comment_content: z
    .string({
      required_error: 'コメント内容は必須です',
      invalid_type_error: 'コメント内容は文字列である必要があります',
    })
    .min(1, {
      message: 'コメント内容を入力してください',
    })
    .max(10000, {
      message: 'コメント内容は10000文字以内で入力してください',
    }),
});

/**
 * コメント更新リクエストのバリデーションスキーマ
 *
 * PUT /api/v1/reports/:reportId/comments/:id
 */
export const updateCommentSchema = z.object({
  comment_content: z
    .string({
      required_error: 'コメント内容は必須です',
      invalid_type_error: 'コメント内容は文字列である必要があります',
    })
    .min(1, {
      message: 'コメント内容を入力してください',
    })
    .max(10000, {
      message: 'コメント内容は10000文字以内で入力してください',
    }),
});

/**
 * コメント一覧取得クエリのバリデーションスキーマ
 *
 * GET /api/v1/reports/:reportId/comments
 */
export const listCommentsQuerySchema = z.object({
  comment_type: z
    .enum(['PROBLEM', 'PLAN'], {
      invalid_type_error: 'コメント種別はPROBLEMまたはPLANである必要があります',
    })
    .optional(),
});

/**
 * 型定義
 */
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
export type UpdateCommentRequest = z.infer<typeof updateCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
