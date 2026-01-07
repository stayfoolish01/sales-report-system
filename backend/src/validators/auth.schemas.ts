/**
 * 認証関連のバリデーションスキーマ
 *
 * Zodを使用してリクエストボディのバリデーションスキーマを定義します。
 */

import { z } from 'zod';

/**
 * ログインリクエストのバリデーションスキーマ
 *
 * POST /api/v1/auth/login
 */
export const loginSchema = z.object({
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
    .min(1, {
      message: 'パスワードを入力してください',
    })
    .max(255, {
      message: 'パスワードは255文字以内で入力してください',
    }),
});

/**
 * ログインリクエストの型定義
 */
export type LoginRequest = z.infer<typeof loginSchema>;
