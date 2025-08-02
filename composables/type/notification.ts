//======================================================
//
// 通知データ
//
//======================================================

import User from '@/composables/type/user'

/**
 * 通知データ
 */
export default class Notification {
  // ID
  id: number = 0
  // ユーザID
  userId: number = 0
  // 通知対象ユーザID
  notifyTargetUserId: number = 0
  // メッセージ
  message: string = ''
  // 台本ID
  scriptId: number = 0
  // コメントID
  commentId: number = 0
  // 台本投稿通知か
  isScriptPostNotification: boolean = false
  // フォロー通知か
  isFollowNotification: boolean = false
  // コメント通知か
  isCommentNotification: boolean = false
  // 台本お気に入り通知か
  isScriptFavoriteNotification: boolean = false
  // 投稿日時
  postedAt: Date = new Date()

  // 通知発信ユーザ
  user: User = new User()
} 
