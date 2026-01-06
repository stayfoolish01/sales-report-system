# 営業日報システム - 開発タスク一覧

このファイルは開発タスクの全体像を管理します。
各タスクは GitHub Issues として作成し、進捗を管理します。

## 📋 タスク管理方法

- **GitHub Issues**: 各タスクをIssueとして作成
- **GitHub Projects**: カンバンボードで進捗を可視化
- **Labels**: backend, frontend, database, auth, api, ui, bug, documentation
- **Milestones**: Phase 1〜4で管理

## 🎯 開発フェーズ

### Phase 1: 基盤実装（認証・DB）

**優先度: 最高 | 期間目安: 基盤となる重要な実装**

#### 1.1 データベース・Prisma
- [ ] #1 Prismaマイグレーション実行とDB初期化
- [ ] #2 Prisma Clientの型定義確認
- [ ] #3 データベースシードデータ作成（テスト用営業担当・顧客）

#### 1.2 認証システム（Backend）
- [ ] #4 JWT認証ミドルウェア実装（`src/middlewares/auth.ts`）
- [ ] #5 パスワードハッシュ化ユーティリティ実装（`src/utils/password.ts`）
- [ ] #6 ログインAPI実装（POST `/api/v1/auth/login`）
  - API仕様書: 3.1 認証API
- [ ] #7 ログアウトAPI実装（POST `/api/v1/auth/logout`）
- [ ] #8 認証状態確認API実装（GET `/api/v1/auth/me`）
- [ ] #9 認証エラーハンドリング実装

#### 1.3 エラーハンドリング・バリデーション（Backend）
- [ ] #10 グローバルエラーハンドラー実装（`src/middlewares/errorHandler.ts`）
- [ ] #11 Zodバリデーションスキーマ定義（`src/schemas/`）
- [ ] #12 バリデーションミドルウェア実装
- [ ] #13 共通レスポンス型定義（`src/types/response.ts`）

#### 1.4 認証UI（Frontend）
- [ ] #14 shadcn/ui セットアップ（Button, Input, Form, Card等）
- [ ] #15 Zustand認証ストア実装（`app/lib/stores/authStore.ts`）
- [ ] #16 Axios インスタンス設定（認証ヘッダー自動付与）
- [ ] #17 ログイン画面実装（SC-001）
  - 画面定義書: SC-001 ログイン画面
  - パス: `app/(auth)/login/page.tsx`
- [ ] #18 認証ルートガード実装（`app/middleware.ts`）
- [ ] #19 ログアウト機能実装

---

### Phase 2: 日報機能

**優先度: 高 | 期間目安: コア機能の実装**

#### 2.1 日報API（Backend）
- [ ] #20 日報一覧取得API実装（GET `/api/v1/reports`）
  - API仕様書: 3.2.1
  - ページネーション・フィルタリング対応
- [ ] #21 日報詳細取得API実装（GET `/api/v1/reports/:id`）
  - API仕様書: 3.2.2
- [ ] #22 日報作成API実装（POST `/api/v1/reports`）
  - API仕様書: 3.2.3
  - 訪問記録の一括作成対応
- [ ] #23 日報更新API実装（PUT `/api/v1/reports/:id`）
  - API仕様書: 3.2.4
- [ ] #24 日報削除API実装（DELETE `/api/v1/reports/:id`）
  - API仕様書: 3.2.5
- [ ] #25 日報提出API実装（POST `/api/v1/reports/:id/submit`）
  - API仕様書: 3.2.6
  - ステータスをDRAFT→SUBMITTEDに変更

#### 2.2 日報画面（Frontend）
- [ ] #26 ダッシュボード画面実装（SC-002）
  - 画面定義書: SC-002 ダッシュボード
  - パス: `app/(dashboard)/page.tsx`
  - 日報提出状況一覧表示
  - 未読コメント件数表示
- [ ] #27 日報一覧画面実装（SC-003）
  - 画面定義書: SC-003 日報一覧
  - パス: `app/(dashboard)/reports/page.tsx`
  - ページネーション実装
  - フィルタリング機能（日付範囲、担当者、ステータス）
- [ ] #28 日報詳細画面実装（SC-004）
  - 画面定義書: SC-004 日報詳細
  - パス: `app/(dashboard)/reports/[id]/page.tsx`
  - 訪問記録一覧表示
  - Problem/Plan表示
  - コメント一覧表示（Phase 3で実装予定）
- [ ] #29 日報作成・編集画面実装（SC-005）
  - 画面定義書: SC-005 日報作成・編集
  - パス: `app/(dashboard)/reports/new/page.tsx` & `edit/[id]/page.tsx`
  - React Hook Form + Zod統合
  - 訪問記録の動的追加・削除
  - 顧客選択（セレクトボックス or 検索モーダル）
  - 下書き保存・提出機能

#### 2.3 共通コンポーネント（Frontend）
- [ ] #30 日報カードコンポーネント実装（`app/components/ReportCard.tsx`）
- [ ] #31 訪問記録入力コンポーネント実装（`app/components/VisitRecordInput.tsx`）
- [ ] #32 ページネーションコンポーネント実装（`app/components/Pagination.tsx`）
- [ ] #33 日付範囲ピッカーコンポーネント実装（date-fns使用）
- [ ] #34 ローディング・エラー表示コンポーネント

---

### Phase 3: コメント・マスタ管理

**優先度: 中 | 期間目安: 追加機能の実装**

#### 3.1 コメントAPI（Backend）
- [ ] #35 コメント一覧取得API実装（GET `/api/v1/reports/:reportId/comments`）
  - API仕様書: 3.3.1
- [ ] #36 コメント作成API実装（POST `/api/v1/reports/:reportId/comments`）
  - API仕様書: 3.3.2
- [ ] #37 コメント更新API実装（PUT `/api/v1/comments/:id`）
  - API仕様書: 3.3.3
- [ ] #38 コメント削除API実装（DELETE `/api/v1/comments/:id`）
  - API仕様書: 3.3.4

#### 3.2 コメント機能（Frontend）
- [ ] #39 コメント一覧コンポーネント実装（`app/components/CommentList.tsx`）
- [ ] #40 コメント入力フォーム実装（`app/components/CommentForm.tsx`）
- [ ] #41 日報詳細画面にコメント機能統合（SC-004更新）
- [ ] #42 未読コメント通知バッジ実装

#### 3.3 顧客マスタAPI（Backend）
- [ ] #43 顧客一覧取得API実装（GET `/api/v1/customers`）
  - API仕様書: 3.4.1
  - 検索・ページネーション対応
- [ ] #44 顧客詳細取得API実装（GET `/api/v1/customers/:id`）
  - API仕様書: 3.4.2
- [ ] #45 顧客作成API実装（POST `/api/v1/customers`）
  - API仕様書: 3.4.3
- [ ] #46 顧客更新API実装（PUT `/api/v1/customers/:id`）
  - API仕様書: 3.4.4
- [ ] #47 顧客削除API実装（DELETE `/api/v1/customers/:id`）
  - API仕様書: 3.4.5

#### 3.4 顧客マスタ画面（Frontend）
- [ ] #48 顧客一覧画面実装（SC-006）
  - 画面定義書: SC-006 顧客一覧
  - パス: `app/(dashboard)/customers/page.tsx`
  - 検索機能（顧客名、顧客コード）
  - ページネーション
- [ ] #49 顧客作成・編集画面実装（SC-007）
  - 画面定義書: SC-007 顧客作成・編集
  - パス: `app/(dashboard)/customers/new/page.tsx` & `edit/[id]/page.tsx`

#### 3.5 営業マスタAPI（Backend）
- [ ] #50 営業担当一覧取得API実装（GET `/api/v1/sales-staff`）
  - API仕様書: 3.5.1
- [ ] #51 営業担当詳細取得API実装（GET `/api/v1/sales-staff/:id`）
  - API仕様書: 3.5.2
- [ ] #52 営業担当作成API実装（POST `/api/v1/sales-staff`）
  - API仕様書: 3.5.3
- [ ] #53 営業担当更新API実装（PUT `/api/v1/sales-staff/:id`）
  - API仕様書: 3.5.4
- [ ] #54 営業担当削除API実装（DELETE `/api/v1/sales-staff/:id`）
  - API仕様書: 3.5.5

#### 3.6 営業マスタ画面（Frontend）
- [ ] #55 営業担当一覧画面実装（SC-008）
  - 画面定義書: SC-008 営業担当一覧
  - パス: `app/(dashboard)/sales-staff/page.tsx`
  - 組織階層表示（上長との関係）
- [ ] #56 営業担当作成・編集画面実装（SC-009）
  - 画面定義書: SC-009 営業担当作成・編集
  - パス: `app/(dashboard)/sales-staff/new/page.tsx` & `edit/[id]/page.tsx`
  - 上長選択機能

---

### Phase 4: テスト・デプロイ

**優先度: 中 | 期間目安: 品質保証と本番化**

#### 4.1 テスト実装（Backend）
- [ ] #57 認証APIのテスト実装（Jest + Supertest）
  - テスト仕様書: TC-001〜TC-003
- [ ] #58 日報APIのテスト実装
  - テスト仕様書: TC-004〜TC-011
- [ ] #59 コメントAPIのテスト実装
  - テスト仕様書: TC-012〜TC-015
- [ ] #60 顧客マスタAPIのテスト実装
  - テスト仕様書: TC-016〜TC-020
- [ ] #61 営業マスタAPIのテスト実装
  - テスト仕様書: TC-021〜TC-025
- [ ] #62 統合テスト実装
  - テスト仕様書: TC-026〜TC-030

#### 4.2 E2Eテスト（Frontend）
- [ ] #63 Playwright or Cypress セットアップ
- [ ] #64 ログインフローE2Eテスト
- [ ] #65 日報作成フローE2Eテスト
- [ ] #66 コメント機能E2Eテスト

#### 4.3 パフォーマンス・セキュリティ
- [ ] #67 APIレスポンスタイム計測と最適化
  - テスト仕様書: TC-031〜TC-035
- [ ] #68 SQLインジェクション対策確認
  - テスト仕様書: TC-036〜TC-040
- [ ] #69 XSS対策確認
- [ ] #70 CSRF対策実装
- [ ] #71 レート制限（Rate Limiting）実装

#### 4.4 CI/CD・デプロイ
- [ ] #72 GitHub Actions CI設定（Lint + Test）
- [ ] #73 Vercel フロントエンドデプロイ設定
- [ ] #74 Railway バックエンドデプロイ設定
- [ ] #75 本番環境用環境変数設定
- [ ] #76 Prisma本番マイグレーション戦略

#### 4.5 ドキュメント・運用
- [ ] #77 API仕様書のSwagger/OpenAPI化
- [ ] #78 README.mdに本番デプロイ手順追加
- [ ] #79 運用マニュアル作成（バックアップ、ロールバック等）
- [ ] #80 エラー監視設定（Sentry等）

---

## 📊 進捗状況

### Phase 1: 基盤実装
- [ ] 0/19 タスク完了

### Phase 2: 日報機能
- [ ] 0/15 タスク完了

### Phase 3: コメント・マスタ管理
- [ ] 0/22 タスク完了

### Phase 4: テスト・デプロイ
- [ ] 0/24 タスク完了

**全体進捗: 0/80 タスク完了（0%）**

---

## 🏷️ ラベル一覧

| ラベル | 説明 |
|--------|------|
| `backend` | バックエンド実装 |
| `frontend` | フロントエンド実装 |
| `database` | DB/Prisma関連 |
| `auth` | 認証関連 |
| `api` | API実装 |
| `ui` | UIコンポーネント |
| `test` | テスト実装 |
| `documentation` | ドキュメント作成 |
| `bug` | バグ修正 |
| `enhancement` | 機能追加 |

---

## 📝 GitHub Issueの作成方法

### 方法1: Webから作成
1. https://github.com/stayfoolish01/sales-report-system/issues/new/choose
2. 「機能実装」または「バグ報告」テンプレートを選択
3. このTASKS.mdのタスク番号（例: #4）を参照して内容を記入

### 方法2: GitHub CLIで作成（例）
```bash
gh issue create \
  --title "[Backend] JWT認証ミドルウェア実装" \
  --body "Phase 1.2 認証システムの一環としてJWT認証ミドルウェアを実装する。

## 実装内容
- src/middlewares/auth.ts を作成
- JWTトークン検証機能
- リクエストヘッダーからトークン抽出
- デコードしたユーザー情報をreq.userに格納

## 完了条件
- [ ] ミドルウェアが正しくトークンを検証する
- [ ] 無効なトークンで401エラーを返す
- [ ] req.userにユーザー情報が格納される

## 参照
- API仕様書: 3.1 認証API
- CLAUDE.md: 認証フロー" \
  --label "backend,auth" \
  --milestone "Phase 1: 基盤実装"
```

---

## 🚀 次のステップ

1. **GitHub Projects作成**
   - https://github.com/stayfoolish01/sales-report-system/projects でカンバンボード作成
   - カラム: Todo / In Progress / Done

2. **Milestone作成**
   ```bash
   gh api repos/stayfoolish01/sales-report-system/milestones -f title="Phase 1: 基盤実装"
   gh api repos/stayfoolish01/sales-report-system/milestones -f title="Phase 2: 日報機能"
   gh api repos/stayfoolish01/sales-report-system/milestones -f title="Phase 3: コメント・マスタ管理"
   gh api repos/stayfoolish01/sales-report-system/milestones -f title="Phase 4: テスト・デプロイ"
   ```

3. **Phase 1から順次Issue作成**
   - Phase 1の#1から開始推奨
   - 1つずつIssueを作成してタスクを進める

---

最終更新: 2026-01-06