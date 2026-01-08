import { test, expect } from '@playwright/test';

/**
 * 日報機能E2Eテスト
 *
 * 前提条件:
 * - バックエンドサーバーがhttp://localhost:3001で起動していること
 * - フロントエンドがhttp://localhost:3000で起動していること
 * - シードデータが投入されていること
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

test.describe('日報機能', () => {
  test.beforeEach(async ({ page }) => {
    // 実際のログインを行う
    await performLogin(page, 'manager@example.com', 'password123');
  });

  test.describe('日報一覧', () => {
    test('日報一覧画面が正しく表示される', async ({ page }) => {
      await page.goto('/reports');

      // タイトルの確認
      await expect(page.getByRole('heading', { name: '日報一覧' })).toBeVisible();

      // 新規作成ボタンの確認
      await expect(page.getByRole('button', { name: /新規作成/i })).toBeVisible();

      // 検索ボタンの確認
      await expect(page.getByRole('button', { name: '検索' })).toBeVisible();
    });

    test('新規作成ボタンをクリックすると日報作成画面に遷移する', async ({
      page,
    }) => {
      await page.goto('/reports');

      // 新規作成ボタンをクリック
      await page.getByRole('button', { name: /新規作成/i }).click();

      // 日報作成画面に遷移
      await expect(page).toHaveURL('/reports/new');
    });
  });

  test.describe('日報作成', () => {
    test('日報作成画面が正しく表示される', async ({ page }) => {
      await page.goto('/reports/new');

      // タイトルの確認
      await expect(page.getByRole('heading', { name: '日報作成' })).toBeVisible();

      // フォーム要素の確認（exact: trueで完全一致）
      await expect(page.getByText('訪問記録', { exact: true })).toBeVisible();
      await expect(page.getByText('課題・相談（Problem）')).toBeVisible();
      await expect(page.getByText('明日の予定（Plan）')).toBeVisible();
    });

    test('訪問記録を追加できる', async ({ page }) => {
      await page.goto('/reports/new');

      // 訪問記録追加ボタンをクリック
      await page.getByRole('button', { name: /訪問記録を追加/i }).click();

      // 2件目の訪問記録フォームが表示される（初期状態で1件ある）
      const customerLabels = page.getByLabel('顧客 *');
      await expect(customerLabels).toHaveCount(2);
    });

    test('下書き保存ボタンが存在する', async ({ page }) => {
      await page.goto('/reports/new');

      // 下書き保存ボタンの確認
      await expect(page.getByRole('button', { name: /下書き保存/i })).toBeVisible();
    });

    test('提出ボタンが存在する', async ({ page }) => {
      await page.goto('/reports/new');

      // 提出ボタンの確認
      await expect(page.getByRole('button', { name: '提出' })).toBeVisible();
    });

    test('日報作成画面に戻るボタンが存在する', async ({ page }) => {
      await page.goto('/reports/new');

      // 戻るボタン（ArrowLeftアイコンを持つ最初のボタン）が存在する
      const backButton = page.getByRole('button').first();
      await expect(backButton).toBeVisible();
    });
  });
});

test.describe('日報検索（管理者）', () => {
  test.beforeEach(async ({ page }) => {
    // 管理者として実際のログインを行う
    await performLogin(page, 'manager@example.com', 'password123');
  });

  test('管理者は営業担当者フィルターが表示される', async ({ page }) => {
    await page.goto('/reports');

    // 営業担当者ラベルが表示される（管理者のみ）
    await expect(page.getByText('営業担当者')).toBeVisible();
  });

  test('ステータスフィルターが存在する', async ({ page }) => {
    await page.goto('/reports');

    // ステータスラベルが表示される
    await expect(page.getByText('ステータス')).toBeVisible();
  });
});
