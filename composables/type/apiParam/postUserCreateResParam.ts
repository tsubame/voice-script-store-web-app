//======================================================
//
// API 'xxx'のレスポンスパラメータ
//
//======================================================

import User from '@/composables/type/user'
import Script from '@/composables/type/script'

/**
 * API 'xxx'のレスポンスパラメータ
 */
export default class PostUserUpdateResParam {
  // メッセージ
  message: string = ''
  // ユーザデータ
  user: User = new User()
  // 台本データ
  scripts: Script[] = []
} 
