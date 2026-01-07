/**
 * テストヘルパー関数
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

/**
 * テスト用のJWTトークンを生成
 */
export const generateTestToken = (payload: {
  salesId: number;
  email: string;
  role: 'GENERAL' | 'ADMIN';
}): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * テスト用の管理者トークン
 */
export const getAdminToken = (): string => {
  return generateTestToken({
    salesId: 1,
    email: 'admin@example.com',
    role: 'ADMIN',
  });
};

/**
 * テスト用の一般ユーザートークン
 */
export const getGeneralToken = (): string => {
  return generateTestToken({
    salesId: 2,
    email: 'user@example.com',
    role: 'GENERAL',
  });
};

/**
 * APIレスポンスの共通検証
 */
export const expectSuccessResponse = (body: Record<string, unknown>): void => {
  expect(body).toHaveProperty('success', true);
  expect(body).toHaveProperty('data');
};

export const expectErrorResponse = (
  body: Record<string, unknown>,
  expectedCode?: string
): void => {
  expect(body).toHaveProperty('success', false);
  expect(body).toHaveProperty('error');
  if (expectedCode) {
    expect((body.error as Record<string, unknown>).code).toBe(expectedCode);
  }
};

/**
 * ページネーションレスポンスの検証
 */
export const expectPaginatedResponse = (body: Record<string, unknown>): void => {
  expect(body).toHaveProperty('success', true);
  expect(body).toHaveProperty('data');
  expect(body).toHaveProperty('pagination');
  const pagination = body.pagination as Record<string, unknown>;
  expect(pagination).toHaveProperty('page');
  expect(pagination).toHaveProperty('limit');
  expect(pagination).toHaveProperty('total');
  expect(pagination).toHaveProperty('totalPages');
};
