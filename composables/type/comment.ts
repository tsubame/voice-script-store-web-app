//======================================================
//
// コメントデータ
//
//======================================================

// コメント
import User from './user';

/**
 * コメントデータ
 */
export default class Comment {
  // ID
  id: number = 0;
  // ユーザID
  userId: number = 0;
  // 台本ID
  scriptId: number = 0;
  // 返信対象のコメントID
  replyTargetCommentId: number = 0;
  // 返信対象のコメントID
  replyTargetUserId: number = 0;
  // メッセージ
  message: string = '';
  // 投稿日時
  postedAt: Date = new Date();
  // 削除フラグ
  isDeleted: boolean = false;

  // ユーザ
  user: User = new User();

}