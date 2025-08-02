//======================================================
//
// アクセストークンチェック用ミドルウェア
// storeにCSRFトークンがなければセット
//
//======================================================

import { useAccessTokenStore } from '@/store/accessTokenStore'
import * as phpApiManager from "@/composables/util/phpApiManager"

// 状態管理用 
const _accessTokenStore = useAccessTokenStore()

/**
 * アクセストークンチェック処理実行
 * ・storeにCSRFトークンがあれば終了
 * ・CSRFトークンを取得し、storeにセット
 */
export default defineNuxtRouteMiddleware(
  (async (to, from) => {
    try {
      console.log("[middleware] access-token-checker")
      // storeにCSRFトークンがあれば終了
      if (checkExistCsrfTokenInStore()) {
        return
      }

      // 再取得
      await setAccessTokenToStore()
    } catch (error) {
      console.error(error)
    }
  })
)

/**
 * storeにCSRFトークンがあるかを返す
 * 
 * @returns 
 */
const checkExistCsrfTokenInStore = (): Boolean => {
  try {
    // storeにCSRFトークンがあるかをチェック
    if (_accessTokenStore.accessToken.csrfToken == undefined || _accessTokenStore.accessToken.csrfToken == "") {
      console.log("[storeにCSRFトークンなし]")

      return false
    }
  } catch (error) {
    console.error(error)
  }

  return true
}

/**
 * CSRFトークンを取得し、storeにセット
 */
const setAccessTokenToStore = async () => {
  try {
    // CSRFトークンを取得
    const accessToken = await phpApiManager.useGetAccessToken()
    // storeにセット
    _accessTokenStore.setAccessToken(accessToken)
  } catch (error) {
    console.error(error)
  }
}


