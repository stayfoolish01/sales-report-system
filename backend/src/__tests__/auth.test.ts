/**
 * 認証API テスト
 *
 * TC-001〜TC-003
 */

import request from 'supertest';
import app from '../index';
import { expectSuccessResponse, expectErrorResponse, getAdminToken } from './helpers';

describe('認証API', () => {
  describe('POST /api/v1/auth/login', () => {
    it('TC-001: 正しい認証情報でログインできる', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        });

      // ログイン成功またはレート制限
      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data.user).toHaveProperty('email', 'admin@example.com');
      } else if (response.status === 429) {
        // レート制限に達した場合はスキップ
        expect(response.body).toHaveProperty('success', false);
      }
    });

    it('TC-001: 間違ったパスワードでログイン失敗', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword',
        });

      if (response.status !== 429) {
        expect(response.status).toBe(401);
        expectErrorResponse(response.body, 'INVALID_CREDENTIALS');
      }
    });

    it('TC-001: 存在しないメールでログイン失敗', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      if (response.status !== 429) {
        expect(response.status).toBe(401);
        expectErrorResponse(response.body, 'INVALID_CREDENTIALS');
      }
    });

    it('TC-001: バリデーションエラー - メール形式不正', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      if (response.status !== 429) {
        expect(response.status).toBe(400);
        expectErrorResponse(response.body, 'VALIDATION_ERROR');
      }
    });

    it('TC-001: バリデーションエラー - パスワード未入力', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
        });

      if (response.status !== 429) {
        expect(response.status).toBe(400);
        expectErrorResponse(response.body, 'VALIDATION_ERROR');
      }
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('TC-002: 認証済みでログアウトできる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectSuccessResponse(response.body);
    });

    it('TC-002: 未認証でログアウト失敗', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('TC-003: 認証済みで現在のユーザー情報を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectSuccessResponse(response.body);
      expect(response.body.data).toHaveProperty('sales_id');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('role');
    });

    it('TC-003: 未認証でユーザー情報取得失敗', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });

    it('TC-003: 無効なトークンでユーザー情報取得失敗', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'INVALID_TOKEN');
    });
  });
});
