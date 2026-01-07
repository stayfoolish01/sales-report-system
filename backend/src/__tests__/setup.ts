/**
 * Jest テストセットアップ
 */

import { PrismaClient } from '@prisma/client';

// テスト用のPrismaクライアント
const prisma = new PrismaClient();

// テスト前のグローバルセットアップ
beforeAll(async () => {
  // データベース接続確認
  await prisma.$connect();
});

// テスト後のグローバルクリーンアップ
afterAll(async () => {
  await prisma.$disconnect();
});

// 各テスト後のクリーンアップ
afterEach(() => {
  jest.clearAllMocks();
});

export { prisma };
