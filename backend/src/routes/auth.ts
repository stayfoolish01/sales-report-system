/**
 * 認証API ルート
 *
 * 認証関連のエンドポイントを定義
 */

import { Router } from 'express';
import { login, logout, me } from '../controllers/auth';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * POST /api/v1/auth/login
 * ログイン
 */
router.post('/login', login);

/**
 * POST /api/v1/auth/logout
 * ログアウト（認証必要）
 */
router.post('/logout', authenticate, logout);

/**
 * GET /api/v1/auth/me
 * 認証状態確認（現在のユーザー情報取得）
 */
router.get('/me', authenticate, me);

export default router;
