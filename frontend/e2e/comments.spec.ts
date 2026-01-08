import { test, expect } from '@playwright/test';

/**
 * コメント機能E2Eテスト
 *
 * 前提条件:
 * - バックエンドサーバーがhttp://localhost:3001で起動していること
 * - フロントエンドがhttp://localhost:3000で起動していること
 * - シードデータが投入されていること
 * - 日報とコメントが存在すること
 */

// 実際のログインを行うヘルパー関数
const performLogin = async (
  page: import('@playwright/test').Page,
  email: string,
  password: string
) => {
  await page.goto('/login');
  await page.getByLabel('メールアドレス').fill(email);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: 'ログイン' }).click();
  // ダッシュボードへのリダイレクトを待つ
  await page.waitForURL('/', { timeout: 15000 });
};

test.describe('ダッシュボードのコメント表示', () => {
  test.beforeEach(async ({ page }) => {
    // 実際のログインを行う
    await performLogin(page, 'manager@example.com', 'password123');
  });

  test('ダッシュボードに直近のコメント数が表示される', async ({ page }) => {
    // ダッシュボード概要が表示される
    await expect(page.getByText('本日の概要')).toBeVisible();

    // 「直近のコメント」というラベルが表示される
    await expect(page.getByText('直近のコメント')).toBeVisible();
  });

  test('本日の訪問数が表示される', async ({ page }) => {
    // 「本日の訪問」というラベルが表示される
    await expect(page.getByText('本日の訪問')).toBeVisible();
  });

  test('今月の日報数が表示される', async ({ page }) => {
    // 「今月の日報」というラベルが表示される
    await expect(page.getByText('今月の日報')).toBeVisible();
  });
});

test.describe('日報一覧表示', () => {
  test.beforeEach(async ({ page }) => {
    // 実際のログインを行う
    await performLogin(page, 'manager@example.com', 'password123');
  });

  test('日報一覧画面が表示される', async ({ page }) => {
    await page.goto('/reports');

    // 日報一覧が表示されるのを待つ
    await expect(page.getByRole('heading', { name: '日報一覧' })).toBeVisible();

    // 検索結果の件数が表示される
    await expect(page.getByText(/検索結果:/)).toBeVisible();
  });
});
