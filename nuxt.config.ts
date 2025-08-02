// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // devtools
  devtools: { enabled: false },

  // SSR
  ssr: false,

  // アプリケーション設定
  app: {
    // 相対URL
    baseURL: '/web-app/',

    head: {
      title: '声劇台本置き場 - 誰でも投稿できる台本サイト',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { 'charset': 'utf-8' },
        { 'name': 'viewport', 'content': 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { 'name': 'description', 'content': '声劇用の台本を投稿できるサイトです。台本の投稿と閲覧はどなたでも無料でご利用いただけます。台本は縦書き、横書きの切替可。役名の色分け機能あり。' },
        { 'property': 'og:title', 'content': '声劇台本置き場' },
        { 'property': 'og:site_name', 'content': '声劇台本置き場' },
        { 'property': 'og:description', 'content': '声劇用の台本を投稿できるサイトです。台本の投稿と閲覧はどなたでも無料でご利用いただけます。' },
        { 'property': 'og:image', 'content': 'https://taltal3014.lsv.jp/web-app/img/logo/fox.png' },
        { 'property': 'og:url', 'content': 'https://taltal3014.lsv.jp/web-app/' },
        { 'property': 'twitter:card', 'content': '声劇台本置き場' },
        { 'property': 'twitter:image', 'content': 'https://taltal3014.lsv.jp/web-app/img/logo/fox.png' },
        { 'http-equiv': 'Cache-Control', 'content': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
        { 'http-equiv': 'Pragma', 'content': 'no-cache' },
        { 'http-equiv': 'Expires', 'content': '0' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/web-app/favicon.ico' }, // ここにfaviconのパスを設定
        { rel: "manifest", href: "/manifest.json" },
      ],
      script: [
        { async: true, src: 'https://www.googletagmanager.com/xxxxxxxxxxxxxxxxxxxxxxxxx' },
        { src: '/web-app/js/analytics.js' },
      ],
    },
  },

  // ポート番号指定
  devServer: {
    port: 8088,
  },

  // モジュール
  modules: [
    // 画像ファイルのlazy-load用
    'nuxt-lazy-load',
    // pinia
    '@pinia/nuxt',
    // pinia-persistedstate
    '@pinia-plugin-persistedstate/nuxt',
    // eslint
    '@nuxt/eslint',
    // vuetify
    'vuetify-nuxt-module',
  ],

  // eslint
  eslint: {
    config: {
      stylistic: true
    },
  },

  // CSS 
  css: [
  ],

  // Vuetify
  build: {
    transpile: ['vuetify']
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 変数定義用
          additionalData: `@import "@/assets/variables.scss";`,
        }
      }
    },
  },

  // component
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],

  // 自動インポート対象
  imports: {
    dirs: [
      // Scan top-level modules
      'composables',
      // ... or scan modules nested one level deep with a specific name and file extension
      'composables/*/index.{ts,js,mjs,mts}',
      // ... or scan all modules within given directory
      'composables/**',
      // store
      'store/**',
    ],
    autoImport: true,
  },

  // 環境変数
  runtimeConfig: {
    public: {
      // ポート番号
      PORT: process.env.PORT || '',
      // APP BASE URL
      APP_BASE_URL: process.env.BASE_URL || '/web-app/',
      // 開発環境か
      IS_DEVELOPMENT: process.env.NODE_ENV === '' ? true : false,
      // API URL
      PHP_API_URL: process.env.PHP_API_URL || '',
      // AUTH URL
      AUTH_API_URL: process.env.AUTH_API_URL || '',
    },
  }
})