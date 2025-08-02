//======================================================
//
// Cookieなどの設定情報管理用
//
// [索引]
//  - useSetValToCookie
//      Cookieに値をセット
//  - useGetValFromCookie
//      Cookieから値を取得
//
//======================================================

// 定数
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// useSetValToCookie
//======================================================

/**
 * Cookieに値をセット
 * 
 * @param {string} key キー
 * @param {string} val 値
 * @returns {Promise<void>}
 */
export const useSetValToCookie = async (key: string, val: string) => {
  try {
    const ck = useCookie(key, { secure: false, httpOnly: false, maxAge: CONSTANTS.COOKIE_SAVE_SEC })
    ck.value = val
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// useGetValFromCookie
//======================================================

/**
 * Cookieから値を取得
 * 
 * @param {string} key キー
 * @returns {Promise<string>} 値
 */
export const useGetValFromCookie = async (key: string): Promise<string> => {
  let val = ''

  try {
    const ck = useCookie(key, { secure: false, httpOnly: false, maxAge: CONSTANTS.COOKIE_SAVE_SEC })

    if (ck.value !== undefined && ck.value !== null) {
      val = ck.value!
    }
  } catch (error) {
    console.error(error)
  }

  return val
}