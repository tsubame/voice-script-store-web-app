//======================================================
//
// ローディング状態管理用store
// actionsのstartLoading()、finishLoading()を呼び出すことでローディングアニメーションが表示される
//
//======================================================

// pinia
import { defineStore } from 'pinia'

/**
 * ローディング状態管理用store
 */
export const useLoadingStore = defineStore({
  id: 'loadingState',

  state: () => ({
    isLoading: false,
  }),
  actions: {
    startLoading() {
      this.isLoading = true
    },
    finishLoading() {
      this.isLoading = false
    },
  },
})
