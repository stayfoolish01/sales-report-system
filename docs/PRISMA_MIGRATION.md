# Prisma マイグレーション戦略

本番環境でのPrismaマイグレーション手順と戦略について説明します。

## 概要

Prismaマイグレーションは、データベーススキーマの変更を安全に管理するための仕組みです。

## マイグレーションフロー

```
開発環境            本番環境
    │                  │
    ▼                  │
schema.prisma 編集    │
    │                  │
    ▼                  │
prisma migrate dev    │
(マイグレーションファイル生成)
    │                  │
    ▼                  │
Git commit & push     │
    │                  │
    ▼                  ▼
                  prisma migrate deploy
                 (マイグレーション適用)
```

## 開発環境でのマイグレーション

### 新しいマイグレーションの作成

```bash
cd backend

# スキーマを変更後、マイグレーションを作成
npx prisma migrate dev --name add_new_feature

# マイグレーションファイルが生成される
# prisma/migrations/{timestamp}_add_new_feature/migration.sql
```

### マイグレーションのリセット（開発環境のみ）

```bash
# データベースをリセットしてマイグレーションを再適用
npx prisma migrate reset

# 警告: 全データが削除されます
```

## 本番環境でのマイグレーション

### デプロイ時の自動実行

`railway.json` の設定により、デプロイ時に自動的にマイグレーションが実行されます:

```json
{
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start"
  }
}
```

### 手動マイグレーション

緊急時や特別な場合に手動でマイグレーションを実行:

```bash
# Railway CLIを使用
railway run npx prisma migrate deploy

# または直接データベースに接続
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

## ロールバック手順

### 方法1: コードロールバック

最新のマイグレーションをロールバックする最も安全な方法:

1. 前のバージョンのコードをデプロイ
2. データベースの手動修正が必要な場合は個別に対応

### 方法2: 手動SQLロールバック

```sql
-- 例: テーブル追加のロールバック
DROP TABLE IF EXISTS new_table;

-- 例: カラム追加のロールバック
ALTER TABLE users DROP COLUMN new_column;

-- マイグレーション履歴を更新
DELETE FROM _prisma_migrations
WHERE migration_name = '{migration_name}';
```

### 方法3: データベースリストア

重大な問題が発生した場合:

1. サービスを停止
2. バックアップからデータベースをリストア
3. 前のバージョンのコードをデプロイ
4. サービスを再開

## バックアップ戦略

### 自動バックアップ

Railway PostgreSQLは自動的にバックアップを作成します:
- 毎日の自動バックアップ
- 7日間の保持期間

### マイグレーション前の手動バックアップ

大きな変更を行う前にバックアップを取得:

```bash
# PostgreSQLダンプ
pg_dump -h host -U user -d database > backup_$(date +%Y%m%d).sql

# または Railway CLI
railway run pg_dump > backup_$(date +%Y%m%d).sql
```

## ベストプラクティス

### 1. マイグレーションは小さく

```prisma
// 良い例: 1つのマイグレーションで1つの変更
model User {
  newField String? // NULL許可で追加
}
```

### 2. 破壊的変更は2段階で

```
フェーズ1: 新しいカラムを追加（NULL許可）
         ↓ デプロイ
フェーズ2: データを移行
         ↓ デプロイ
フェーズ3: 古いカラムを削除
```

### 3. カラム名変更は避ける

カラム名を変更する代わりに:
1. 新しいカラムを追加
2. データを移行
3. アプリケーションを更新
4. 古いカラムを削除

### 4. デフォルト値を設定

```prisma
model Post {
  published Boolean @default(false)
  views     Int     @default(0)
}
```

## トラブルシューティング

### マイグレーションの競合

```bash
# ベースラインリセット（本番では注意）
npx prisma migrate resolve --applied "{migration_name}"
```

### スキーマドリフト

開発環境とマイグレーションファイルが不一致の場合:

```bash
# 現在の状態からマイグレーションを生成
npx prisma migrate dev --create-only

# 確認後、適用
npx prisma migrate dev
```

### マイグレーション履歴の確認

```bash
npx prisma migrate status
```

## 環境別設定

| 環境 | コマンド | 説明 |
|------|----------|------|
| 開発 | `prisma migrate dev` | マイグレーション作成・適用・クライアント再生成 |
| テスト | `prisma migrate reset` | DB初期化・マイグレーション適用・シード |
| 本番 | `prisma migrate deploy` | マイグレーション適用のみ |
