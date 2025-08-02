//======================================================
//
// 通報データ
//
//======================================================

/**
 * 通報データ
 */
export default class Report {
  // ID
  id: number = 0
  // ユーザID
  userId: number = 0
  // 通報対象ユーザID
  reportTargetUserId: number = 0
  // タイトル
  title: string = ''
  // メッセージ
  message: string = ''
  // 台本ID
  scriptId: number = 0
} 
