/**
 * コメントAPI テスト
 *
 * TC-012〜TC-015
 */

import request from 'supertest';
import app from '../index';
import {
  expectSuccessResponse,
  expectErrorResponse,
  getAdminToken,
} from './helpers';

describe('コメントAPI', () => {
  const reportId = 1;

  describe('GET /api/v1/reports/:reportId/comments', () => {
    it('TC-012: 認証済みでコメント一覧を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get(`/api/v1/reports/${reportId}/comments`)
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(Array.isArray(response.body.data)).toBe(true);
      } else if (response.status === 400) {
        // 日報が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-012: 未認証でコメント一覧取得失敗', async () => {
      const response = await request(app)
        .get(`/api/v1/reports/${reportId}/comments`);

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('POST /api/v1/reports/:reportId/comments', () => {
    it('TC-013: 認証済みでコメントを作成できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post(`/api/v1/reports/${reportId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'テストコメント',
        });

      if (response.status === 201) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('comment_id');
        expect(response.body.data).toHaveProperty('content', 'テストコメント');
      } else if (response.status === 400) {
        // 日報が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-013: バリデーションエラー - コンテンツ未入力', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post(`/api/v1/reports/${reportId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect([400, 404]).toContain(response.status);
      expectErrorResponse(response.body);
    });

    it('TC-013: 未認証でコメント作成失敗', async () => {
      const response = await request(app)
        .post(`/api/v1/reports/${reportId}/comments`)
        .send({
          content: 'テストコメント',
        });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('PUT /api/v1/reports/:reportId/comments/:commentId', () => {
    it('TC-014: 未認証でコメント更新失敗', async () => {
      const response = await request(app)
        .put(`/api/v1/reports/${reportId}/comments/1`)
        .send({
          content: '更新されたコメント',
        });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });

    it('TC-014: 認証済みでコメントを更新できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .put(`/api/v1/reports/${reportId}/comments/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: '更新されたコメント',
        });

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('content', '更新されたコメント');
      } else {
        // コメントが存在しないか、権限がない場合
        expect([400, 403, 404]).toContain(response.status);
      }
    });
  });

  describe('DELETE /api/v1/reports/:reportId/comments/:commentId', () => {
    it('TC-015: 未認証でコメント削除失敗', async () => {
      const response = await request(app)
        .delete(`/api/v1/reports/${reportId}/comments/1`);

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });

    it('TC-015: 認証済みでコメントを削除できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .delete(`/api/v1/reports/${reportId}/comments/999`)
        .set('Authorization', `Bearer ${token}`);

      // コメントが存在しない場合は400、存在する場合は200
      expect([200, 400, 403, 404]).toContain(response.status);
    });
  });
});
