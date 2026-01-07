/**
 * バリデーションミドルウェア
 *
 * Zodスキーマを使用してリクエストボディをバリデーションします。
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/AuthError';

/**
 * リクエストボディをバリデーションするミドルウェアを生成
 *
 * @param schema - Zodバリデーションスキーマ
 * @returns Expressミドルウェア関数
 *
 * @example
 * ```typescript
 * import { loginSchema } from '../validators/auth.schemas';
 * router.post('/login', validate(loginSchema), login);
 * ```
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // リクエストボディをバリデーション
      const validated = schema.parse(req.body);

      // バリデーション済みのデータでreq.bodyを置き換え
      req.body = validated;

      // 次のミドルウェアへ
      next();
    } catch (error) {
      // Zodのバリデーションエラーの場合
      if (error instanceof ZodError) {
        // 最初のエラーメッセージを取得
        const firstError = error.errors[0];
        const message = firstError.message;

        // ValidationErrorとしてスロー（グローバルエラーハンドラーで処理）
        next(new ValidationError(message));
        return;
      }

      // その他のエラーはそのまま次のエラーハンドラーへ
      next(error);
    }
  };
};
