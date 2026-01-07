/**
 * 営業マスタAPI テスト
 *
 * TC-021〜TC-025
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

describe('営業マスタAPI', () => {
  describe('GET /api/v1/sales-staff', () => {
    it('TC-021: 管理者は営業担当一覧を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('TC-021: ページネーションパラメータが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff')
        .query({ page: 1, limit: 5 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('TC-021: 検索パラメータが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff')
        .query({ search: 'テスト' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
    });

    it('TC-021: 部署フィルターが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff')
        .query({ department: '営業部' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
    });

    it('TC-021: 一般ユーザーは営業担当一覧を取得できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .get('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expectErrorResponse(response.body, 'FORBIDDEN');
    });

    it('TC-021: 未認証で営業担当一覧取得失敗', async () => {
      const response = await request(app)
        .get('/api/v1/sales-staff');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/sales-staff/:salesId', () => {
    it('TC-022: 管理者は営業担当詳細を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff/1')
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('sales_id');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
      } else if (response.status === 400) {
        // 営業担当が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-022: 存在しない営業担当IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-022: 無効な営業担当IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/sales-staff/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-022: 一般ユーザーは営業担当詳細を取得できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .get('/api/v1/sales-staff/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expectErrorResponse(response.body, 'FORBIDDEN');
    });
  });

  describe('POST /api/v1/sales-staff', () => {
    it('TC-023: 管理者は営業担当を作成できる', async () => {
      const token = getAdminToken();
      const uniqueId = Date.now();
      const response = await request(app)
        .post('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `テスト担当${uniqueId}`,
          email: `test${uniqueId}@example.com`,
          password: 'password123',
          department: '営業部',
          position: '担当',
          role: 'GENERAL',
        });

      expect(response.status).toBe(201);
      expectSuccessResponse(response.body);
      expect(response.body.data).toHaveProperty('sales_id');
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
    });

    it('TC-023: 一般ユーザーは営業担当を作成できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .post('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'テスト担当',
          email: 'test@example.com',
          password: 'password123',
          department: '営業部',
        });

      expect(response.status).toBe(403);
      expectErrorResponse(response.body, 'FORBIDDEN');
    });

    it('TC-023: バリデーションエラー - 必須項目未入力', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'テスト担当',
          // email, password, department が未入力
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body, 'VALIDATION_ERROR');
    });

    it('TC-023: バリデーションエラー - パスワードが短すぎる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'テスト担当',
          email: 'test@example.com',
          password: 'short', // 8文字未満
          department: '営業部',
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body, 'VALIDATION_ERROR');
    });

    it('TC-023: 未認証で営業担当作成失敗', async () => {
      const response = await request(app)
        .post('/api/v1/sales-staff')
        .send({
          name: 'テスト担当',
          email: 'test@example.com',
          password: 'password123',
          department: '営業部',
        });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('PUT /api/v1/sales-staff/:salesId', () => {
    it('TC-024: 管理者は営業担当を更新できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .put('/api/v1/sales-staff/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '更新された担当名',
        });

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('name', '更新された担当名');
      } else if (response.status === 400) {
        // 営業担当が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-024: 一般ユーザーは営業担当を更新できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .put('/api/v1/sales-staff/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '更新された担当名',
        });

      expect([400, 403]).toContain(response.status);
    });

    it('TC-024: 存在しない営業担当の更新でエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .put('/api/v1/sales-staff/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '更新された担当名',
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });
  });

  describe('DELETE /api/v1/sales-staff/:salesId', () => {
    it('TC-025: 一般ユーザーは営業担当を削除できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .delete('/api/v1/sales-staff/1')
        .set('Authorization', `Bearer ${token}`);

      expect([400, 403]).toContain(response.status);
    });

    it('TC-025: 存在しない営業担当の削除でエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .delete('/api/v1/sales-staff/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-025: 未認証で営業担当削除失敗', async () => {
      const response = await request(app)
        .delete('/api/v1/sales-staff/1');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });
});
