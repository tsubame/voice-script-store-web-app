//======================================================
//
// ユーザデータ
//
//======================================================

import * as CONSTANTS from '@/composables/etc/constants'
import TwitterUser from '@/composables/type/twitterUser'
import GoogleUser from '@/composables/type/googleUser'
import Script from '@/composables/type/script'
import Follow from '@/composables/type/follow'
import ScriptFavorite from '@/composables/type/scriptFavorite'
import Notification from '@/composables/type/notification';
import Mute from '@/composables/type/mute'
import UserSetting from '@/composables/type/userSetting'

/**
 * ユーザデータ
 */
export default class User {
  // ユーザID
  id: number = 0
  // ユーザ名
  name: string = ''
  // GoogleユーザID
  googleUserIdStr: string = ''
  // TwitterユーザID
  twitterUserIdStr: string = ''
  // Twitterの@ユーザ名（プロフィール編集で変更可）
  twitterScreenName: string = ''
  // プロフィール画像
  profileImageUrl: string = ''
  // 自己紹介説明文
  description: string = ''
  // パスワード
  password: string = ''
  // ログイン時刻
  lastLoginDate: Date = new Date()
  // トップページの通知を見た日時
  notifyPageWatchDate: Date = new Date()
  // タグ（カンマ区切り）
  tagsTxt: string = ''
  // UUID
  uuid: string = ''
  // 未登録か
  isUnregistered: boolean = false
  // Twitterアカウントを公開するか
  revealTwitterScreenName: boolean = false
  // ボイストランドユーザID
  voicetolandUserId: number = 0

  // 台本
  scripts: Script[] = []
  // フォロー中ユーザ
  follows: Follow[] = []
  // フォロワーユーザ
  followers: Follow[] = []
  // 台本お気に入りデータ
  scriptFavorites: ScriptFavorite[] = []
  // ミュート中のユーザデータ
  mutes: Mute[] = []
  // 通知一覧
  notifications: Notification[] = []
  // ユーザ設定
  userSetting: UserSetting = new UserSetting()
  // ログインで使用したTwitterユーザデータ
  twitterUser: TwitterUser = new TwitterUser()

  /**
   * Twitterユーザデータからユーザデータをセット
   * 
   * @param {TwitterUser} tUser
   */
  public setValsFromTwitterUser(tUser: TwitterUser) {
    try {
      this.twitterUserIdStr = tUser.uid
      this.twitterScreenName = tUser.screenName
      this.name = tUser.displayName
      this.profileImageUrl = tUser.photoUrl

      this.twitterUser = tUser
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Googleユーザデータからユーザデータをセット
   * 
   * @param {GoogleUser} gUser
   */
  public setValsFromGoogleUser(gUser: GoogleUser) {
    try {
      this.googleUserIdStr = gUser.googleUserIdStr
      this.profileImageUrl = gUser.profileImageUrl
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * アイコンがない場合、デフォルトアイコンのURLを返す
   */
  public setDefaultImageIfNotHasProfileImage() {
    try {
      if (!this.profileImageUrl) {
        this.profileImageUrl = useRuntimeConfig().public.APP_BASE_URL + CONSTANTS.DEFAULT_USER_ICON_PATH
      }

      console.log(this.profileImageUrl)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 通知データにユーザデータをセット
   * ・同じインデックスの通知データにユーザデータをセット
   * 
   * @param {User[]} users
   */
  public setUsersToNotifications(users: User[]) {
    try {
      for (let i = 0; i < this.notifications.length; i++) {
        const n = this.notifications[i]

        if (i < users.length) {
          const u = users[i]
          n.user = u

          this.notifications[i] = n
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
} 
