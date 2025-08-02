# 声劇台本置き場 フロントアプリ開発用リポジトリ

声劇台本置き場 フロントエンドアプリ開発リポジトリ

***

## 技術構成

| 用途                            | 説明             |
| ------------------------------- | ---------------- |
| フロントWebアプリフレームワーク | Nuxt 3           |
| CSSフレームワーク               | Vuetify 3        |
| バックエンドAPI                 | FuelPHP、Laravel |
| データベース                    | MySQL 8          |
| フロントWebアプリホスティング   | リトルサーバー   |
| バックエンドAPIホスティング     | リトルサーバー   |
| アクセス解析                    | Google Analitycs |
| Googleログイン認証              | PHP Socialite    |

***

## ディレクトリ構成

| ディレクトリ   | 説明                               |
| -------------- | ---------------------------------- |
| /assets/       | vuetify用の共通ファイル            |
| /components/   | Nuxtコンポーネント                 |
| /composables/  | TypeScriptの自作共通関数           |
| /docs/         | システム構成図など                 |
| /layouts/      | レイアウト                         |
| /middleware/   | Nuxtミドルウェア                   |
| /node_modules/ | NodeModule                         |
| /pages/        | Nuxtルーティング用ページ           |
| /plugins/      | Nuxtで自動で読み込まれるプラグイン |
| /public/       | 画像、音声ファイルなど             |
| /store/        | Nuxtデータ永続化用store            |
| /types/        | TypeScript型定義                   |

***

## 開発方針

コードはできるだけ丁寧に書いています。
また、各コンポーネントの分割はアトミックデザインを採用しています。