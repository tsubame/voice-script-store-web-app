// ======================================================
//
// ローディング状態管理用Plugin
//
// [仕様]
//  ・グローバル空間で$loadingを使用できるようにprovide実行
//  ・$loading.start()、$loading.fninish()でローディング状態を操作可能
//
// [使用方法]
//  ※<script setup>内で以下のように記述
//
//  const { $loading } = useNuxtApp()
//  $loading.start()
//
// ======================================================

// store
import { useLoadingStore } from '~/store/loadingState'

/**
 * ローディング状態管理用Plugin
 */
export default defineNuxtPlugin((nuxtApp) => {
  const loading = {
    start() {
      const ls = useLoadingStore()
      ls.isLoading = true
    },
    finish() {
      const ls = useLoadingStore()
      ls.isLoading = false
    },
  }

  // $loadingをprovide
  return {
    provide: {
      loading,
    },
  }
})
