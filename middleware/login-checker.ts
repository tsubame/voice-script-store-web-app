//======================================================
//
// ログインチェック用ミドルウェア
// ※セキュリティ対策のため一部空欄化済
//
//======================================================

import { useLoginUserStore } from '@/store/loginUserStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as preferenceManager from '@/composables/util/preferenceManager'
import * as loginManager from '@/composables/util/loginManager'
import * as phpApiManager from "@/composables/util/phpApiManager"
import Notification from '@/composables/type/notification'

/**
 * ログインチェック処理実行
 */
export default defineNuxtRouteMiddleware(
  (async (to, from) => {
    try {
      console.log("[middleware] login-checker")

      // セキュリティ対策のため空欄化済

    } catch (error) {
      console.error(error)
    }
  })
)

/**
 * storeにログイン情報があるかを返す
 * 
 * @returns 
 */
const checkExistLoginUserInStore = (): Boolean => {
  try {
    // storeにログイン情報があるかをチェック
    if (useLoginUserStore().user.id == undefined || useLoginUserStore().user.id == 0) {
      console.log("[storeにログインユーザ情報なし]")

      return false
    }

    console.log("[storeにログインユーザ情報あり] " + useLoginUserStore().user.id)
  } catch (error) {
    console.error(error)
  }

  return true
}

/**
 * 該当TwitterIDのユーザデータをAPIサーバから取得し、storeにセット
 * ・ログインユーザデータ、お気に入り台本、フォロー、フォロワー、ミュートデータをstoreにセット
 * 
 * @param {string} tUserIdStr TwitterユーザID
 */
const setUserDataToStoreByTwitterUserIdStr = async (tUserIdStr: string) => {
  try {
    // セキュリティ対策のため空欄化済
  } catch (error) {
    console.error(error)
  }
}

/**
 * ユーザデータ、その他をstoreにセット
 * 
 * @param {any} user
 */
const setUserDatasToStore = async (user: any) => {
  try {
    // ログインユーザデータをstoreにセット
    useLoginUserStore().setUser(user)
    // お気に入り台本データをstoreにセット
    useFavScriptsStore().setFavScriptIds(user.scriptFavorites)
    // フォローデータをstoreにセット
    useFollowUsersStore().setFollowUserIds(user.follows)
    // フォロワーデータをstoreにセット
    useFollowUsersStore().setFollowerUserIds(user.follows)
    // ミュート中ユーザデータをstoreにセット
    useMuteUsersStore().setMuteUserIds(user.mutes)
    // 設定をstoreにセット
    useUserSettingStore().setDbSavedUserSetting(user.userSetting)
    console.log(user.userSetting)

    // 新着通知件数をセット
    setNewNotificationCount()
    // Cookieからフォントサイズを取得し、storeにセット
    setFontSizeFromCookie()
  } catch (error) {
    console.error(error)
  }
}

/**
 * 新着通知件数、表示対象の通知をセット
 * ・設定にあわせて表示対象の通知を取得し、storeにセット
 */
const setNewNotificationCount = async () => {
  try {
    let showTargetNotifications: Notification[] = []
    let newCount = 0;
    let hasToShowCommentNotification = useUserSettingStore().dbSavedUserSetting.showCommentNotification
    let hasToShowNewPostNotification = useUserSettingStore().dbSavedUserSetting.showNewPostNotification
    let hasToShowFavNotification = useUserSettingStore().dbSavedUserSetting.showScriptFavoriteNotification
    let notifyPageWatchDate = useLoginUserStore().user.notifyPageWatchDate

    useLoginUserStore().user.notifications.forEach((notification: Notification) => {
      // コメント通知
      if (notification.isCommentNotification && hasToShowCommentNotification) {
        showTargetNotifications.push(notification)
      }
      // 新規投稿通知
      if (notification.isScriptPostNotification && hasToShowNewPostNotification) {
        showTargetNotifications.push(notification)
      }
      // 台本へのお気に入り通知
      if (notification.isScriptFavoriteNotification && hasToShowFavNotification) {
        showTargetNotifications.push(notification)
      }
    })

    // 閲覧対象日時以降の通知をカウント
    showTargetNotifications.forEach((notification: Notification) => {
      if (notifyPageWatchDate < notification.postedAt) {
        newCount += 1
      }
    })

    console.log('[通知閲覧日時]')
    console.log(notifyPageWatchDate)
    console.log('[新着通知件数]')
    console.log(newCount)
    console.log(showTargetNotifications)

    // storeに通知をセット
    useLoginUserStore().user.notifications = showTargetNotifications
    // 未読件数をセット
    useUiEventStore().uiEvent.newNotificationCount = newCount
  } catch (error) {
    console.error(error)
  }
}

/**
 * Cookieから文字サイズを取得し、storeにセット
 */
const setFontSizeFromCookie = async () => {
  try {
    let cVal = await preferenceManager.useGetValFromCookie(CONSTANTS.COOKIE_KEY_FONT_SIZE)
    console.log("Cookieから取得したフォントサイズ：" + cVal)
    if (cVal !== '') {
      useUserSettingStore().cookieSavedScriptTextFontSizeRate = parseInt(cVal)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 該当GoogleIDのユーザデータをAPIサーバから取得し、storeにセット
 * ・ログインユーザデータ、お気に入り台本、フォロー、フォロワー、ミュートデータをstoreにセット
 * 
 * @param {string} gUserIdStr GoogleユーザID
 */
const setUserDataToStoreByGoogleUserIdStr = async (gUserIdStr: string) => {
  try {
    // セキュリティ対策のため空欄化済
  } catch (error) {
    console.error(error)
  }
}