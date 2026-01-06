# GitHub Projects セットアップガイド

このガイドでは、営業日報システムの開発管理用にGitHub Projectsをセットアップする手順を説明します。

## 📋 前提条件

- GitHubリポジトリへのアクセス権限
- ブラウザでGitHubにログイン済み

## 🚀 セットアップ手順

### 1. GitHub Projectsの作成

1. リポジトリページにアクセス
   ```
   https://github.com/stayfoolish01/sales-report-system
   ```

2. 上部タブの「Projects」をクリック

3. 「Link a project」→「New project」をクリック

4. テンプレート選択画面で「Board」を選択

5. プロジェクト情報を入力:
   - **Project name**: `営業日報システム開発`
   - **Description**: `営業日報システムの開発タスク管理用カンバンボード`

6. 「Create project」をクリック

### 2. カラム（ステータス）のカスタマイズ

デフォルトのカラムを以下のように変更:

| カラム名 | 説明 |
|---------|------|
| 📝 Todo | 未着手のタスク |
| 🚧 In Progress | 作業中のタスク |
| 👀 Review | レビュー待ち・PR作成済み |
| ✅ Done | 完了したタスク |

**設定手順:**
1. 各カラムの右上「...」→「Edit」をクリック
2. カラム名を変更
3. 必要に応じて新しいカラムを追加（「+ Add column」）

### 3. ビューの設定

#### Board View（デフォルト）
- カンバン形式で視覚的にタスクを管理
- ドラッグ&ドロップでステータス変更可能

#### Table View（追加推奨）
1. 「+ New view」をクリック
2. 「Table」を選択
3. 名前を「Table」に設定
4. 表示カラムを選択:
   - Title
   - Assignees
   - Labels
   - Milestone
   - Status

### 4. Milestones（マイルストーン）の作成

リポジトリのIssuesページでMilestoneを作成:

1. `https://github.com/stayfoolish01/sales-report-system/milestones` にアクセス

2. 「New milestone」をクリック

3. 以下の4つのMilestoneを作成:

#### Milestone 1: Phase 1 - 基盤実装
- **Title**: `Phase 1: 基盤実装（認証・DB）`
- **Due date**: 任意（例: 2週間後）
- **Description**:
  ```
  認証システム、データベースセットアップ、基本的なエラーハンドリングの実装

  主要タスク:
  - Prismaマイグレーション
  - JWT認証実装
  - ログイン画面実装
  - エラーハンドリング
  ```

#### Milestone 2: Phase 2 - 日報機能
- **Title**: `Phase 2: 日報機能`
- **Due date**: 任意
- **Description**:
  ```
  日報のCRUD機能と関連する画面の実装

  主要タスク:
  - 日報API実装
  - ダッシュボード実装
  - 日報一覧・詳細・作成画面実装
  ```

#### Milestone 3: Phase 3 - コメント・マスタ管理
- **Title**: `Phase 3: コメント・マスタ管理`
- **Due date**: 任意
- **Description**:
  ```
  コメント機能と顧客・営業マスタ管理の実装

  主要タスク:
  - コメントAPI・UI実装
  - 顧客マスタCRUD実装
  - 営業マスタCRUD実装
  ```

#### Milestone 4: Phase 4 - テスト・デプロイ
- **Title**: `Phase 4: テスト・デプロイ`
- **Due date**: 任意
- **Description**:
  ```
  テスト実装、CI/CD構築、本番デプロイ

  主要タスク:
  - 単体テスト・E2Eテスト
  - セキュリティ対策
  - CI/CD構築
  - 本番環境デプロイ
  ```

### 5. Labels（ラベル）の作成

リポジトリのIssuesページでLabelを作成:

1. `https://github.com/stayfoolish01/sales-report-system/labels` にアクセス

2. 以下のラベルを作成:

| ラベル名 | 色 | 説明 |
|---------|-----|------|
| `backend` | `#0052CC` (青) | バックエンド実装 |
| `frontend` | `#008672` (緑) | フロントエンド実装 |
| `database` | `#5319E7` (紫) | DB/Prisma関連 |
| `auth` | `#FBCA04` (黄) | 認証関連 |
| `api` | `#0E8A16` (濃緑) | API実装 |
| `ui` | `#1D76DB` (水色) | UIコンポーネント |
| `test` | `#D93F0B` (オレンジ) | テスト実装 |
| `documentation` | `#C5DEF5` (薄青) | ドキュメント作成 |
| `bug` | `#D73A4A` (赤) | バグ修正 |
| `enhancement` | `#A2EEEF` (シアン) | 機能追加 |
| `priority: high` | `#B60205` (濃赤) | 優先度高 |
| `priority: medium` | `#FBCA04` (黄) | 優先度中 |
| `priority: low` | `#0E8A16` (緑) | 優先度低 |

### 6. Issueテンプレートの確認

既に `.github/ISSUE_TEMPLATE/` に以下のテンプレートが作成されています:

- ✅ `feature.yml` - 機能実装用
- ✅ `bug.yml` - バグ報告用

新しいIssue作成時にテンプレート選択画面が表示されます。

### 7. Projectsとリポジトリの連携

1. Project画面の右上「...」→「Settings」をクリック

2. 「Workflows」で以下を設定（推奨）:
   - ✅ Auto-add to project: 新しいIssueを自動的にTodoカラムに追加
   - ✅ Item closed: IssueがCloseされたらDoneカラムに移動
   - ✅ Pull request merged: PRがマージされたらDoneカラムに移動

### 8. フィルタリングとビューの活用

#### フィルター例:

**Phase 1のタスクのみ表示:**
```
milestone:"Phase 1: 基盤実装（認証・DB）"
```

**バックエンドタスクのみ表示:**
```
label:backend
```

**担当者でフィルタ:**
```
assignee:@me
```

**優先度高のみ表示:**
```
label:"priority: high"
```

## 📝 Issue作成の推奨フロー

### GitHubブラウザから作成:

1. `https://github.com/stayfoolish01/sales-report-system/issues/new/choose` にアクセス

2. 「機能実装」テンプレートを選択

3. `TASKS.md` のタスク番号を参考に情報を記入:
   - **Title**: `[Backend] JWT認証ミドルウェア実装` (TASKS.md #4)
   - **Phase**: Phase 1
   - **Area**: backend
   - **Description**: TASKS.mdの内容をコピー
   - **Acceptance Criteria**: 完了条件を記入
   - **Reference**: 関連する仕様書のセクション

4. **Labels**: `backend`, `auth`, `priority: high`

5. **Milestone**: `Phase 1: 基盤実装（認証・DB）`

6. **Assignees**: 自分を割り当て

7. 「Submit new issue」をクリック

8. 作成されたIssueは自動的にProjectのTodoカラムに追加される

### GitHub CLIから作成（コマンドライン）:

```bash
gh issue create \
  --title "[Backend] JWT認証ミドルウェア実装" \
  --body-file issue-template.md \
  --label "backend,auth,priority: high" \
  --milestone "Phase 1: 基盤実装（認証・DB）" \
  --assignee @me
```

## 🔄 開発ワークフロー

### 標準的な開発フロー:

1. **Issue作成**
   - TASKS.mdを参照してIssueを作成
   - 適切なラベルとMilestoneを設定

2. **ブランチ作成**
   ```bash
   git checkout -b feature/issue-4-jwt-middleware
   ```

3. **開発開始**
   - Issueを「In Progress」カラムに移動

4. **実装完了**
   - コミット
   ```bash
   git commit -m "feat: JWT認証ミドルウェア実装 #4"
   ```

5. **PR作成**
   ```bash
   gh pr create --title "feat: JWT認証ミドルウェア実装" --body "Closes #4"
   ```
   - PRは自動的に「Review」カラムに移動

6. **マージ**
   - レビュー後マージ
   - Issueは自動的に「Done」カラムに移動してClose

## 📊 進捗確認

### Projectsボードで確認:
- カンバンボードで視覚的に進捗を確認
- Milestoneごとの進捗率を確認

### Milestonesページで確認:
- `https://github.com/stayfoolish01/sales-report-system/milestones`
- 各Phaseの進捗率がパーセンテージで表示される

## 💡 Tips

### 複数Issueの一括作成:
Phase 1のIssueをまとめて作成する場合、スクリプトを活用できます。

### Issueテンプレートの活用:
テンプレートを使うことで、必要な情報を漏れなく記入できます。

### ProjectsのAutomation活用:
IssueのステータスをPRと連動させることで、手動での更新作業を削減できます。

---

**セットアップ完了後、`TASKS.md` のPhase 1から順次Issueを作成して開発を進めてください！**