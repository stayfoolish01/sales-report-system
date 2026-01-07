# デプロイガイド

営業日報システムのデプロイ手順です。

## アーキテクチャ

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Frontend      │────▶│     Backend      │────▶│    Database      │
│    (Vercel)      │     │    (Railway)     │     │   (PostgreSQL)   │
│   Next.js 14     │     │  Express + TS    │     │   Railway Add-on │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## 1. バックエンド (Railway)

### 1.1 プロジェクト作成

1. [Railway](https://railway.app/) にログイン
2. "New Project" → "Deploy from GitHub repo" を選択
3. リポジトリを選択し、`backend` ディレクトリを指定

### 1.2 PostgreSQL追加

1. プロジェクト内で "New" → "Database" → "PostgreSQL" を選択
2. データベースが作成されると `DATABASE_URL` が自動設定される

### 1.3 環境変数設定

Variables タブで以下を設定:

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `DATABASE_URL` | (自動設定) | PostgreSQL接続URL |
| `JWT_SECRET` | (ランダム文字列32文字以上) | JWT署名キー |
| `JWT_EXPIRES_IN` | `24h` | JWTの有効期限 |
| `NODE_ENV` | `production` | 実行環境 |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | CORSで許可するオリジン |
| `PORT` | `3001` | サーバーポート |

### 1.4 デプロイ

- GitHub push 時に自動デプロイ
- 手動デプロイ: Railway Dashboard から "Deploy" をクリック

### 1.5 マイグレーション

初回デプロイ時、`railway.json` の設定により自動実行:
```bash
npx prisma migrate deploy
```

## 2. フロントエンド (Vercel)

### 2.1 プロジェクト作成

1. [Vercel](https://vercel.com/) にログイン
2. "Add New Project" → GitHubリポジトリを選択
3. Root Directory を `frontend` に設定
4. Framework Preset: `Next.js`

### 2.2 環境変数設定

Settings → Environment Variables で設定:

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api/v1` | バックエンドAPI URL |

### 2.3 デプロイ

- GitHub push 時に自動デプロイ
- プレビューデプロイ: PRごとに自動生成

## 3. 本番環境チェックリスト

### セキュリティ

- [ ] JWT_SECRET が十分に長いランダム文字列である
- [ ] ALLOWED_ORIGINS が正しく設定されている
- [ ] HTTPS が有効になっている
- [ ] 環境変数に機密情報が直接記載されていない

### データベース

- [ ] PostgreSQL の接続が確立できる
- [ ] マイグレーションが完了している
- [ ] シードデータが投入されている（必要な場合）

### 監視

- [ ] ヘルスチェックエンドポイントが応答する (`/api/v1/health`)
- [ ] エラー監視が設定されている（Sentry等）

## 4. トラブルシューティング

### バックエンドが起動しない

```bash
# ログを確認
railway logs

# 環境変数を確認
railway variables
```

### データベース接続エラー

```bash
# DATABASE_URL の形式を確認
postgresql://user:password@host:port/database
```

### CORS エラー

`ALLOWED_ORIGINS` にフロントエンドのURLが含まれているか確認。
複数オリジンの場合はカンマ区切り:
```
ALLOWED_ORIGINS=https://app.example.com,https://staging.example.com
```

## 5. CI/CD パイプライン

GitHub Actions で以下を自動実行:

1. **PR作成時**: Lint + Test
2. **マージ時**: 自動デプロイ（Vercel/Railway）

```yaml
# .github/workflows/ci.yml
# 詳細は .github/workflows/ci.yml を参照
```

## 6. ロールバック

### Vercel
- Deployments タブから過去のデプロイを選択
- "Promote to Production" をクリック

### Railway
- Deployments タブから過去のデプロイを選択
- "Rollback" をクリック
