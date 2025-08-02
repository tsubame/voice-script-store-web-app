//======================================================
//
// API 'xxx'のレスポンスパラメータ
//
//======================================================

import User from '@/composables/type/user'
import Script from '@/composables/type/script'
import Follow from '@/composables/type/follow'

/**
 * API 'xxx'のレスポンスパラメータ
 */
export default class GetUserWithScriptsAndFollowsResParam {
  // ユーザ情報
  user: User = new User()
  // ユーザが登録した台本一覧
  scripts: Script[] = []
  // ユーザがフォロー中のユーザ一覧
  follows: Follow[] = []
  // ユーザがフォローされているユーザ一覧
  followers: Follow[] = []
} 
