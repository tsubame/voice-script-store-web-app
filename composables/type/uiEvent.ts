//======================================================
//
// UIイベント管理用
//
//======================================================

import User from '@/composables/type/user';
import Script from '@/composables/type/script';

/**
 * UIイベント管理用
 */
export default class UiEvent {
  // ログインダイアログを表示中か
  isLoginDialogShowing: boolean = false
  // 通知ダイアログを表示中か
  isNotificationDialogShowing: boolean = false
  // ユーザ編集ダイアログを表示中か
  isEditUserDialogShowing: boolean = false
  // OKダイアログを表示中か
  isOkDialogShowing: boolean = false
  // OKダイアログに表示するメッセージ
  okDialogMessage: string = ''
  // OKダイアログに表示する説明用メッセージ
  okDialogExplainMessage: string = ''
  // 検索ダイアログを表示中か
  isSearchDialogShowing: boolean = false
  // 台本検索ボタンが押されたか
  isSearchButtonClicked: boolean = false

  // 画像選択ダイアログを表示中か
  isSelectBgImgDialogShowing: boolean = false
  // 台本のタグ選択ダイアログを表示中か
  isSelectScriptTagDialogShowing: boolean = false
  // ユーザのプロフィールダイアログを表示中か
  isUserProfileDialogShowing: boolean = false
  // 台本紐づけダイアログを表示中か
  isUserScriptLinkDialogShowing: boolean = false
  // 台本紐づけダイアログを表示する必要があるか（初回ログイン時のみ）
  hasToShowScriptLinkDialog: boolean = false
  // 台本紐づけに成功したか
  hasUserScriptLinkSuccessed: boolean = false
  // コメントデータを再取得するか
  hasToReloadScriptComments: boolean = false
  // 設定ダイアログを表示中か
  isUserSettingDialogShowing: boolean = false
  // 通知ダイアログの台本アイテムがクリックされたか
  hasNotifactionScriptItemClicked: boolean = false
  // 台本編集確認用ページを表示中か
  isScriptEditConfirmPageShowing: boolean = false
  // 文字サイズ拡大ボタンが押されたか
  isFontSizePlusButtonClicked: boolean = false
  // 文字サイズ縮小ボタンが押されたか
  isFontSizeMinusButtonClicked: boolean = false
  // カラーコード選択ダイアログを表示中か
  isColorCodeSelectDialogShowing: boolean = false
  // 左メニューを表示中か
  isLeftNavigationShowing: boolean = false
  // 台本利用規定説明ダイアログを表示中か
  isScriptPolicyDialogShowing: boolean = false
  // 台本ローディングアイコンを表示中か
  isScriptLoadingIconShowing: boolean = false
  // 台本シェアダイアログを表示中か
  isScriptShareDialogShowing: boolean = false
  // ユーザシェアダイアログを表示中か
  isUserShareDialogShowing: boolean = false
  // フルスクリーン時の背景選択ダイアログを表示中か
  isScriptFullScreenBgImageSelectDialogShowing: boolean = false
  // 台本を縦書きで表示するか
  showFullScreenScriptByVertical: boolean = true
  // フルスクリーンダイアログのスクロールをリセットする必要があるか
  hasToResetFullScreenDialogScroll: boolean = false
  // 画面下の通知用チップを表示するか
  isBottomNotificationShowing: boolean = false
  // 画面下の通知メッセージ
  bottomNotificationMessage: string = ''
  // 台本コメントボタンが押されたか
  isScriptCommentButtonClicked: boolean = false

  // フルスクリーンダイアログを表示中か
  isScriptFullScreenDialogShowing: boolean = false// false  
  // 台本の背景画像を表示中か
  isScriptBgIllustImageShowing: boolean = false
  // 台本のシンプルな背景を表示中か
  isScriptBgSimpleImageShowing: boolean = false
  // 背景画像を非表示にするか
  isScriptBgImageHidden: boolean = false
  // 紐づけ確認ダイアログを表示中か
  isScriptLinkConfirmDialogShowing: boolean = false

  // 台本で選択された名前
  scriptSelectedNames: string[] = []
  // プロフィール閲覧中のユーザID
  profileShowingTargetUserId: number = 0
  // ヘッダのタブインデックス
  headerTabIndex: number = 0
  // 台本詳細ページのタブインデックス
  scriptDetailTabIndex: number = 0
  // Y方向のスクロール位置
  bodyScrollTop: number = 0
  // 未読通知の件数
  newNotificationCount: number = 0
  // 閲覧対象の台本ID
  watchingScriptId: number = 0
  // 検索バーの検索条件表示用テキスト
  searchBarText: string = ''

  // 違反報告対象のユーザ
  reportTargetUser: User = new User()
  // 違反報告対象の台本
  reportTargetScript: Script = new Script()
}