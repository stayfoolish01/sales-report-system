# コントリビューションガイド

営業日報システムの開発に貢献する際のガイドラインです。

## 📋 目次

- [開発フロー](#開発フロー)
- [ブランチ戦略](#ブランチ戦略)
- [コミットメッセージ](#コミットメッセージ)
- [プルリクエスト](#プルリクエスト)
- [コーディング規約](#コーディング規約)

---

## 🔄 開発フロー

### 基本的なワークフロー

```
1. Issueを選ぶ
   ↓
2. ブランチを作成
   ↓
3. 実装
   ↓
4. コミット
   ↓
5. プッシュ
   ↓
6. プルリクエスト作成
   ↓
7. レビュー（セルフレビュー）
   ↓
8. マージ
   ↓
9. Issueが自動的にClose
   ↓
10. ブランチ削除
```

### 詳細な手順

#### 1. Issueを選ぶ

GitHub Issuesまたはプロジェクトボードから作業するIssueを選びます。

- 未着手のIssue（TodoカラムまたはOpen状態）
- 優先度の高いもの（`priority: high`ラベル）
- Phase 1から順番に進めることを推奨

**例:**
- Issue #1: [Database] Prismaマイグレーション実行とDB初期化

#### 2. 最新のmasterを取得してブランチ作成

```bash
# masterブランチに移動
git checkout master

# 最新の変更を取得
git pull origin master

# 新しいブランチを作成（Issue番号を含める）
git checkout -b feature/issue-1-prisma-migration
```

**ブランチ命名規則:**
```
feature/issue-{番号}-{簡単な説明}
bugfix/issue-{番号}-{簡単な説明}
```

**例:**
- `feature/issue-1-prisma-migration`
- `feature/issue-4-jwt-middleware`
- `feature/issue-17-login-page`
- `bugfix/issue-25-report-submit-error`

#### 3. 実装

Issueに記載された内容を実装します。

- 完了条件を必ず確認
- 参照ドキュメント（API仕様書、画面定義書等）を参照
- テストも一緒に書く（可能な場合）

#### 4. コミット

変更をコミットします。

```bash
# 変更をステージング
git add .

# コミット（Issue番号を含める）
git commit -m "feat: Prismaマイグレーション実行とDB初期化 #1"
```

**コミットメッセージの形式:**
```
<type>: <subject> #<issue番号>

例:
- feat: ログインAPI実装 #6
- fix: 日報作成時のバリデーションエラー修正 #22
- docs: API仕様書更新 #77
```

#### 5. GitHubにプッシュ

```bash
git push origin feature/issue-1-prisma-migration
```

初回プッシュ時にブランチが作成されます。

#### 6. プルリクエスト作成

GitHub CLIを使用（推奨）:

```bash
gh pr create \
  --title "feat: Prismaマイグレーション実行とDB初期化" \
  --body "Closes #1

## 概要
Prismaマイグレーションを実行し、データベースを初期化しました。

## 変更内容
- prisma migrate devを実行
- 5つのテーブルが作成されることを確認
- Prisma Clientが生成されることを確認

## テスト
- [x] マイグレーションが正常に完了
- [x] テーブルが作成された
- [x] Prisma Clientが利用可能

## スクリーンショット
（必要に応じて）"
```

または、GitHubのWeb UIから作成:
1. https://github.com/stayfoolish01/sales-report-system/pulls にアクセス
2. 「New pull request」をクリック
3. ブランチを選択
4. タイトルと本文を記入
5. 「Create pull request」をクリック

**PRの本文に必ず含めるもの:**
- `Closes #番号` - マージ時にIssueを自動Close
- 概要
- 変更内容
- テスト結果

#### 7. レビュー（セルフレビュー）

一人開発の場合は、自分でコードをレビューします。

**チェック項目:**
- [ ] コードが動作する
- [ ] コーディング規約に従っている
- [ ] 不要なコメントやデバッグコードが残っていない
- [ ] セキュリティ上の問題がない
- [ ] パフォーマンス上の問題がない

#### 8. マージ

PRをマージします。

```bash
gh pr merge --merge
```

または、GitHubのWeb UIから「Merge pull request」ボタンをクリック。

**マージ方法:**
- **Merge commit**（推奨） - 通常のマージ
- Squash and merge - コミットを1つにまとめる
- Rebase and merge - リベース

#### 9. Issueが自動的にClose

PRの本文に `Closes #番号` が含まれていれば、マージ時に自動的にIssueがCloseされます。

GitHub Projectsのカードも自動的に「Done」カラムに移動します。

#### 10. ブランチ削除

マージ後、不要になったブランチを削除します。

```bash
# masterに戻る
git checkout master

# 最新の変更を取得
git pull origin master

# ローカルブランチを削除
git branch -d feature/issue-1-prisma-migration

# リモートブランチを削除（必要に応じて）
git push origin --delete feature/issue-1-prisma-migration
```

GitHubのWeb UIでは、マージ後に「Delete branch」ボタンが表示されます。

---

## 🌿 ブランチ戦略

### ブランチの種類

| ブランチ | 用途 | 命名規則 |
|---------|------|----------|
| `master` | 本番用（保護ブランチ） | - |
| `feature/*` | 新機能実装 | `feature/issue-{番号}-{説明}` |
| `bugfix/*` | バグ修正 | `bugfix/issue-{番号}-{説明}` |

### ブランチのライフサイクル

```
master (保護)
  │
  ├─ feature/issue-1-prisma-migration
  │    └─ マージ後削除
  │
  ├─ feature/issue-2-prisma-client
  │    └─ マージ後削除
  │
  └─ ...
```

### ブランチの命名例

**良い例:**
```
feature/issue-1-prisma-migration
feature/issue-4-jwt-middleware
feature/issue-17-login-page
feature/issue-26-dashboard
bugfix/issue-25-report-submit-error
```

**悪い例:**
```
test
fix
new-feature
update
```

---

## 💬 コミットメッセージ

### 形式

```
<type>: <subject> #<issue番号>

<body>（任意）

<footer>（任意）
```

### Type（種類）

| Type | 説明 | 例 |
|------|------|-----|
| `feat` | 新機能 | `feat: ログインAPI実装 #6` |
| `fix` | バグ修正 | `fix: 日報作成時のバリデーションエラー修正 #22` |
| `docs` | ドキュメント | `docs: API仕様書更新 #77` |
| `style` | コードスタイル（空白、フォーマット等） | `style: ESLint警告修正` |
| `refactor` | リファクタリング | `refactor: 認証ミドルウェアを関数化 #4` |
| `test` | テスト追加・修正 | `test: 日報APIのテスト追加 #58` |
| `chore` | ビルド・ツール関連 | `chore: パッケージ更新` |

### Subject（件名）

- 50文字以内
- 命令形（「〜する」）
- 最初の文字は大文字にしない
- 末尾にピリオド不要

### 例

**良い例:**
```
feat: JWT認証ミドルウェア実装 #4
fix: ログイン時の400エラー修正 #6
docs: CONTRIBUTING.md追加
test: 日報作成APIのテスト追加 #58
```

**悪い例:**
```
update
fix bug
コミット
WIP
```

---

## 🔀 プルリクエスト

### PRのタイトル

コミットメッセージと同じ形式:

```
<type>: <subject>

例:
feat: Prismaマイグレーション実行とDB初期化
fix: 日報作成時のバリデーションエラー修正
```

### PRの本文テンプレート

```markdown
Closes #番号

## 概要
何を実装したのか簡潔に説明

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## テスト
- [x] ○○が動作することを確認
- [x] △△のテストがパスすることを確認
- [ ] （未完了の項目があれば）

## スクリーンショット
（UIの変更がある場合は画像を添付）

## 備考
（あれば特記事項を記載）
```

### Issueとの連携

PRの本文に以下のキーワードを含めると、マージ時に自動的にIssueがCloseされます:

```markdown
Closes #1
Fixes #1
Resolves #1
```

複数のIssueを一度にClose:
```markdown
Closes #1, #2, #3
```

### PRのレビュー（セルフレビュー）

一人開発の場合でも、PRを作成してセルフレビューを実施します。

**チェックリスト:**
- [ ] コードが正しく動作する
- [ ] テストがパスする
- [ ] コーディング規約に従っている
- [ ] 不要なコードが含まれていない
- [ ] コメントが適切に書かれている
- [ ] セキュリティ上の問題がない
- [ ] パフォーマンス上の問題がない

---

## 📐 コーディング規約

### TypeScript / JavaScript

#### 基本ルール

- **インデント**: 2スペース
- **セミコロン**: 必須
- **クォート**: シングルクォート（'）
- **命名規則**:
  - 変数・関数: camelCase（例: `getUserData`）
  - クラス: PascalCase（例: `UserService`）
  - 定数: UPPER_SNAKE_CASE（例: `MAX_RETRY_COUNT`）
  - ファイル名: kebab-case（例: `user-service.ts`）

#### ESLint / Prettier

プロジェクトには既にESLintとPrettierが設定されています。

```bash
# フォーマット自動修正
npm run format

# Lint実行
npm run lint
```

#### TypeScript型定義

- `any`の使用は避ける
- 可能な限り型推論を活用
- 必要に応じて型定義ファイル（`*.d.ts`）を作成

**例:**
```typescript
// ❌ 悪い例
function getUser(id: any): any {
  return users.find((u: any) => u.id === id);
}

// ✅ 良い例
function getUser(id: number): User | undefined {
  return users.find((u) => u.id === id);
}
```

### データベース（Prisma）

#### 命名規則

- **テーブル名**: PascalCase（例: `SalesStaff`, `DailyReport`）
- **カラム名**: camelCase（例: `salesId`, `reportDate`）
- **データベース側のカラム名**: snake_case（例: `sales_id`, `report_date`）
  - `@map("snake_case")` を使用

#### 例

```prisma
model SalesStaff {
  salesId    Int      @id @default(autoincrement()) @map("sales_id")
  name       String   @db.VarChar(50)
  email      String   @unique @db.VarChar(255)

  @@map("sales_staff")
}
```

### API設計

#### レスポンス形式

全APIで統一されたレスポンス形式を使用:

**成功時:**
```json
{
  "success": true,
  "data": { ... }
}
```

**エラー時:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

詳細は [API仕様書](./sales-report-system/docs/api-specification.md) を参照。

### UI/UX

- **コンポーネント名**: PascalCase（例: `LoginForm`, `ReportCard`）
- **props名**: camelCase
- **再利用可能なコンポーネント**: `app/components/`に配置
- **ページ固有のコンポーネント**: ページディレクトリ内に配置

---

## 🧪 テスト

### テスト方針

- **単体テスト**: 各関数・コンポーネント単位
- **統合テスト**: 複数のモジュールを結合
- **E2Eテスト**: ユーザーの操作フロー全体

### テストの実行

```bash
# バックエンドのテスト
cd backend
npm test

# フロントエンドのテスト（E2E）
cd frontend
npm run test:e2e
```

### テストの書き方

Phase 4で詳細に実装予定。

---

## 📚 参考ドキュメント

- [TASKS.md](./TASKS.md) - 全タスク一覧
- [PROJECT_SETUP.md](./.github/PROJECT_SETUP.md) - GitHub Projects セットアップ
- [CLAUDE.md](./CLAUDE.md) - プロジェクト開発ガイド
- [requirements.md](./sales-report-system/docs/requirements.md) - 要件定義
- [api-specification.md](./sales-report-system/docs/api-specification.md) - API仕様書
- [screen-design.md](./sales-report-system/docs/screen-design.md) - 画面定義書

---

## 💡 Tips

### ブランチの切り替え前に確認

```bash
# 変更があるか確認
git status

# 変更を一時退避
git stash

# ブランチ切り替え
git checkout master

# 変更を復元
git stash pop
```

### コミット前のチェック

```bash
# 変更内容を確認
git diff

# ステージング内容を確認
git diff --cached
```

### PRを作成する前に

```bash
# masterの最新を取り込む
git checkout master
git pull origin master
git checkout feature/issue-1-prisma-migration
git merge master

# コンフリクトがあれば解決
```

---

## ❓ 質問・問題が発生した場合

1. **既存のIssueを確認**: 同じ問題が報告されていないか
2. **ドキュメントを確認**: CLAUDE.md、API仕様書等
3. **新しいIssueを作成**: バグ報告や質問用のIssueテンプレートを使用

---

最終更新: 2026-01-07