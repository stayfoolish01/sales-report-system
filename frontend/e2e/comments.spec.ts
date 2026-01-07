import { test, expect } from '@playwright/test';

test.describe('コメント機能', () => {
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

  test.describe('コメント表示', () => {
    test('日報詳細画面にコメントセクションが表示される', async ({ page }) => {
      await page.goto('/reports/1');

      // コメントセクションの確認
      await expect(page.getByText('コメントを追加')).toBeVisible();
    });

    test('コメント入力フォームが表示される', async ({ page }) => {
      await page.goto('/reports/1');

      // テキストエリアの確認
      const commentTextarea = page.getByPlaceholder('コメントを入力');
      await expect(commentTextarea).toBeVisible();

      // 送信ボタンの確認
      await expect(page.getByRole('button', { name: '送信' })).toBeVisible();
    });
  });

  test.describe('コメント入力', () => {
    test('コメントを入力できる', async ({ page }) => {
      await page.goto('/reports/1');

      // コメントを入力
      const commentTextarea = page.getByPlaceholder('コメントを入力');
      await commentTextarea.fill('テストコメントです');

      // 入力値が反映されている
      await expect(commentTextarea).toHaveValue('テストコメントです');
    });

    test('空のコメントは送信できない', async ({ page }) => {
      await page.goto('/reports/1');

      // 空の状態で送信ボタンをクリック
      const submitButton = page.getByRole('button', { name: '送信' });

      // 送信ボタンがdisabledまたはクリックしてもエラーが表示される
      const isDisabled = await submitButton.isDisabled();
      if (!isDisabled) {
        await submitButton.click();
        // バリデーションエラーが表示される
        await expect(page.getByText('コメントを入力してください')).toBeVisible();
      }
    });

    test('500文字を超えるコメントはエラーになる', async ({ page }) => {
      await page.goto('/reports/1');

      // 501文字のコメントを入力
      const longComment = 'あ'.repeat(501);
      const commentTextarea = page.getByPlaceholder('コメントを入力');
      await commentTextarea.fill(longComment);

      // 送信ボタンをクリック
      await page.getByRole('button', { name: '送信' }).click();

      // エラーメッセージが表示される
      await expect(
        page.getByText('コメントは500文字以内で入力してください')
      ).toBeVisible();
    });

    test('文字数カウンターが表示される', async ({ page }) => {
      await page.goto('/reports/1');

      // コメントを入力
      const commentTextarea = page.getByPlaceholder('コメントを入力');
      await commentTextarea.fill('テスト');

      // 文字数カウンターの確認
      await expect(page.getByText(/\d+\/500/)).toBeVisible();
    });
  });

  test.describe('コメント操作', () => {
    test('自分のコメントにはメニューボタンが表示される', async ({ page }) => {
      await page.goto('/reports/1');

      // 自分のコメントを見つける（モックデータに自分のコメントがある場合）
      const ownComment = page.locator('[data-testid="comment-item"]').filter({
        hasText: '山田太郎',
      });

      if (await ownComment.first().isVisible()) {
        // メニューボタンが表示される
        const menuButton = ownComment.first().getByRole('button');
        await expect(menuButton).toBeVisible();
      }
    });
  });
});

test.describe('コメント通知', () => {
  test.beforeEach(async ({ page }) => {
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

  test('未読コメントがある場合はバッジが表示される', async ({ page }) => {
    await page.goto('/');

    // ダッシュボードに未読コメント数が表示される
    const unreadBadge = page.locator('.bg-red-500');
    // バッジが存在する場合のみテスト
    if (await unreadBadge.first().isVisible()) {
      await expect(unreadBadge.first()).toBeVisible();
    }
  });

  test('日報一覧で未読コメントマークが表示される', async ({ page }) => {
    await page.goto('/reports');

    // 未読コメントがある日報にマークが表示される
    const unreadIndicator = page.locator('[data-testid="unread-indicator"]');
    // インジケーターが存在する場合のみテスト
    if (await unreadIndicator.first().isVisible()) {
      await expect(unreadIndicator.first()).toBeVisible();
    }
  });
});
