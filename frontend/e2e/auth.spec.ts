import { test, expect } from '@playwright/test';

test.describe('認証フロー', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にログイン画面に移動
    await page.goto('/login');
  });

  test('ログイン画面が正しく表示される', async ({ page }) => {
    // タイトルの確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible();

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

  test('無効なメールアドレス形式でエラーが表示される', async ({ page }) => {
    // 無効なメールアドレスを入力
    await page.getByLabel('メールアドレス').fill('invalid-email');
    await page.getByLabel('パスワード').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // エラーメッセージの確認
    await expect(
      page.getByText('有効なメールアドレスを入力してください')
    ).toBeVisible();
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

  test('パスワード表示/非表示の切り替えが動作する', async ({ page }) => {
    const passwordInput = page.getByLabel('パスワード');
    const toggleButton = page.getByRole('button', { name: /パスワードを表示/ });

    // 初期状態はパスワード非表示
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 表示ボタンをクリック
    await toggleButton.click();

    // パスワードが表示される
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 再度クリックで非表示に
    await page.getByRole('button', { name: /パスワードを非表示/ }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
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
  test.beforeEach(async ({ page }) => {
    // 認証状態をモック
    await page.addInitScript(() => {
      localStorage.setItem('access_token', 'mock-token-for-testing');
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: {
              sales_id: 1,
              name: '山田太郎',
              email: 'yamada@example.com',
              department: '営業部',
              position: '課長',
              role: 'general',
              manager: null,
            },
            isAuthenticated: true,
          },
          version: 0,
        })
      );
    });
  });

  test('認証済みユーザーがログイン画面にアクセスするとダッシュボードにリダイレクトされる', async ({
    page,
  }) => {
    await page.goto('/login');

    // ダッシュボードにリダイレクトされる
    await expect(page).toHaveURL('/');
  });

  test('ダッシュボードが正しく表示される', async ({ page }) => {
    await page.goto('/');

    // ダッシュボードの要素が表示される
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible();
  });

  test('ログアウトするとログイン画面にリダイレクトされる', async ({ page }) => {
    await page.goto('/');

    // ログアウトボタンをクリック
    await page.getByRole('button', { name: /ログアウト/i }).click();

    // ログイン画面にリダイレクトされる
    await expect(page).toHaveURL(/\/login/);
  });
});
