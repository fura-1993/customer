# 顧客管理システムの実装

Next.js 14 (App Router) + TypeScript + Supabase を用いた顧客管理システムを実装しました。

## 実装内容

- 日替わりパスワード認証 (JatrackMMDD形式)
- 顧客・案件・作業員管理機能
- ファイルアップロード機能 (画像・PDF・動画)
- 管理者専用ダッシュボード
- レスポンシブUI (iPhone SE幅対応)

## 技術スタック

- Next.js 14 (App Router) / TypeScript strict
- Supabase (Postgres + Storage + Auth)
- TailwindCSS + shadcn/ui (Radix)
- Zod バリデーション
- date-fns & date-fns-tz による日本時間対応
- uploadthing/react によるファイルアップロード

## 日替わりパスワード計算方法

日替わりパスワードは以下の形式で計算されます：
```
JatrackMMDD
```
ここで、`MM` は月（2桁）、`DD` は日（2桁）です。
この計算は日本時間（JST）で行われます。

## 動画500MB制限方法

動画ファイルのアップロードサイズは、クライアント側のZodバリデーションとサーバー側のUploadThing設定で制限しています。

Link to Devin run: https://app.devin.ai/sessions/c9501056af09421eb729ddfb1f14c91b
Requested by: Nobu. Sole Proprietor
