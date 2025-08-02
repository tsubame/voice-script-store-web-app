//======================================================
//
// 設定管理用
//
//======================================================

import User from '@/composables/type/user';

/**
 * 設定管理用
 */
export default class UserSetting {
  // ユーザID
  userId: number = 0
  // 台本新着投稿通知を表示するか
  showNewPostNotification: boolean = true
  // コメント通知を表示するか
  showCommentNotification: boolean = true
  // 自作台本へのお気に入り通知を表示するか
  showScriptFavoriteNotification: boolean = false
  // R18台本を表示するか
  showAgeRestrictedScript: boolean = true
  // お気に入り数、閲覧数を表示するか
  showFavCountAndWatchCount: boolean = true
}