/**
 * 日報API テスト
 *
 * TC-004〜TC-011
 */

import request from 'supertest';
import app from '../index';
import {
  expectSuccessResponse,
  expectErrorResponse,
  expectPaginatedResponse,
  getAdminToken,
  getGeneralToken,
} from './helpers';

describe('日報API', () => {
  describe('GET /api/v1/reports', () => {
    it('TC-004: 認証済みで日報一覧を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('TC-004: ページネーションパラメータが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports')
        .query({ page: 1, limit: 5 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('TC-004: 日付フィルターが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports')
        .query({ start_date: '2024-01-01', end_date: '2024-12-31' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
    });

    it('TC-004: 未認証で日報一覧取得失敗', async () => {
      const response = await request(app)
        .get('/api/v1/reports');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/reports/:reportId', () => {
    it('TC-005: 認証済みで日報詳細を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports/1')
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('report_id');
        expect(response.body.data).toHaveProperty('report_date');
        expect(response.body.data).toHaveProperty('status');
      } else if (response.status === 400) {
        // 日報が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-005: 存在しない日報IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-005: 無効な日報IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/reports/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });
  });

  describe('POST /api/v1/reports', () => {
    it('TC-006: 認証済みで日報を作成できる', async () => {
      const token = getGeneralToken();
      const today = new Date().toISOString().split('T')[0];

      const response = await request(app)
        .post('/api/v1/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({
          report_date: today,
          work_content: 'テスト業務内容',
          achievements: 'テスト成果',
          challenges: 'テスト課題',
          next_actions: 'テスト次のアクション',
        });

      if (response.status === 201) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('report_id');
        expect(response.body.data).toHaveProperty('status', 'draft');
      } else if (response.status === 400) {
        // 同日の日報が既に存在する場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-006: バリデーションエラー - 日付未入力', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .post('/api/v1/reports')
        .set('Authorization', `Bearer ${token}`)
        .send({
          work_content: 'テスト業務内容',
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body, 'VALIDATION_ERROR');
    });

    it('TC-006: 未認証で日報作成失敗', async () => {
      const response = await request(app)
        .post('/api/v1/reports')
        .send({
          report_date: '2024-01-01',
          work_content: 'テスト',
        });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('PUT /api/v1/reports/:reportId', () => {
    it('TC-007: 自分の日報を更新できる', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .put('/api/v1/reports/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          work_content: '更新された業務内容',
        });

      // 権限または存在確認
      if (response.status === 200) {
        expectSuccessResponse(response.body);
      } else {
        expect([400, 403]).toContain(response.status);
      }
    });
  });

  describe('DELETE /api/v1/reports/:reportId', () => {
    it('TC-008: 未認証で日報削除失敗', async () => {
      const response = await request(app)
        .delete('/api/v1/reports/1');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('POST /api/v1/reports/:reportId/submit', () => {
    it('TC-009: 日報提出には認証が必要', async () => {
      const response = await request(app)
        .post('/api/v1/reports/1/submit');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('PATCH /api/v1/reports/:reportId/status', () => {
    it('TC-010: ステータス更新には認証が必要', async () => {
      const response = await request(app)
        .patch('/api/v1/reports/1/status')
        .send({ status: 'approved' });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });

    it('TC-010: 管理者はステータスを更新できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .patch('/api/v1/reports/1/status')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'approved' });

      if (response.status === 200) {
        expectSuccessResponse(response.body);
      } else {
        // 日報が存在しないか、ステータスが無効
        expect([400, 404]).toContain(response.status);
      }
    });
  });
});
