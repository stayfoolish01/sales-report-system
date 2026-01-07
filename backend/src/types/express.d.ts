/**
 * Express Request型の拡張
 *
 * req.userにJWTペイロード情報を追加
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        salesId: number;
        email: string;
        role: 'GENERAL' | 'ADMIN';
      };
    }
  }
}
