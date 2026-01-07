import { defineConfig, devices } from '@playwright/test';

/**
 * E2Eテスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* テストファイルのパターン */
  testMatch: '**/*.spec.ts',
  /* 並列実行 */
  fullyParallel: true,
  /* CI環境でtest.onlyがあったらエラー */
  forbidOnly: !!process.env.CI,
  /* CI環境ではリトライ */
  retries: process.env.CI ? 2 : 0,
  /* CI環境では並列度を制限 */
  workers: process.env.CI ? 1 : undefined,
  /* レポーター設定 */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  /* 共通設定 */
  use: {
    /* ベースURL */
    baseURL: 'http://localhost:3000',
    /* トレース収集（リトライ時のみ） */
    trace: 'on-first-retry',
    /* スクリーンショット（失敗時のみ） */
    screenshot: 'only-on-failure',
    /* ビデオ録画（リトライ時のみ） */
    video: 'on-first-retry',
  },

  /* ブラウザ設定 */
  projects: [
    /* 認証なしテスト */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* モバイル表示テスト */
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* 開発サーバー設定 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* タイムアウト設定 */
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
});
