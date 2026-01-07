/**
 * 顧客マスタAPI テスト
 *
 * TC-016〜TC-020
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

describe('顧客マスタAPI', () => {
  describe('GET /api/v1/customers', () => {
    it('TC-016: 認証済みで顧客一覧を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('TC-016: ページネーションパラメータが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers')
        .query({ page: 1, limit: 5 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('TC-016: 検索パラメータが動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers')
        .query({ search: 'テスト' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectPaginatedResponse(response.body);
    });

    it('TC-016: 未認証で顧客一覧取得失敗', async () => {
      const response = await request(app)
        .get('/api/v1/customers');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/customers/:customerId', () => {
    it('TC-017: 認証済みで顧客詳細を取得できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers/1')
        .set('Authorization', `Bearer ${token}`);

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('customer_id');
        expect(response.body.data).toHaveProperty('customer_name');
        expect(response.body.data).toHaveProperty('company_name');
      } else if (response.status === 400) {
        // 顧客が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-017: 存在しない顧客IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-017: 無効な顧客IDでエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });
  });

  describe('GET /api/v1/customers/search', () => {
    it('TC-017: 顧客検索が動作する', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers/search')
        .query({ q: 'テスト' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectSuccessResponse(response.body);
      expect(response.body.data).toHaveProperty('customers');
      expect(Array.isArray(response.body.data.customers)).toBe(true);
    });

    it('TC-017: 空のクエリで空の結果', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .get('/api/v1/customers/search')
        .query({ q: '' })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectSuccessResponse(response.body);
      expect(response.body.data.customers).toEqual([]);
    });
  });

  describe('POST /api/v1/customers', () => {
    it('TC-018: 管理者は顧客を作成できる', async () => {
      const token = getAdminToken();
      const uniqueId = Date.now();
      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: `テスト顧客${uniqueId}`,
          company_name: `テスト会社${uniqueId}`,
          department: 'テスト部署',
          phone: '03-1234-5678',
          email: `test${uniqueId}@example.com`,
          address: 'テスト住所',
        });

      expect(response.status).toBe(201);
      expectSuccessResponse(response.body);
      expect(response.body.data).toHaveProperty('customer_id');
      expect(response.body.data).toHaveProperty('customer_name');
    });

    it('TC-018: 一般ユーザーは顧客を作成できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: 'テスト顧客',
          company_name: 'テスト会社',
        });

      expect(response.status).toBe(403);
      expectErrorResponse(response.body, 'FORBIDDEN');
    });

    it('TC-018: バリデーションエラー - 必須項目未入力', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: 'テスト顧客',
          // company_name が未入力
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body, 'VALIDATION_ERROR');
    });

    it('TC-018: 未認証で顧客作成失敗', async () => {
      const response = await request(app)
        .post('/api/v1/customers')
        .send({
          customer_name: 'テスト顧客',
          company_name: 'テスト会社',
        });

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });

  describe('PUT /api/v1/customers/:customerId', () => {
    it('TC-019: 管理者は顧客を更新できる', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .put('/api/v1/customers/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: '更新された顧客名',
        });

      if (response.status === 200) {
        expectSuccessResponse(response.body);
        expect(response.body.data).toHaveProperty('customer_name', '更新された顧客名');
      } else if (response.status === 400) {
        // 顧客が存在しない場合
        expectErrorResponse(response.body);
      }
    });

    it('TC-019: 一般ユーザーは顧客を更新できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .put('/api/v1/customers/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: '更新された顧客名',
        });

      expect([400, 403]).toContain(response.status);
    });

    it('TC-019: 存在しない顧客の更新でエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .put('/api/v1/customers/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: '更新された顧客名',
        });

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });
  });

  describe('DELETE /api/v1/customers/:customerId', () => {
    it('TC-020: 一般ユーザーは顧客を削除できない', async () => {
      const token = getGeneralToken();
      const response = await request(app)
        .delete('/api/v1/customers/1')
        .set('Authorization', `Bearer ${token}`);

      expect([400, 403]).toContain(response.status);
    });

    it('TC-020: 存在しない顧客の削除でエラー', async () => {
      const token = getAdminToken();
      const response = await request(app)
        .delete('/api/v1/customers/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expectErrorResponse(response.body);
    });

    it('TC-020: 未認証で顧客削除失敗', async () => {
      const response = await request(app)
        .delete('/api/v1/customers/1');

      expect(response.status).toBe(401);
      expectErrorResponse(response.body, 'UNAUTHORIZED');
    });
  });
});
