//======================================================
//
// API 'xxx'のレスポンスパラメータ
//
//======================================================

import User from '@/composables/type/user'
import ScriptFavorite from '@/composables/type/scriptFavorite'
import Follow from '@/composables/type/follow'
import Notification from '@/composables/type/notification'
import Mute from '@/composables/type/mute'
import UserSetting from '@/composables/type/userSetting'

/**
 * API 'xxx'のレスポンスパラメータ
 */
export default class GetUserByGoogleUserIdResParam {
  // ユーザ情報
  user: User = new User()
  // ユーザのお気に入り台本一覧
  scriptFavorites: ScriptFavorite[] = []
  // ユーザがフォロー中のユーザ一覧
  follows: Follow[] = []
  // ユーザがフォローされているユーザ一覧
  followers: Follow[] = []
  // ミュート中のユーザ一覧
  mutes: Mute[] = []
  // 通知一覧
  notifications: Notification[] = []
  // ユーザ設定
  userSetting: UserSetting = new UserSetting()
} 