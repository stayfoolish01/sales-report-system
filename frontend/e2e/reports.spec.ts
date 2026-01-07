import { test, expect } from '@playwright/test';

test.describe('日報機能', () => {
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

  test.describe('日報一覧', () => {
    test('日報一覧画面が正しく表示される', async ({ page }) => {
      await page.goto('/reports');

      // タイトルの確認
      await expect(page.getByRole('heading', { name: '日報一覧' })).toBeVisible();

      // 新規作成ボタンの確認
      await expect(page.getByRole('button', { name: '新規作成' })).toBeVisible();

      // 検索フォームの確認
      await expect(page.getByRole('button', { name: '検索' })).toBeVisible();
    });

    test('新規作成ボタンをクリックすると日報作成画面に遷移する', async ({
      page,
    }) => {
      await page.goto('/reports');

      // 新規作成ボタンをクリック
      await page.getByRole('button', { name: '新規作成' }).click();

      // 日報作成画面に遷移
      await expect(page).toHaveURL('/reports/new');
    });

    test('日報カードをクリックすると詳細画面に遷移する', async ({ page }) => {
      await page.goto('/reports');

      // 日報カードをクリック（モックデータの最初のカード）
      const reportCard = page.locator('[data-testid="report-card"]').first();
      if (await reportCard.isVisible()) {
        await reportCard.click();
        // 詳細画面に遷移
        await expect(page).toHaveURL(/\/reports\/\d+/);
      }
    });
  });

  test.describe('日報作成', () => {
    test('日報作成画面が正しく表示される', async ({ page }) => {
      await page.goto('/reports/new');

      // タイトルの確認
      await expect(page.getByRole('heading', { name: '日報作成' })).toBeVisible();

      // フォーム要素の確認
      await expect(page.getByText('訪問記録')).toBeVisible();
      await expect(page.getByText('課題・問題点')).toBeVisible();
      await expect(page.getByText('明日の予定')).toBeVisible();
    });

    test('訪問記録を追加できる', async ({ page }) => {
      await page.goto('/reports/new');

      // 訪問記録追加ボタンをクリック
      await page.getByRole('button', { name: /訪問記録を追加/ }).click();

      // 訪問記録フォームが表示される
      await expect(page.getByText('訪問先')).toBeVisible();
    });

    test('下書き保存ボタンが存在する', async ({ page }) => {
      await page.goto('/reports/new');

      // 下書き保存ボタンの確認
      await expect(page.getByRole('button', { name: '下書き保存' })).toBeVisible();
    });

    test('提出ボタンが存在する', async ({ page }) => {
      await page.goto('/reports/new');

      // 提出ボタンの確認
      await expect(page.getByRole('button', { name: '提出' })).toBeVisible();
    });

    test('戻るボタンで一覧画面に戻れる', async ({ page }) => {
      await page.goto('/reports/new');

      // 戻るボタンをクリック
      await page.getByRole('button', { name: /戻る/ }).first().click();

      // 一覧画面に遷移
      await expect(page).toHaveURL('/reports');
    });
  });

  test.describe('日報詳細', () => {
    test('日報詳細画面のレイアウトが正しく表示される', async ({ page }) => {
      // モックの日報詳細画面にアクセス
      await page.goto('/reports/1');

      // 主要なセクションが表示される
      await expect(page.getByText('訪問記録')).toBeVisible();
    });

    test('編集ボタンが存在する', async ({ page }) => {
      await page.goto('/reports/1');

      // 編集ボタンの確認
      const editButton = page.getByRole('button', { name: /編集/ });
      await expect(editButton).toBeVisible();
    });
  });

  test.describe('日報編集', () => {
    test('日報編集画面が正しく表示される', async ({ page }) => {
      await page.goto('/reports/1/edit');

      // 編集画面のタイトル確認
      await expect(page.getByRole('heading', { name: '日報編集' })).toBeVisible();
    });

    test('キャンセルボタンで詳細画面に戻れる', async ({ page }) => {
      await page.goto('/reports/1/edit');

      // キャンセルボタンをクリック
      await page.getByRole('button', { name: /キャンセル/ }).click();

      // 詳細画面に遷移
      await expect(page).toHaveURL('/reports/1');
    });
  });
});

test.describe('日報検索', () => {
  test.beforeEach(async ({ page }) => {
    // 管理者として認証状態をモック
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
  });

  test('管理者は営業担当者フィルターが表示される', async ({ page }) => {
    await page.goto('/reports');

    // 営業担当者セレクトが表示される（管理者のみ）
    await expect(page.getByText('担当者')).toBeVisible();
  });

  test('ステータスフィルターが動作する', async ({ page }) => {
    await page.goto('/reports');

    // ステータスを「下書き」に変更
    const statusSelect = page.locator('select').filter({ hasText: 'すべて' }).first();
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('draft');
      await page.getByRole('button', { name: '検索' }).click();
    }
  });
});
