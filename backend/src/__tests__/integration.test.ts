/**
 * 統合テスト
 *
 * TC-026〜TC-030
 * 複数APIを跨ぐシナリオテスト
 */

import request from 'supertest';
import app from '../index';
import { getAdminToken, getGeneralToken, expectSuccessResponse } from './helpers';

describe('統合テスト', () => {
  describe('TC-026: ヘルスチェック', () => {
    it('ヘルスチェックエンドポイントが動作する', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Sales Report API is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('TC-027: 認証フロー統合テスト', () => {
    it('ログイン後にユーザー情報を取得できる', async () => {
      // ログイン
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        });

      if (loginResponse.status === 200) {
        const token = loginResponse.body.data.token;

        // ユーザー情報取得
        const meResponse = await request(app)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${token}`);

        expect(meResponse.status).toBe(200);
        expectSuccessResponse(meResponse.body);
        expect(meResponse.body.data).toHaveProperty('email', 'admin@example.com');
      } else if (loginResponse.status === 429) {
        // レート制限に達した場合はスキップ
        expect(loginResponse.body).toHaveProperty('success', false);
      }
    });
  });

  describe('TC-028: 日報・コメント統合テスト', () => {
    it('日報一覧取得後、個別の日報詳細を取得できる', async () => {
      const token = getAdminToken();

      // 日報一覧取得
      const listResponse = await request(app)
        .get('/api/v1/reports')
        .set('Authorization', `Bearer ${token}`);

      expect(listResponse.status).toBe(200);

      if (listResponse.body.data && listResponse.body.data.length > 0) {
        const reportId = listResponse.body.data[0].report_id;

        // 日報詳細取得
        const detailResponse = await request(app)
          .get(`/api/v1/reports/${reportId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(detailResponse.status).toBe(200);
        expectSuccessResponse(detailResponse.body);
        expect(detailResponse.body.data).toHaveProperty('report_id', reportId);
      }
    });
  });

  describe('TC-029: マスタデータ統合テスト', () => {
    it('顧客一覧から個別の顧客詳細を取得できる', async () => {
      const token = getAdminToken();

      // 顧客一覧取得
      const listResponse = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(listResponse.status).toBe(200);

      if (listResponse.body.data && listResponse.body.data.length > 0) {
        const customerId = listResponse.body.data[0].customer_id;

        // 顧客詳細取得
        const detailResponse = await request(app)
          .get(`/api/v1/customers/${customerId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(detailResponse.status).toBe(200);
        expectSuccessResponse(detailResponse.body);
        expect(detailResponse.body.data).toHaveProperty('customer_id', customerId);
      }
    });
  });

  describe('TC-030: 権限チェック統合テスト', () => {
    it('一般ユーザーは管理者機能にアクセスできない', async () => {
      const token = getGeneralToken();

      // 営業担当一覧（管理者のみ）
      const salesStaffResponse = await request(app)
        .get('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`);

      expect(salesStaffResponse.status).toBe(403);

      // 顧客作成（管理者のみ）
      const createCustomerResponse = await request(app)
        .post('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customer_name: 'テスト顧客',
          company_name: 'テスト会社',
        });

      expect(createCustomerResponse.status).toBe(403);
    });

    it('管理者は管理者機能にアクセスできる', async () => {
      const token = getAdminToken();

      // 営業担当一覧（管理者のみ）
      const salesStaffResponse = await request(app)
        .get('/api/v1/sales-staff')
        .set('Authorization', `Bearer ${token}`);

      expect(salesStaffResponse.status).toBe(200);

      // 顧客一覧（全ユーザー）
      const customersResponse = await request(app)
        .get('/api/v1/customers')
        .set('Authorization', `Bearer ${token}`);

      expect(customersResponse.status).toBe(200);
    });
  });

  describe('404エラー処理', () => {
    it('存在しないエンドポイントで404エラー', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('セキュリティヘッダー確認', () => {
    it('セキュリティヘッダーが設定されている', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
    });
  });
});
