import { test, expect } from '@playwright/test';

/**
 * 認証フローE2Eテスト
 *
 * 前提条件:
 * - バックエンドサーバーがhttp://localhost:3001で起動していること
 * - フロントエンドがhttp://localhost:3000で起動していること
 * - シードデータが投入されていること（manager@example.com / password123）
 */

test.describe('認証フロー', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にログイン画面に移動
    await page.goto('/login');
  });

  test('ログイン画面が正しく表示される', async ({ page }) => {
    // タイトルの確認（営業日報システム）
    await expect(page.getByRole('heading', { name: '営業日報システム' })).toBeVisible();

    // フォーム要素の確認
    await expect(page.getByLabel('メールアドレス')).toBeVisible();
    await expect(page.getByLabel('パスワード')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();
  });

  test('空のフォームでログインを試みるとバリデーションエラーが表示される', async ({
    page,
  }) => {
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();

    // エラーメッセージの確認
    await expect(
      page.getByText('メールアドレスを入力してください')
    ).toBeVisible();
    await expect(page.getByText('パスワードを入力してください')).toBeVisible();
  });

  test('短すぎるパスワードでエラーが表示される', async ({ page }) => {
    // 短いパスワードを入力
    await page.getByLabel('メールアドレス').fill('test@example.com');
    await page.getByLabel('パスワード').fill('short');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // エラーメッセージの確認
    await expect(
      page.getByText('パスワードは8文字以上で入力してください')
    ).toBeVisible();
  });

  test('未認証ユーザーがダッシュボードにアクセスするとログイン画面にリダイレクトされる', async ({
    page,
  }) => {
    // ダッシュボードに直接アクセス
    await page.goto('/');

    // ログイン画面にリダイレクトされる
    await expect(page).toHaveURL(/\/login/);
  });

  test('未認証ユーザーが日報一覧にアクセスするとログイン画面にリダイレクトされる', async ({
    page,
  }) => {
    // 日報一覧に直接アクセス
    await page.goto('/reports');

    // ログイン画面にリダイレクトされる
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('認証済みユーザー', () => {
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

  test('有効な認証情報でログインできる', async ({ page }) => {
    await performLogin(page, 'manager@example.com', 'password123');

    // ダッシュボードが表示される
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
  });

  test('ログイン後にユーザー名が表示される', async ({ page }) => {
    await performLogin(page, 'manager@example.com', 'password123');

    // ユーザー名が表示される（UserMenuコンポーネント）- manager@example.comは「佐藤部長」
    await expect(page.getByText('佐藤部長')).toBeVisible();
  });

  test('ログアウトするとログイン画面にリダイレクトされる', async ({ page }) => {
    await performLogin(page, 'manager@example.com', 'password123');

    // ユーザーメニューを開く - manager@example.comは「佐藤部長」
    await page.getByRole('button', { name: /佐藤部長/i }).click();

    // ドロップダウンメニュー内のログアウトボタンをクリック
    await page.getByRole('button', { name: /ログアウト/i }).click();

    // ログイン画面にリダイレクトされる
    await expect(page).toHaveURL(/\/login/);
  });
});
