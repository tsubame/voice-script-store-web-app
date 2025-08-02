//======================================================
//
// API 'xxx'のレスポンスパラメータ
//
//======================================================

import User from '@/composables/type/user'

/**
 * API 'xxx'のレスポンスパラメータ
 */
export default class PostUserUpdateResParam {
  // メッセージ
  message: string = ''
  // ユーザデータ
  val: User = new User()
} 
