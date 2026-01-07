import { Page } from '@playwright/test';

/**
 * テスト用の認証情報
 */
export const TEST_USER = {
  email: 'yamada@example.com',
  password: 'password123',
  name: '山田太郎',
};

export const TEST_ADMIN = {
  email: 'admin@example.com',
  password: 'admin123',
  name: '管理者',
};

/**
 * ログイン処理
 */
export async function login(
  page: Page,
  credentials: { email: string; password: string } = TEST_USER
) {
  await page.goto('/login');

  // ログインフォームに入力
  await page.getByLabel('メールアドレス').fill(credentials.email);
  await page.getByLabel('パスワード').fill(credentials.password);

  // ログインボタンをクリック
  await page.getByRole('button', { name: 'ログイン' }).click();

  // ダッシュボードへのリダイレクトを待つ
  await page.waitForURL('/');
}

/**
 * ログアウト処理
 */
export async function logout(page: Page) {
  // ユーザーメニューを開く
  await page.getByRole('button', { name: /ログアウト/i }).click();

  // ログイン画面へのリダイレクトを待つ
  await page.waitForURL('/login');
}

/**
 * 認証状態をモックする（localStorageにトークンを設定）
 */
export async function mockAuth(page: Page, user = TEST_USER) {
  await page.addInitScript(
    ({ user }) => {
      // モックトークンを設定
      localStorage.setItem('access_token', 'mock-token-for-testing');
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          state: {
            user: {
              sales_id: 1,
              name: user.name,
              email: user.email,
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
    },
    { user }
  );
}

/**
 * 管理者として認証状態をモックする
 */
export async function mockAdminAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('access_token', 'mock-admin-token');
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          user: {
            sales_id: 1,
            name: '管理者',
            email: 'admin@example.com',
            department: '営業部',
            position: '部長',
            role: 'admin',
            manager: null,
          },
          isAuthenticated: true,
        },
        version: 0,
      })
    );
  });
}
