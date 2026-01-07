/**
 * 認証API ルート
 *
 * 認証関連のエンドポイントを定義
 */

import { Router } from 'express';
import { login } from '../controllers/auth';

const router = Router();

/**
 * POST /api/v1/auth/login
 * ログイン
 */
router.post('/login', login);

export default router;
