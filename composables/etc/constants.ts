import * as CONSTANTS from '@/composables/etc/constants';
//======================================================
//
// constants.ts　定数定義
// ※セキュリティ対策のため一部は空欄化済
//
//======================================================

//======================================================
// 動作変更用
//======================================================

// SNSログインでLaravel認証サーバを使用する
export const USE_LARAVEL_AUTH_SERVER = true

// ローカル環境のSNSログインでFirebaseを使用する
export const USE_FIREBASE_FOR_LOCAL_SNS_LOGIN = false

// キャラの枠線、文字色で定義済みの色を使用する
export const USE_CHARA_BORDER_COLOR_AND_FONT_COLOR_FROM_PRESET = true

// キャラの色をVuetify風の色合いにする
export const SET_CHARA_COLOR_AS_VUETIFY_COLOR = false

// コンテンツのカードをフラットスタイルにするか
export const USE_FLAT_CONTENTS_CARD_STYLE = true

// PC環境で横メニューを使用
export const USE_LEFT_NAVIGATION_AT_PC = false

// お気に入りアイコンに星を使用する
export const USE_STAR_FOR_FAVORITE_ICON = true

// カテゴリのChipをVuetifyのv-chipにする
export const USE_V_CHIP_FOR_CATEGORY = true

// PC環境でトップページにタグを表示する
export const SHOW_TAGS_IN_INDEX_AT_PC = false

// モバイル環境でトップページにタグを表示する
export const SHOW_TAGS_IN_INDEX_FOR_MOBILE = false

// モバイル環境の台本フルスクリーン時、ヘッダを表示する
export const SHOW_HEADER_IN_SCRIPT_FULLSCREEN_FOR_MOBILE = false

// トップページに背景画像を表示する
export const SHOW_LIST_ITEM_BG_IMAGE_IN_INDEX = false

// キャラ名の背景色が濃い場合、キャラ名を白抜きにする
export const CHANGE_CHARA_NAME_FONT_COLOR_TO_WHITE = false

// キャラ名の背景色が濃い場合、透明度を上げる
export const ADD_OPACITY_TO_CHARA_BG_COLOR_IF_BLIGHT = true

// キャラの背景色が選択肢の候補にない場合、背景色を再設定する
export const REPLACE_CHARA_BG_COLOR_TO_DEFAULT_ITEMS = true

// PCとモバイルでのヘッダを切り替える
export const CHANGE_HEADER_FOR_MOBILE = true

// PC環境で通知アイコンをヘッダに表示する
export const SHOW_NOTIFICATION_ICON_TO_HEADER_AT_PC = true

// モバイル環境で通知アイコンをヘッダに表示する
export const SHOW_NOTIFICATION_ICON_TO_HEADER_AT_MOBILE = false

// モバイル環境にて、台本詳細閲覧時にヘッダ非表示
export const HIDE_HEADER_ON_SCRIPT_DETAIL_FOR_MOBILE = false

// ログインアイコンをヘッダに表示する
export const SHOW_USER_ICON_TO_HEADER = false

// 検索アイコンをヘッダに表示する
export const SHOW_SEARCH_ICON_TO_HEADER = true

// 台本を2回に分けて取得する
export const FETCH_ALL_SCRIPTS_TWICE = true

// 台本のお気に入り数を表示
export const SHOW_SCRIPT_FAVORITE_COUNT = false

// 検索後の待機秒数 （ms）
export const SEARCH_WAIT_MSEC = 100

// モバイルでトップページに表示するタグの最大数
export const MAX_TAGS_IN_INDEX_FOR_MOBILE = 2

//======================================================
// 動作切り替え用（デバッグ用）
//======================================================

// タグをランダムにセット（デバッグ）
export const SET_RANDOM_TAGS_FOR_DEBUG = false

//======================================================
// フロントページURL
//======================================================

// 台本一覧ページ 
export const PAGE_NAME_SCRIPTS = '/'
// 台本詳細ページ
//export const PAGE_NAME_SCRIPT_DETAIL = '/scriptDetail'
// 台本投稿フォーム
export const PAGE_NAME_SCRIPT_EDIT_FORM = '/scriptEditForm'
// 利用規約ページ
export const PAGE_NAME_TERMS = '/terms'
// Aboutページ
export const PAGE_NAME_ABOUT = '/about'
// ユーザページ
export const PAGE_NAME_USER_DETAIL = '/userDetail'
// フォロー一覧
export const PAGE_NAME_FOLLOWS = '/follows'
// フォロワー一覧
export const PAGE_NAME_FOLLOWERS = '/followers'
// ミュート一覧
export const PAGE_NAME_MUTES = '/mutes'
// ユーザ編集フォーム
export const PAGE_NAME_USER_EDIT_FORM = '/userEditForm'
// 違反報告フォーム
export const PAGE_NAME_REPORT_EDIT_FORM = '/reportEditForm'
// ログインページ
export const PAGE_NAME_LOGIN = '/login'

//======================================================
// API（バックエンドPHP）
//======================================================

// APIエンドポイント CSRFトークン取得
export const API_URL_GET_GENERATE_CSRF_TOKEN = ''

export const API_URL_POST_CHECK_CSRF_TOKEN = ''

// APIエンドポイント 対象ユーザをTwitterIDで検索
export const API_URL_GET_READ_USER = ''
// APIエンドポイント 対象ユーザをTwitterIDで検索
export const API_URL_GET_READ_USER_BY_TWITTER_USER_ID = ''
// APIエンドポイント 対象ユーザをTwitterID、screenNameで検索
export const API_URL_GET_READ_USER_BY_TWITTER_USER_ID_AND_SCREEN_NAME = ''
// APIエンドポイント 対象ユーザをGoogleIDで検索
export const API_URL_GET_READ_USER_BY_GOOGLE_USER_ID = ''
// APIエンドポイント 対象ユーザをGoogleID、mailaddressで検索
export const API_URL_GET_READ_USER_BY_GOOGLE_USER_ID_AND_MAIL_ADDRESS = ''
// APIエンドポイント 対象ユーザを台本、フォロー情報とともに取得
export const API_URL_GET_READ_USER_WITH_SCRIPTS_AND_FOLLOWS = ''
// APIエンドポイント ユーザ作成
export const API_URL_POST_CREATE_USER = ''
// APIエンドポイント ユーザ更新
export const API_URL_POST_UPDATE_USER = ''
// APIエンドポイント ユーザの通知閲覧日時更新
export const API_URL_POST_UPDATE_USER_NOTIFY_PAGE_WATCH_DATE = ''
// APIエンドポイント ユーザのボイストランドユーザID更新
export const API_URL_POST_UPDATE_USER_VOICETOLAND_USER_ID = ''

// APIエンドポイント 台本一覧取得
export const API_URL_GET_READ_ALL_SCRIPTS = ''
// APIエンドポイント 対象IDの台本
export const API_URL_GET_READ_SCRIPT = ''
// APIエンドポイント 対象TwitterIDのユーザの台本一覧
export const API_URL_GET_READ_SCRIPT_BY_TWITTER_ID = ''
// APIエンドポイント 台本検索
export const API_URL_POST_SEARCH_SCRIPT = ''
// APIエンドポイント 台本新規投稿
export const API_URL_POST_CREATE_SCRIPT = ''
// APIエンドポイント 台本更新
export const API_URL_POST_UPDATE_SCRIPT = ''
// APIエンドポイント 台本の閲覧数更新
export const API_URL_POST_UPDATE_SCRIPT_WATCH_COUNT = ''
// APIエンドポイント 台本削除
export const API_URL_POST_DELETE_SCRIPT = ''
// APIエンドポイント 台本を作者名、パスワードから紐づけ
export const API_URL_POST_LINK_SCRIPTS_FROM_NAME_AND_PASSWORD = ''

// APIエンドポイント 対象ユーザの台本お気に入り取得
export const API_URL_GET_READ_SCRIPT_FAVORITE_BY_USER_ID = ''
// APIエンドポイント 台本お気に入り追加
export const API_URL_POST_CREATE_SCRIPT_FAVORITE = ''
// APIエンドポイント 台本お気に入り削除
export const API_URL_POST_DELETE_SCRIPT_FAVORITE = ''

// APIエンドポイント 対象台本のコメント取得
export const API_URL_GET_READ_COMMENT_BY_SCRIPT_ID = ''
// APIエンドポイント コメント投稿
export const API_URL_POST_CREATE_COMMENT = ''
// APIエンドポイント コメント更新
export const API_URL_POST_UPDATE_COMMENT = ''
// APIエンドポイント コメント削除
export const API_URL_POST_DELETE_COMMENT = ''

// APIエンドポイント 対象ユーザがフォローしているユーザ取得
export const API_URL_GET_READ_FOLLOW_USERS_BY_TARGET_USER = ''
// APIエンドポイント 対象ユーザをフォローしているユーザ取得
export const API_URL_GET_READ_FOLLOWING_USERS_FOR_TARGET_USER = ''
// APIエンドポイント フォロー追加
export const API_URL_POST_CREATE_FOLLOW = ''
// APIエンドポイント フォロー削除
export const API_URL_POST_DELETE_FOLLOW = ''

// APIエンドポイント 対象ユーザがミュートしているユーザ取得
export const API_URL_GET_READ_MUTE_USERS_BY_TARGET_USER = ''
// APIエンドポイント ミュート追加
export const API_URL_POST_CREATE_MUTE = ''
// APIエンドポイント ミュート削除
export const API_URL_POST_DELETE_MUTE = ''

// APIエンドポイント 画像アップロード ユーザ画像アップロード
export const API_URL_POST_UPLOAD_USER_IMAGE = ''

// APIエンドポイント 対象ユーザに対する通知を取得
export const API_URL_GET_READ_NOTIFICATIONS_FOR_TARGET_USER = ''
// APIエンドポイント 通知追加
export const API_URL_POST_CREATE_NOTIFICATION = ''
// APIエンドポイント フォロワー宛に通知追加
export const API_URL_POST_CREATE_NOTIFICATION_FOR_FOLLOWERS = ''

// APIエンドポイント 通報一覧を取得
export const API_URL_GET_READ_REPORTS = ''
// APIエンドポイント 通報追加
export const API_URL_POST_CREATE_REPORT = ''

// APIエンドポイント ユーザ設定作成、更新
export const API_URL_POST_CREATE_USER_SETTING = ''

// APIエンドポイント Cookie 過去の投稿パスワード取得
export const API_URL_GET_COOKIE_PAST_INPUT_PASSWORD = ''

//======================================================
// API（バックエンド認証）
//======================================================

// APIエンドポイント Twitterログイン
export const API_URL_TWITTER_LOGIN = ''
// APIエンドポイント Googleログイン
export const API_URL_GOOGLE_LOGIN = ''

//======================================================
// URLクエリキー
//======================================================

// TwitterID
export const URL_QUERY_KEY_TWITTER_USER_ID_STR = 'twitterUserIdStr'
// GoogleID
export const URL_QUERY_KEY_GOOGLE_USER_ID_STR = 'googleUserIdStr'
// TwitterScreenName
export const URL_QUERY_KEY_TWITTER_SCREEN_NAME = 'twitterScreenName'
// 台本ID
export const URL_QUERY_KEY_SCRIPT_ID = 'sid'
// ユーザID
export const URL_QUERY_KEY_USER_ID = 'uid'
// limit
export const URL_QUERY_KEY_LIMIT = 'limit'
// offset
export const URL_QUERY_KEY_OFFSET = 'offset'
// 検索中か
export const URL_QUERY_KEY_SEARCH = 'search'
// 検索タグ
export const URL_QUERY_KEY_TAG = 'tag'
// 検索キーワード
export const URL_QUERY_KEY_SEARCH_WORD = 'searchWord'
// FromUserPage
export const URL_QUERY_KEY_FROM_USER_PAGE = 'fromUserPage'
// ボイストランドユーザID
export const URL_QUERY_KEY_VOICETOLAND_USER_ID = 'voicetolandUserId'
// redirectUrl
export const URL_QUERY_KEY_CALLBACK_URL = 'callbackUrl'

// メールアドレス
export const URL_QUERY_KEY_MAIL_ADDRESS = 'mailAddress'
// displayName
export const URL_QUERY_KEY_DISPLAY_NAME = 'displayName'
// photoUrl
export const URL_QUERY_KEY_PHOTO_URL = 'photoUrl'

//======================================================
// URLクエリの値
//======================================================

// 検索中とみなす値
export const URL_QUERY_VAL_TRUE = 'true'

//======================================================
// シェア用リンク
//======================================================

// 台本シェア用リンクのベースURL。後ろに台本IDを付与する
export const SCRIPT_SHARE_BASE_URL = ''
// ユーザシェア用リンクのベースURL。後ろにユーザIDを付与する
export const USER_SHARE_BASE_URL = ''
// Xシェア用リンクのベースURL
export const X_BASE_URL = "https://x.com/intent/tweet?url='"

//======================================================
// POST フォームデータ
//======================================================

// POSTフォームデータのキー file
export const POST_FORM_DATA_KEY_FILE = 'file'
// POSTフォームデータのキー userName
export const POST_FORM_DATA_KEY_USER_NAME = 'userName'

//======================================================
// HTTPヘッダ
//======================================================

// Content-Type
export const HTTP_HEADER_KEY_CONTENT_TYPE = 'Content-Type'
// CSRFトークン
export const HTTP_HEADER_KEY_CSRF_TOKEN = 'X-Csrf-Token'
// セッションID
export const HTTP_HEADER_KEY_SESSION_ID = 'X-Session-ID'
// ユーザID
export const HTTP_HEADER_KEY_USER_ID = 'X-User-ID'
// UUID
export const HTTP_HEADER_KEY_UUID = 'X-Uuid'
// オリジン
export const HTTP_HEADER_KEY_ORIGIN = 'Origin'

//======================================================
// Cookie
//======================================================

// Cookieの保存秒数
export const COOKIE_SAVE_SEC = 86400 * 700

// Cookie Key TwitterユーザID（文字列）
export const COOKIE_KEY_TWITTER_USER_ID_STR = 'voice_script_twitter_user_id_str'
// Cookie Key GoogleユーザID（文字列）
export const COOKIE_KEY_GOOGLE_USER_ID_STR = 'voice_script_google_user_id_str'
// Cookie Key 台本の並び順
export const COOKIE_KEY_SCRIPT_ORDER = 'scriptOrder'

// Cookie Key フォントサイズ
export const COOKIE_KEY_FONT_SIZE = 'fontSize'
// Cookie Key 背景画像を非表示にするか
export const COOKIE_KEY_HIDE_SCRIPT_BG_IMAGE = 'hideScriptBgImage'

// Cookie Key フルスクリーン時の背景画像
export const COOKIE_KEY_FULLSCREEN_BG_IMAGE = 'fullscreenBgImage'
// Cookie 値 フルスクリーン時の背景画像 イラスト画像
export const COOKIE_VAL_FULLSCREEN_BG_IMAGE_ILLUST = 'illust'
// Cookie 値 フルスクリーン時の背景画像 シンプル
export const COOKIE_VAL_FULLSCREEN_BG_IMAGE_SIMPLE = 'simple'
// Cookie 値 フルスクリーン時の背景画像 なし
export const COOKIE_VAL_FULLSCREEN_BG_IMAGE_NONE = 'none'

//======================================================
// HTMLヘッダ
//======================================================

// 共通で使用するHTMLメタタグ
export const COMMON_META_TAGS = [
  { property: 'og:description', content: '声劇用の台本を投稿できるサイトです。台本の投稿と閲覧はどなたでも無料でご利用いただけます。台本は縦書き、横書きの切替可。役名の色分け機能あり。' },
  { property: 'og:image', content: 'https://taltal3014.lsv.jp/fuelphp/public/assets/img/fox_mini.png' },
  { property: 'twitter:image', content: 'https://taltal3014.lsv.jp/web-app/public/img/logo/fox.png' },
]

//======================================================
// デバッグ用のユーザ
//======================================================

// ローカルでログインした際のデバッグ用のGoogleユーザID
export const DEBUG_GOOGLE_USER_ID_STR = 'hJXpqjHnNceMSljzKPmRcGSIvql2'


//======================================================
// メニューアイテム
//======================================================

// ヘッダのナビゲーションアイテム
export interface MenuItem {
  title: string
  link: string
  icon: string
  color: string
}

// メニューアイテム 新着通知 
export const MENU_ITEM_NOTIFICATION: MenuItem =
  { title: '新着通知', link: '', icon: 'mdi-information-box-outline', color: 'grey-darken-2' }

// メニューアイテム マイページ
export const MENU_ITEM_MY_PAGE: MenuItem =
  { title: 'マイページ', link: PAGE_NAME_USER_DETAIL, icon: 'mdi-account', color: '' }

// メニューアイテム ミュート・フォロー整理
export const MENU_ITEM_MUTE_FOLLOW: MenuItem =
  { title: 'ミュート・フォロー整理', link: '', icon: 'mdi-file-edit-outline', color: '' }

// メニューアイテム ミュート整理
export const MENU_ITEM_MUTE: MenuItem =
  { title: 'ミュート整理', link: '', icon: 'mdi-cancel', color: '' }

// メニューアイテム プロフィール編集
export const MENU_ITEM_EDIT_PROFILE: MenuItem =
  { title: 'プロフィール編集', link: '', icon: 'mdi-pencil', color: '' }

// メニューアイテム フォロー整理
export const MENU_ITEM_FOLLOW: MenuItem =
  { title: 'フォロー整理', link: '', icon: 'mdi-account', color: '' }

// メニューアイテム 台本一覧を共有
export const MENU_ITEM_USER_SHARE: MenuItem =
  { title: 'プロフィールページをXに共有', link: '', icon: 'mdi-alpha-x-box', color: '' }

// メニューアイテム 設定
export const MENU_ITEM_CONFIG: MenuItem =
  { title: '設定', link: '', icon: 'mdi-cog-outline', color: 'grey-darken-2' }

// メニューアイテム 投稿済台本紐づけ
export const MENU_ITEM_LINK_SCRIPT: MenuItem =
  { title: '投稿済台本紐づけ', link: '', icon: 'mdi-link', color: '' }

// メニューアイテム ログイン
export const MENU_ITEM_LOGIN: MenuItem =
  { title: 'ログイン', link: PAGE_NAME_LOGIN, icon: 'mdi-login-variant', color: '' }

// メニューアイテム ログアウト 
export const MENU_ITEM_LOG_OUT: MenuItem =
  { title: 'ログアウト', link: '', icon: 'mdi-logout', color: '' }

// メニューアイテム 違反報告 
export const MENU_ITEM_REPORT: MenuItem =
  { title: '違反報告', link: '', icon: 'mdi-alert-circle', color: '' }

// コメント用のメニューのアイテム（編集）
export const MENU_ITEM_COMMENT_EDIT: MenuItem =
  { title: '編集', link: '', icon: 'mdi-pen', color: 'warning' }

// コメント用のメニューのアイテム（削除）
export const MENU_ITEM_COMMENT_DELETE: MenuItem =
  { title: '削除', link: '', icon: 'mdi-delete', color: 'error' }

// コメント用のメニューのアイテム（返信）
export const MENU_ITEM_COMMENT_REPLY: MenuItem =
  { title: '返信', link: '', icon: 'mdi-message-reply-text', color: 'success' }

//======================================================
// メニューアイテムのリスト
//======================================================

// トップページのナビゲーションアイテム
export const NAVI_MENU_ITEM_TOP: MenuItem =
  { title: '台本一覧', link: '/', icon: 'mdi-book-open-page-variant', color: 'blue-lighten-3' }

// 台本投稿ページのナビゲーションアイテム
export const NAVI_MENU_ITEM_SCRIPT_EDIT_FORM: MenuItem =
  { title: '台本投稿', link: PAGE_NAME_SCRIPT_EDIT_FORM, icon: 'mdi-pencil', color: 'green-lighten-2' }

// aboutページのナビゲーションアイテム
export const NAVI_MENU_ITEM_ABOUT: MenuItem =
  { title: 'ABOUT', link: PAGE_NAME_ABOUT, icon: 'mdi-help-circle', color: 'teal-lighten-3' }

// 利用規約ページのナビゲーションアイテム
export const NAVI_MENU_ITEM_TERMS: MenuItem =
  { title: '利用規約', link: PAGE_NAME_TERMS, icon: 'mdi-file-document', color: 'orange-lighten-2' }

// マイページのナビゲーションアイテム
export const NAVI_MENU_ITEM_MY_PAGE: MenuItem =
  { title: 'マイページ', link: PAGE_NAME_USER_DETAIL, icon: 'mdi-account-circle', color: 'red-lighten-3' }


// グローバルナビゲーションのリンクアイテム
export const NAVI_LINK_ITEMS: MenuItem[] = [
  NAVI_MENU_ITEM_TOP,
  NAVI_MENU_ITEM_SCRIPT_EDIT_FORM,
  NAVI_MENU_ITEM_ABOUT,
  NAVI_MENU_ITEM_TERMS,
  NAVI_MENU_ITEM_MY_PAGE,
]

// プロフィールアイコンクリック時のメニュー（ログイン時用）
export const PROFILE_MENU_ITEMS_FOR_LOGINED_WITH_NOT_NOTIFICATION: MenuItem[] = [
  //MENU_ITEM_NOTIFICATION,
  MENU_ITEM_MY_PAGE,
  MENU_ITEM_CONFIG,
]

// プロフィールアイコンクリック時のメニュー（ログイン時用。通知有り）
export const PROFILE_MENU_ITEMS_FOR_LOGINED_WITH_NOTIFICATION: MenuItem[] = [
  MENU_ITEM_NOTIFICATION,
  MENU_ITEM_MY_PAGE,
  MENU_ITEM_CONFIG,
]


// プロフィールアイコンクリック時のメニュー（未ログイン時用）
export const PROFILE_MENU_ITEMS_FOR_NOT_LOGIN: MenuItem[] = [
  MENU_ITEM_LOGIN,
]

// マイページのメニュークリック時のメニューアイテム
export const MY_PAGE_MENU_ITEMS: MenuItem[] = [
  MENU_ITEM_FOLLOW,
  MENU_ITEM_MUTE,
  MENU_ITEM_USER_SHARE,
  MENU_ITEM_LINK_SCRIPT,
  MENU_ITEM_CONFIG,
  MENU_ITEM_LOG_OUT,
]

// 他のユーザページのメニュークリック時のメニューアイテム
export const OTHER_USER_PAGE_MENU_ITEMS: MenuItem[] = [
  MENU_ITEM_USER_SHARE,
  MENU_ITEM_REPORT,
]

// マイページのナビゲーションインデックス
export const HEADER_MY_PAGE_NAVIGATION_INDEX = 4

//======================================================
// ファイルパス、フォルダパス
//======================================================

// 相対パスで取得する際の画像ファイルのフォルダパス
export const IMAGE_R_DIR_PATH_PREFIX = '/img/'
// 相対パスで取得する際のアイコン画像ファイルのフォルダパス
export const IMAGE_ICON_R_DIR_PATH_PREFIX = 'img/icon/'
// 相対パスで取得する際の背景画像ファイルのフォルダパス
export const IMAGE_BG_R_DIR_PATH_PREFIX = '/img/bg/'

// 相対パスで取得する際のシンプルな背景画像ファイルのフォルダパス
export const IMAGE_BG_SIMPLE_R_DIR_PATH_PREFIX = '/img/bg/simple/'

// ユーザ未登録時のデフォルトユーザアイコン
export const DEFAULT_USER_ICON_PATH = IMAGE_ICON_R_DIR_PATH_PREFIX + 'default-user-icon.jpg'

// Xアイコン
export const IMAGE_X_ICON_PATH = IMAGE_ICON_R_DIR_PATH_PREFIX + 'x-logo-black.png'

// フルスクリーン時の背景画像選択用のボタンアイコン
export const IMAGE_FULLSCREEN_IMAGE_SELECT_BUTTON_ICON_PATH = IMAGE_BG_R_DIR_PATH_PREFIX + 'sky-wing-m.jpg'


//======================================================
// 台本一覧ページ
//======================================================

// APIから最初に取得するデータの件数
export const SCRIPTS_FIRST_FETCH_COUNT = 1000
// APIから2度目に取得するデータの件数
export const SCRIPTS_SECOND_FETCH_COUNT = 12000
// APIから一度で取得する際のデータ件数
export const SCRIPTS_ALL_MAX_FETCH_COUNT = 12000

// 一度にロードする台本の数
export const SCRIPTS_LOAD_COUNT = 50

// 並び替えプルダウンの要素 新着順
export const SCRIPT_ORDER_NEW = '新着順'
// 並び替えプルダウンの要素 新着順
export const SCRIPT_ORDER_OLD = '古い順'
// 人気順の際のテキスト
export const SCRIPT_ORDER_POPULAR = '人気順'
// 並び替えプルダウンの要素 ランダム
export const SCRIPT_ORDER_RANDOM = 'ランダム順'

// ソート順プルダウンメニューの要素
export const SCRIPT_ORDER_ITEMS = [
  SCRIPT_ORDER_NEW,
  SCRIPT_ORDER_OLD,
  SCRIPT_ORDER_POPULAR,
  SCRIPT_ORDER_RANDOM,
]

// タブのアイテム（台本一覧）
export const SCRIPT_PAGE_CATEGORY_TAB_ITEMS = [
  'すべて',
  'お気に入り',
  'フォロー中',
  '恋愛',
  'コメディ',
  'ファンタジー',
  'ミステリー',
  'ホラー',
  '時代劇',
  '童話',
  //'BL',
  'その他'
]

// すべてのカテゴリを示すタブ名
export const CATEGORY_ALL = 'すべて'
// 検索結果を示すタブ名
export const CATEGORY_SEARCH_RESULT = '検索結果'
// お気に入りカテゴリを示すタブ名
export const CATEGORY_FAV = 'お気に入り'
// フォロー中カテゴリを示すタブ名
export const CATEGORY_FOLLOWING = 'フォロー中'
// 一覧に表示するタグの最大件数
export const INDEX_SHOW_TAG_MAX_COUNT = 2

//======================================================
// 台本その他
//======================================================

// 背景色が濃い場合の文字
export const SCRIPT_WHITE_COLOR = '#FFFFFF'

// タグの区切り文字
export const SCRIPT_TAG_SPLIT_CHAR = ','

// キャラ名が空白の場合の文字
export const SCRIPT_EMPTY_CHARACTER_NAME_TXT = '　'

// ト書きの先頭に付与する文字列
export const SCRIPT_NARRATION_PREFIX_TXT = '――― '

// ルビの漢字の開始文字
export const SCRIPT_RUBY_BASE_START_CHAR = '＊'
// ルビの漢字の開始文字の代わりになる文字列 *は使えないのでバックスラッシュを付与。実質的に'*''
export const SCRIPT_RUBY_BASE_START_ALTERNATIVE_CHAR = '\\*'
// ルビのふりがなの開始文字
export const SCRIPT_RUBY_START_CHAR = '《'
// ルビのふりがなの終了文字
export const SCRIPT_RUBY_END_CHAR = '》'

// ルビの漢字の開始タグ
export const SCRIPT_RUBY_BASE_START_TAG = '<ruby class=\'ruby-txt\'>'
// ルビのふりがなの開始タグ
export const SCRIPT_RUBY_START_TAG = '<rt>'
// ルビの終了タグ
export const SCRIPT_RUBY_END_TAG = '</rt></ruby>'
// 台本のborderに付与するスタイル。この後に色を付与
export const SCRIPT_BORDER_STYLE_PREFIX = 'solid 1px '

// 台本の分数のMAX
export const SCRIPT_MAX_MINUTES = 90
// 台本の時間の間隔
export const SCRIPT_MINUTES_SPAN = 10
// キャラクターの最大人数
export const SCRIPT_MAX_CHARA_COUNT = 9
// 名前を隠す際の表記
export const HIDE_NAME_LISTNER_TXT = '名無しさん(非表示設定)'
// 台本の分数がマックスの際に付与する文字列
export const SCRIPT_MAX_MINUTES_ADD_TXT = '以上'
// 背景色からどれだけボーダーカラーを濃くするか
export const BORDER_COLOR_DARKEN_AMOUNT = 40
// 背景色からどれだけ文字色を濃くするか
export const FONT_COLOR_DARKEN_AMOUNT = 180
// セリフ分割用の文
export const WORD_SPLIT_CHAR = '：'
// ナレーションのキャラ名
export const NARRATION_CHARA_NAME = '0'
// デフォルトのボーダーカラー
export const DEFAULT_BORDER_COLOR = '999999'
// 台本の時間の単位
export const SCRIPT_TIME_UNIT = '分'
// 時間推定時、1分何文字とみなすか
export const CHAR_COUNT_PER_MINUTE = 300
// タグの連結用テキスト
export const TAG_JOIN_CHAR = ','

// R18台本のキーワード
export const R18_KEYWORD = 'R18'

// R18のキーワード（全角）
export const R18_KEYWORD_ALTERNATIVE = 'Ｒ１８'

// 背景色の明るさが濃い場合の透明度
export const BRIGHT_CHARA_BG_SET_ALPHA = 0.3
// 枠線の色の明るさが濃い場合の透明度
export const BRIGHT_CHARA_BORDER_SET_ALPHA = 0.5

//======================================================
// 台本詳細ページ
//======================================================

// デフォルトで表示する説明文の文字数
export const SCRIPT_DETAIL_DEFAULT_DESCRIPTION_SHOW_LENGTH = 80

// 心の声とみなす末尾の文字
export const SCRIPT_MIND_VOICE_END_CHAR = 'M'

// 心の声とみなす末尾の文字（全角）
export const SCRIPT_MIND_VOICE_END_ALTERNATIVE_CHAR = 'Ｍ'

// コメントの返信の際の先頭文字
export const SCRIPT_COMMENT_REPLY_PREFIX_CHAR = '@'

// タブインデックス 本文
export const SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY = 0
// タブインデックス コメント
export const SCRIPT_DETAIL_TAB_INDEX_COMMENT = 1
// タブインデックス 作者の他作品
export const SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT = 2

// ト書きの先頭に付与する文字列
export const SCRIPT_DETAIL_NARRATION_PREFIX_TXT = '―― '

//======================================================
// 台本投稿フォーム
//======================================================

// v-selectのアイテム
export interface SelectItem {
  title: string,
  value: any,
  icon?: string,
  color?: string,
}

// 時間
export const SCRIPT_POST_SEARCH_FORM_VALS_MINUTES: SelectItem[] = [
  { title: '10分', value: 10 },
  { title: '20分', value: 20 },
  { title: '30分', value: 30 },
  { title: '40分', value: 40 },
  { title: '50分', value: 50 },
  { title: '60分', value: 60 },
  { title: '70分', value: 70 },
  { title: '80分', value: 80 },
  { title: '90分', value: 90 },
]

// 時間の初期値
export const SCRIPT_PORT_FORM_MIN_INIT_VAL = 10

// 演者人数
export const SCRIPT_POST_FORM_VALS_ACTOR_COUNT = [
  { title: '1人用台本', value: 1 },
  { title: '2人用台本', value: 2 },
  { title: '3人用台本', value: 3 },
  { title: '4人用台本', value: 4 },
  { title: '5人用台本', value: 5 },
  { title: '6人用台本', value: 6 },
  { title: '7人用台本', value: 7 },
  { title: '8人用台本', value: 8 },
  { title: '9人用台本', value: 9 },
]

// キャラ人数
export const SCRIPT_POST_FORM_VALS_CHARA_COUNT = [
  { title: '1人', value: 1 },
  { title: '2人', value: 2 },
  { title: '3人', value: 3 },
  { title: '4人', value: 4 },
  { title: '5人', value: 5 },
  { title: '6人', value: 6 },
  { title: '7人', value: 7 },
  { title: '8人', value: 8 },
  { title: '9人', value: 9 },
]

// 兼役有無
export const SCRIPT_POST_FORM_VALS_HAS_DUAL_ROLE = [
  { title: '兼役なし', value: false },
  { title: '兼役あり', value: true },
]

// 男性演者人数
export const SCRIPT_POST_FORM_VALS_MAN_COUNTS = [
  { title: '　男性演者 0人', value: 0 },
  { title: '　男性演者 1人', value: 1 },
  { title: '　男性演者 2人', value: 2 },
  { title: '　男性演者 3人', value: 3 },
  { title: '　男性演者 4人', value: 4 },
  { title: '　男性演者 5人', value: 5 },
  { title: '　男性演者 6人', value: 6 },
  { title: '　男性演者 7人', value: 7 },
  { title: '　男性演者 8人', value: 8 },
  { title: '　男性演者 9人', value: 9 },
]

// 女性演者人数
export const SCRIPT_POST_FORM_VALS_WOMAN_COUNTS = [
  { title: '　女性演者 0人', value: 0 },
  { title: '　女性演者 1人', value: 1 },
  { title: '　女性演者 2人', value: 2 },
  { title: '　女性演者 3人', value: 3 },
  { title: '　女性演者 4人', value: 4 },
  { title: '　女性演者 5人', value: 5 },
  { title: '　女性演者 6人', value: 6 },
  { title: '　女性演者 7人', value: 7 },
  { title: '　女性演者 8人', value: 8 },
  { title: '　女性演者 9人', value: 9 },
]

// 不問演者人数
export const SCRIPT_POST_FORM_VALS_ETC_COUNTS = [
  { title: '　性別不問 0人', value: 0 },
  { title: '　性別不問 1人', value: 1 },
  { title: '　性別不問 2人', value: 2 },
  { title: '　性別不問 3人', value: 3 },
  { title: '　性別不問 4人', value: 4 },
  { title: '　性別不問 5人', value: 5 },
  { title: '　性別不問 6人', value: 6 },
  { title: '　性別不問 7人', value: 7 },
  { title: '　性別不問 8人', value: 8 },
  { title: '　性別不問 9人', value: 9 },
]

// 利用規約
export const SCRIPT_POST_FORM_VALS_POLICIES: SelectItem[] = [
  { title: '非商用利用時は連絡不要', value: '非商用利用時は連絡不要', color: 'green' },
  { title: '商用、非商用共に連絡不要', value: '商用、非商用共に連絡不要', color: 'green' },
  { title: '商用、非商用共に作者へ連絡要', value: '商用、非商用共に作者へ連絡要', color: 'red' },
  { title: '台本説明欄参照', value: '台本説明欄参照', color: 'info' },
]

// 警告をつける利用規約の色
export const SCRIPT_POLICY_WARNING_COLOR = 'red'

// 性別
export const SCRIPT_POST_FORM_VALS_CHARA_SEX = [
  { title: '　男性', value: '男' },
  { title: '　女性', value: '女' },
  { title: '　不問', value: '不問' },
]

// 性別
export const SCRIPT_POST_FORM_VALS_CHARA_SEX_FOR_MOBILE = [
  { title: '男性', value: '男' },
  { title: '女性', value: '女' },
  { title: '不問', value: '不問' },
]

/*
// カラーコード別の文字色
export const SCRIPT_FONT_COLORS = {
  '#e2f2fe': '#00335a',
  '#ffe0e0': '#6a0000',
  '#edf9d7': '#44600b',
  '#fbf8c4': '#4b4700',
}*/

/*
// カラーコード別の枠線の色
export const SCRIPT_BORDER_COLORS = {
  '#e2f2fe': '#8aafcb',
  '#ffe0e0': '#e49292',
  '#edf9d7': '#a2bd6a',
  '#fbf8c4': '#b9b747',
  '#f7eed0': '#c2aa5c',
}*/

// 画像選択用のv-selectの要素
export interface BgImageItem {
  // テキスト    
  title: string,
  // 画像ファイルパス
  path: string
}

// 背景画像の選択肢
export const SCRIPT_POST_FORM_VALS_BG_IMAGE_ITEMS: BgImageItem[] = [
  {
    title: '公園（春）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'sakura-blooming-park-m.jpg'
  },
  {
    title: '公園（春）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'spring-park-shrine-m.jpg'
  },
  {
    title: '公園（夕方）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'park-evening.jpg'
  },
  {
    title: '部屋（シック）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'room-evening-m.jpg'
  },
  {
    title: '部屋（ピンク）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'pink-room.jpg'
  },
  {
    title: '部屋（洋館）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'western-room-m.jpg'
  },
  {
    title: '街（駅前）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'city-station-m.jpg'
  },
  {
    title: 'カフェ',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'cafe-evening-m.jpg'
  },
  {
    title: 'レストラン',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'restaulant-noon-m.jpg'
  },
  {
    title: '学校（音楽室）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'school-music-room-evening-m.jpg'
  },
  {
    title: '学校（教室）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'classroom-noon-m.jpg'
  },
  {
    title: '学校（教室）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'classroom-evening-m.jpg'
  },


  {
    title: 'ホラー（ハロウィン）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'halloween-graveyard-m.jpg'
  },
  {
    title: 'ホラー（洋館外観）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'horror-house-m.jpg'
  },
  {
    title: 'ホラー（夜の公園）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'uta_A_forest_park_with_a_flat_design_serving_as_background_mate_7c8a4803-ba2d-4922-9772-65001864721a.png'
  },
  {
    title: 'ファンタジー（街）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'western-city-evening-m.jpg'
  },
  {
    title: 'ファンタジー（街）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'middle-eastern-city-m.jpg'
  },
  {
    title: 'ファンタジー（魔法陣）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'magic-circle-room-m.jpg'
  },
  {
    title: 'ファンタジー（宮殿）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'western-house-living-m.jpg'
  },
  {
    title: 'ファンタジー（城）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'middle-eastern-castle-m.jpg'
  },
  {
    title: 'ファンタジー（教会）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'aura-church-m.jpg'
  },
  {
    title: 'ファンタジー（海賊船）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'pirate-ship-m.jpg'
  },
  {
    title: 'ファンタジー（魔女の部屋）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'witch-interior-m.jpg'
  },
  {
    title: 'ファンタジー（魔女の家）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'witch-exterior-m.jpg'
  },
  {
    title: '童話（洋館）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'fairytale_house.jpg'
  },

  {
    title: '童話（森）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'forest-noon-m.jpg'
  },
  {
    title: '和風（街）',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'edo-m.jpg'
  },
  {
    title: '秋の街',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'fall-city-m.jpg'
  },
  {
    title: '雲海',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'sea-of-cloud-m.jpg'
  },
  {
    title: '雪原',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'snow-forest-m.jpg'
  },

  {
    title: '神秘的な谷',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'vast-wilderness-m.jpg'
  },
  {
    title: '青い海',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'blue-sea-m.jpg'
  },
  {
    title: '草原',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'sky-country-m.jpg'
  },
  {
    title: '草原',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'bluesky-glassland-m.jpg'
  },
  {
    title: '青空',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'blue-purple-sky-m.jpg'
  },
  {
    title: '夜空',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'star-night-m.jpg'
  },
  {
    title: '星空に舞う羽',
    path: IMAGE_BG_R_DIR_PATH_PREFIX + 'sky-wing-m.jpg'
  },
]

// 年齢制限の選択肢
export const FORM_VALS_AGE_LIMIT_ITEMS = [
  { title: '全年齢向け', value: false },
  { title: 'R15（性的表現や暴力を含む）', value: true },
]

// R15の際のテキスト
export const HAS_AGE_LIMIT_TXT = 'R15（性的表現や暴力を含む）'

// 受け付けるファイルの拡張子
export const SCRIPT_FORM_ACCEPT_EXTENSION = '.txt'

// バリデーションNG時に表示する文字列
export const FORM_VALIDATION_NO_INPUT_ERROR_TXT = '　　　　未入力です'

// 台本タグを選択できる個数
export const SCRIPT_POST_FORM_TAG_MAX_SELECT_COUNT = 5

// interface 台本のタグのアイテム
export interface ScriptTagItem {
  // テキスト
  text: string,
  // 値
  color: string,
  // サブカテゴリ
  subCategory: string
}

// タグのカテゴリ
export const SCRIPT_TAG_CATEGORIES = [
  //  '年齢制限',
  '雰囲気',
  '世界観',
  '役柄',
  'R18・BL・GL',
  '台本形式',
]

export const SCRIPT_POST_FORM_VALS_TAG_TEXS: string[] = [
  'R18',
  '朗読',
  'セリフ集',
  'BL',
  'GL',

  'ほのぼの',
  '甘々',
  'シリアス',
  'ダーク',
  'バトル',
  '青春',
  '家族',

  '和風',
  '西洋',
  '異世界',
  'SF',
  '中世',
  '江戸',
  '明治・大正',

  'お嬢様',
  '執事',
  'メイド',
  '殺し屋',
  '幼女',
  '少年',
  'オネエ',
  'おじさん',
  'おばさん'
]

// 台本のタグ
export const SCRIPT_TAG_ITEMS: ScriptTagItem[] = [
  { text: 'R18', color: 'pink', subCategory: 'R18・BL・GL' },
  { text: '朗読', color: '', subCategory: '台本形式' },
  { text: 'セリフ集', color: '', subCategory: '台本形式' },
  { text: '叫びあり', color: '', subCategory: '台本形式' },
  { text: 'アドリブ歓迎', color: '', subCategory: '台本形式' },
  { text: '性別変更可', color: '', subCategory: '台本形式' },

  { text: 'ほのぼの', color: '', subCategory: '雰囲気' },
  { text: '甘々', color: '', subCategory: '雰囲気' },
  { text: '青春', color: '', subCategory: '雰囲気' },
  { text: 'ダーク', color: '', subCategory: '雰囲気' },
  { text: 'シリアス', color: '', subCategory: '雰囲気' },
  { text: 'バトル', color: '', subCategory: '雰囲気' },
  //{ text: '家族', color: '', subCategory: '雰囲気' },

  { text: '西洋', color: '', subCategory: '世界観' },
  { text: '中世', color: '', subCategory: '世界観' },
  { text: '異世界', color: '', subCategory: '世界観' },
  { text: 'SF', color: '', subCategory: '世界観' },
  { text: '和風', color: '', subCategory: '世界観' },
  { text: '戦国・江戸', color: '', subCategory: '世界観' },
  { text: '明治・大正', color: '', subCategory: '世界観' },

  { text: 'お嬢様', color: '', subCategory: '役柄' },
  { text: '執事', color: '', subCategory: '役柄' },
  { text: 'メイド', color: '', subCategory: '役柄' },
  { text: '殺し屋', color: '', subCategory: '役柄' },
  { text: '幼女', color: '', subCategory: '役柄' },
  { text: '少年', color: '', subCategory: '役柄' },
  { text: 'おっさん', color: '', subCategory: '役柄' },
  { text: 'おばちゃん', color: '', subCategory: '役柄' },
  { text: 'オネエ', color: '', subCategory: '役柄' },

  { text: 'BL', color: '', subCategory: 'R18・BL・GL' },
  { text: 'GL', color: '', subCategory: 'R18・BL・GL' },
]

// R18タグ名
export const TAG_VAL_R18 = 'R18'

// R18のタグの色
export const TAG_COLOR_R18 = 'pink'

// バリデーション用の共通ルール
export const FORM_VALIDATION_RULE = [(v: any) => {
  if (v !== '') {
    return true
  }

  return FORM_VALIDATION_NO_INPUT_ERROR_TXT
},]

//======================================================
// ユーザ編集フォーム
//======================================================

// アップロード可能な最大ファイルサイズ
export const USER_EDIT_FORM_MAX_FILE_SIZE_MB = 2

// フォームのv-selectのアイテム
export interface formSelectItem {
  title: string,
  value: boolean
}

// v-selectの選択肢 Xアカウントを公開するか 
export const USER_POST_FORM_TWITTER_SCREEN_NAME_REVEAL_ITEMS: formSelectItem[] = [
  { title: '公開', value: true },
  { title: '非公開', value: false },
]

//======================================================
// 検索フォーム
//======================================================

// カテゴリ
export const SEARCH_FORM_VALS_CATEGORIES = [
  'すべて',
  '恋愛',
  'コメディ',
  'ミステリー',
  'ファンタジー',
  'ホラー',
  '童話',
  '時代劇',
  'その他',
]

// 演者人数
export const SEARCH_FORM_VALS_ACTOR_COUNTS = [
  '',
  '1人',
  '2人',
  '3人',
  '4人',
  '5人',
  '6人',
  '7人',
  '8人',
  '9人',
]

// 男性演者人数
export const SEARCH_FORM_VALS_MAN_COUNTS = [
  '',
  '男1人',
  '男2人',
  '男3人',
  '男4人',
  '男5人',
  '男6人',
  '男7人',
  '男8人',
  '男9人',
]
// 女性演者人数
export const SEARCH_FORM_VALS_WOMAN_COUNTS = [
  '',
  '女1人',
  '女2人',
  '女3人',
  '女4人',
  '女5人',
  '女6人',
  '女7人',
  '女8人',
  '女9人',
]
// 時間
export const SEARCH_FORM_VALS_MINUTES = [
  '',
  '10分',
  '20分',
  '30分',
  '40分',
  '50分',
  '60分',
  '70分',
  '80分',
  '90分',
]

// 以上、以下
export const SEARCH_FORM_VALS_ABOVE_BELOW = [
  '',
  '以上',
  '以下',
]

// 以上
export const ABOVE_BELOW_ABOVE = '以上'
// 以下
export const ABOVE_BELOW_BELOW = '以下'

//======================================================
// 違反報告フォーム
//======================================================

// タイトルの選択肢
export const REPORT_FORM_VALS_REPORT_TITLES: SelectItem[] = [
  { title: '盗作・著作権侵害', value: '盗作・著作権侵害' },
  { title: '荒らしなどの迷惑行為', value: '荒らしなどの迷惑行為' },
  { title: 'その他', value: 'その他' },
]

//======================================================
// 台本詳細ページ
//======================================================

// 説明文を閉じるボタンのテキスト
export const SCRIPT_DETAIL_CLOSE_DESCRIPTION_BTN_TXT = '▲ 閉じる'

// 説明文を開くボタンのテキスト
export const SCRIPT_DETAIL_OPEN_DESCRIPTION_BTN_TXT = '▼ 全て表示'

// 台本詳細ページのメニューのアイテム
export interface ScriptDetailMenuItem {
  title: string,
  preIcon: string,
  color: string
}

// 台本用のメニューのアイテム 共有
export const SCRIPT_DETAIL_MENU_ITEM_SHARE: ScriptDetailMenuItem =
{
  title: 'Xで共有',
  preIcon: 'mdi-twitter',
  color: 'orange'
}

// 台本用のメニューのアイテム 編集
export const SCRIPT_DETAIL_MENU_ITEM_EDIT: ScriptDetailMenuItem =
{
  title: '台本を編集',
  preIcon: 'mdi-note-edit-outline',
  color: 'success'
}

// 台本用のメニューのアイテム 背景を変更
export const SCRIPT_DETAIL_MENU_ITEM_CHANGE_BG_IMAGE: ScriptDetailMenuItem =
{
  title: '背景変更',
  preIcon: 'mdi-image',
  color: 'teal'
}

// 台本用のメニューのアイテム 台本を縦書き表示
export const SCRIPT_DETAIL_MENU_ITEM_SHOW_BY_VERTICAL: ScriptDetailMenuItem =
{
  title: '台本を縦書き表示',
  preIcon: 'mdi-swap-horizontal',
  color: 'red-lighten-2'
}

// 台本用のメニューのアイテム 台本にコメント
export const SCRIPT_DETAIL_MENU_ITEM_COMMENT: ScriptDetailMenuItem =
{
  title: '台本コメント',
  preIcon: 'mdi-comment-processing-outline',
  color: 'green'
}

// 台本用のメニューのアイテム 作者のプロフィールを表示
export const SCRIPT_DETAIL_MENU_ITEM_AUTHOR_PROFILE: ScriptDetailMenuItem =
{
  title: '作者のプロフィール',
  preIcon: 'mdi-account',
  color: 'blue'
}

// 台本用のメニューのアイテム フォロー
export const SCRIPT_DETAIL_MENU_ITEM_FOLLOW: ScriptDetailMenuItem =
{
  title: '作者をフォロー',
  preIcon: 'mdi-check-circle',
  color: 'success'
}

// 台本用のメニューのアイテム フォロー解除
export const SCRIPT_DETAIL_MENU_ITEM_UN_FOLLOW: ScriptDetailMenuItem =
{
  title: '作者のフォローを解除',
  preIcon: 'mdi-cancel',
  color: 'grey'
}

// 台本用のメニューのアイテム ミュート
export const SCRIPT_DETAIL_MENU_ITEM_MUTE: ScriptDetailMenuItem =
{
  title: '作者をミュート',
  preIcon: 'mdi-volume-mute',
  color: 'orange'
}

// 台本用のメニューのアイテム ミュート解除
export const SCRIPT_DETAIL_MENU_ITEM_UN_MUTE: ScriptDetailMenuItem =
{
  title: '作者のミュートを解除',
  preIcon: 'mdi-block-helper',
  color: 'grey'
}

// 台本用のメニューのアイテム レポート
export const SCRIPT_DETAIL_MENU_ITEM_REPORT: ScriptDetailMenuItem =
{
  title: '違反報告',
  preIcon: 'mdi-alert-circle',
  color: 'grey'
}

// 台本用のメニューのアイテム 台本詳細に戻る
export const SCRIPT_DETAIL_MENU_ITEM_BACK_TO_DETAIL: ScriptDetailMenuItem =
{
  title: '台本詳細に戻る',
  preIcon: 'mdi-arrow-left',
  color: 'grey'
}

// 文字サイズのデフォルトのパーセンテージ
export const SCRIPT_TEXT_FONT_SIZE_DEFAULT_PERCENTAGE = 100

// 文字サイズの拡大、縮小の際の増減量
export const SCRIPT_TEXT_FONT_SIZE_CHANGE_AMOUNT = 5

// 作者の他の作品で最初に表示する最大数
export const SCRIPT_DETAIL_AUTHOR_OTHER_SCRIPTS_MAX_COUNT = 2

// キャラ名がこの文字数以上の場合、フォントサイズを小さくする
export const CHARA_NAME_FONT_SIZE_SMALL_THRESHOLD = 6

//======================================================
// 男女比
//======================================================

// 検索時、男女比のテキストの先頭につける文字列
export const ACTOR_SEX_SUMMARY_PREFIX = '['

// 検索時、男女比のテキストの末尾につける文字列
export const ACTOR_SEX_SUMMARY_POSTFIX = ']'

//======================================================
// 性別
//======================================================

// 男
export const SEX_MALE = '男性'
// 女
export const SEX_FEMALE = '女性'
// 男
export const SEX_ETC = '不問'


//======================================================
// アイコン
//======================================================

// アイコン
export const ICONS = {
  // 男性
  ACTOR_MAN: { name: 'mdi-human-male', color: 'blue-lighten-2' },
  // 女性
  ACTOR_WOMAN: { name: 'mdi-human-male', color: 'pink-lighten-3' },
  // 不問
  ACTOR_ETC: { name: 'mdi-human-male', color: 'teal-lighten-3' },
}

//======================================================
// プロフィール
//======================================================

// Xアカウントのリンクのプレフィックス
export const X_LINK_PREFIX = 'https://x.com/'


//======================================================
// 色の定義
//======================================================

// interface カラーコード （キャラクター用）
export interface CharactorColorCodeItem {
  // 色名
  'name': string,
  // 背景色
  'bgColor': string,
  // 置き換え対象の色名
  'replaceTargetColors': string[]
}

// カラーコード一覧 キャラクター用
export const CHARACTOR_COLOR_CODE_ITEMS: CharactorColorCodeItem[] = [
  // 青
  { 'name': 'blue', 'bgColor': '#e2f2fe', 'replaceTargetColors': ['blue'] },
  // ピンク
  { 'name': 'pink', 'bgColor': '#ffe0e0', 'replaceTargetColors': ['red', 'pink'] },
  // 緑
  { 'name': 'green', 'bgColor': '#edf9d7', 'replaceTargetColors': ['green'] },
  // 黄色
  { 'name': 'yellow', 'bgColor': '#fbf8c4', 'replaceTargetColors': ['yellow', 'amber'] },
  // 茶色
  { 'name': 'brown', 'bgColor': '#F1E8CB', 'replaceTargetColors': ['brown'] },
  // 紫
  { 'name': 'purple', 'bgColor': '#F3E5F5', 'replaceTargetColors': ['purple'] },
  // オレンジ
  { 'name': 'orange', 'bgColor': '#fedbb4', 'replaceTargetColors': ['orange'] },
  // teal
  { 'name': 'cyan', 'bgColor': '#E0F2F1', 'replaceTargetColors': ['cyan'] },
  // グレー
  { 'name': 'grey', 'bgColor': '#dedede', 'replaceTargetColors': ['grey', 'black'] },
  // 白
  { 'name': 'white', 'bgColor': '#ffffff', 'replaceTargetColors': ['white'] },
]

// interface カラーコード
export interface ColorCodeItem {
  // 色名
  name: string,
  // 背景色
  bgColor: string,
  // 枠線の色
  borderColor: string,
  // 文字色
  fontColor: string,
  // 男性向け（自動で適用する場合）
  isForMan?: boolean,
  // 女性向け（自動で適用する場合）
  isForWoman?: boolean,
  // 自動でキャラクターに適用する場合のデフォルトのキャラクターのインデックス
  deafultCharaIndex?: number
}

// カラーコード 赤
export const COLOR_CODE_ITEM_LIGHT_RED: ColorCodeItem = {
  name: 'red',
  bgColor: '#FFEBEE',
  borderColor: '#FFCDD2',
  fontColor: '#FFFFFF', //'#EF5350',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}
/*
// カラーコード 赤（濃いめ）
export const COLOR_CODE_ITEM_DEEP_RED: ColorCodeItem = {
  name: 'red',
  bgColor: '#EF9A9A',
  borderColor: '#EF9A9A',
  fontColor: '#FFFFFF',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}*/

// カラーコード 赤（薄め）
export const COLOR_CODE_ITEM_LIGHT_RED_LIGHTEN: ColorCodeItem = {
  name: 'red',
  bgColor: '#FFEBEE',
  borderColor: '#FFCDD2',
  fontColor: '#EF5350',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}

// カラーコード ピンク色
export const COLOR_CODE_ITEM_PINK: ColorCodeItem = {
  name: 'pink',
  bgColor: '#FCE4EC',
  borderColor: '#F8BBD0',
  fontColor: '#880E4F',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 1
}

// カラーコード 紫
export const COLOR_CODE_ITEM_PURPLE: ColorCodeItem = {
  name: 'purple',
  bgColor: '#F3E5F5',
  borderColor: '#E1BEE7',
  fontColor: '#4A148C',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 4
}

/*
// カラーコード 濃い紫
export const COLOR_CODE_ITEM_DEEP_PURPLE: ColorCodeItem = {
  name: 'deep_purple',
  bgColor: '#EDE7F6',
  borderColor: '#E1BEE7',
  fontColor: '#7E57C2',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}*/

// カラーコード indigo
export const COLOR_CODE_ITEM_INDIGO: ColorCodeItem = {
  name: 'indigo',
  bgColor: '#E8EAF6',
  borderColor: '#C5CAE9',
  fontColor: '#3F51B5',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}

// カラーコード 青
export const COLOR_CODE_ITEM_BLUE: ColorCodeItem = {
  name: 'blue',
  bgColor: '#E3F2FD',
  borderColor: '#BBDEFB',
  fontColor: '#1E88E5',
  isForMan: true,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ライトブルー
export const COLOR_CODE_ITEM_LIGHT_BLUE: ColorCodeItem = {
  name: 'light-blue',
  bgColor: '#E1F5FE',
  borderColor: '#B3E5FC',
  fontColor: '#29B6F6',
  isForMan: true,
  isForWoman: false,
  deafultCharaIndex: 0
}


// カラーコード シアン
export const COLOR_CODE_ITEM_CYAN: ColorCodeItem = {
  name: 'cyan',
  bgColor: '#E0F7FA',
  borderColor: '#ABDCE2',
  fontColor: '#006064',
  isForMan: true,
  isForWoman: false,
  deafultCharaIndex: 6
}

// カラーコード teal（濃い緑）
export const COLOR_CODE_ITEM_TEAL: ColorCodeItem = {
  name: 'teal',
  bgColor: '#E0F2F1',
  borderColor: '#B2DFDB',
  fontColor: '#00695C',
  isForMan: true,
  isForWoman: false,
  deafultCharaIndex: 2
}

// カラーコード グリーン
export const COLOR_CODE_ITEM_GREEN: ColorCodeItem = {
  name: 'green',
  bgColor: '#E8F5E9',
  borderColor: '#A5D6A7',
  fontColor: '#1B5E20',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}

/*
// カラーコード ライトグリーン
export const COLOR_CODE_ITEM_LIGHT_GREEN: ColorCodeItem = {
  name: 'light-green',
  bgColor: '#F1F8E9',
  borderColor: '#C5E1A5',
  fontColor: '#7CB342',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}*/

// カラーコード ライム
export const COLOR_CODE_ITEM_LIME: ColorCodeItem = {
  name: 'lime',
  bgColor: '#F9FBE7',
  borderColor: '#C0CA33',
  fontColor: '#827717',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 7
}

// カラーコード 黄色
export const COLOR_CODE_ITEM_YELLOW: ColorCodeItem = {
  name: 'yellow',
  bgColor: '#fbf8c4',
  borderColor: '#D7CCC8',
  fontColor: '#3E2723',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 3
}

// カラーコード amber（濃いオレンジ）
export const COLOR_CODE_ITEM_ORANGE: ColorCodeItem = {
  name: 'orange',
  bgColor: '#FFECB3',
  borderColor: '#FFD54F',
  fontColor: '#5D4037',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}

// カラーコード 薄いオレンジ
export const COLOR_CODE_ITEM_LIGHT_ORANGE: ColorCodeItem = {
  name: 'light orange',
  bgColor: '#FFF3E0',
  borderColor: '#FFB74D',
  fontColor: '#E65100',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 5
}

// カラーコード ブラウン
export const COLOR_CODE_ITEM_LIGHT_BROWN: ColorCodeItem = {
  name: 'light brown',
  bgColor: '#EFEBE9',
  borderColor: '#D7CCC8',
  fontColor: '#795548',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 8
}

// カラーコード グレー
export const COLOR_CODE_ITEM_GREY: ColorCodeItem = {
  name: 'grey',
  bgColor: '#E0E0E0',
  borderColor: '#BDBDBD',
  fontColor: '#000000',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 8
}

// カラーコード 白
export const COLOR_CODE_ITEM_WHITE: ColorCodeItem = {
  name: 'white',
  bgColor: '#FAFAFA',
  borderColor: '#BDBDBD',
  fontColor: '#333333',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 9
}

// カラーコード ブルーグレー
export const COLOR_CODE_ITEM_DARK_BLUE: ColorCodeItem = {
  name: 'blue grey',
  bgColor: '#C6CFE3',
  borderColor: '#7284B0',
  fontColor: '#060F22',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークレッド
export const COLOR_CODE_ITEM_DARK_RED: ColorCodeItem = {
  name: 'wine red',
  bgColor: '#EEC9C9',
  borderColor: '#C57978',
  fontColor: '#0F0000',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークパープル
export const COLOR_CODE_ITEM_DARK_PURPLE: ColorCodeItem = {
  name: 'deep purple',
  bgColor: '#ECCEE7',
  borderColor: '#C182B9',
  fontColor: '#291D20',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークグリーン
export const COLOR_CODE_ITEM_DARK_GREEN: ColorCodeItem = {
  name: 'dark green',
  bgColor: '#DADFCC',
  borderColor: '#9CA67E',
  fontColor: '#151513',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークビジリアン
export const COLOR_CODE_ITEM_DARK_VIRIDIAN: ColorCodeItem = {
  name: 'viridian',
  bgColor: '#CAE4C5',
  borderColor: '#7BB072',
  fontColor: '#3D453B',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークブルーグレー
export const COLOR_CODE_ITEM_DARK_BLUE_GREY: ColorCodeItem = {
  name: 'dark blue-grey',
  bgColor: '#B0BEC5',
  borderColor: '#7FA1C1',
  fontColor: '#04040D',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

/**
 * カラーコード ベージュ
 */
export const COLOR_CODE_ITEM_BEIGE: ColorCodeItem = {
  name: 'beige',
  bgColor: '#F1E8CB',
  borderColor: '#CFBE85',
  fontColor: '#1A0000',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークブラウン
export const COLOR_CODE_ITEM_DARK_BROWN: ColorCodeItem = {
  name: 'dark brown',
  bgColor: '#EADBCD',
  borderColor: '#D7CCC8',
  fontColor: '#3A322E',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// カラーコード ダークグレー
export const COLOR_CODE_ITEM_DARK_GREY: ColorCodeItem = {
  name: 'dark grey',
  bgColor: '#CCCCCC',
  borderColor: '#AAAAAA',
  fontColor: '#000000',
  isForMan: false,
  isForWoman: false,
  deafultCharaIndex: 0
}

// 旧サイトカラー　ブルー
export const COLOR_CODE_ITEM_PRE_SITE_BLUE: ColorCodeItem = {
  name: 'blue',
  bgColor: '#E2F1FE',
  borderColor: '#ADD1EB',
  fontColor: '#01335A',
  deafultCharaIndex: 0,
}

// 旧サイトカラー　グリーン
export const COLOR_CODE_ITEM_PRE_SITE_GREEN: ColorCodeItem = {
  name: 'yellow green',
  bgColor: '#edf9d7',
  borderColor: '#C5D1AF',
  fontColor: '#2e4209',
  deafultCharaIndex: 1,
}

// 旧サイトカラー　ピンク
export const COLOR_CODE_ITEM_PRE_SITE_PINK: ColorCodeItem = {
  name: 'pink',
  bgColor: '#ffe0e0',
  borderColor: '#edb4b4',
  fontColor: '#9F4949',
  deafultCharaIndex: 2,
}

// 旧サイトカラー　黄色
export const COLOR_CODE_ITEM_PRE_SITE_YELLOW: ColorCodeItem = {
  name: 'yellow',
  bgColor: '#fbf9ce',
  borderColor: '#D7CCC8',
  fontColor: '#4b4700',
  deafultCharaIndex: 3,
}

// 旧サイトカラー　茶色
export const COLOR_CODE_ITEM_PRE_SITE_BROWN: ColorCodeItem = {
  name: 'brown',
  bgColor: '#f7eed0',
  borderColor: '#e7cf80',
  fontColor: '#2f2401',
  deafultCharaIndex: 4,
}

// 旧サイトカラー　紫色
export const COLOR_CODE_ITEM_PRE_SITE_PURPLE: ColorCodeItem = {
  name: 'purple',
  bgColor: '#f4d9fb',
  borderColor: '#e4abf3',
  fontColor: '#35052e',
  deafultCharaIndex: 5,
}

// 旧サイトカラー　オレンジ
export const COLOR_CODE_ITEM_PRE_SITE_ORANGE: ColorCodeItem = {
  name: 'deep orange',
  bgColor: '#FEDBB4',
  borderColor: '#f4cda4',
  fontColor: '#67441F',
  deafultCharaIndex: 6,
}

// 旧サイトカラー　シアン
export const COLOR_CODE_ITEM_PRE_SITE_CYAN: ColorCodeItem = {
  name: 'cyan',
  bgColor: '#e0fcf4',
  borderColor: '#86cebc',
  fontColor: '#00352e',
  deafultCharaIndex: 7,
}

// 旧サイトカラー　グレー
export const COLOR_CODE_ITEM_PRE_SITE_GREY: ColorCodeItem = {
  name: 'grey',
  bgColor: '#e9e9e9',
  borderColor: '#a8a8a8',
  fontColor: '#333333',
  deafultCharaIndex: 8,
}

// 濃い赤
export const COLOR_CODE_ITEM_DEEP_RED: ColorCodeItem = {
  name: 'deep red',
  bgColor: '#F9C6C5',
  borderColor: '#DDA8A7',
  fontColor: '#3F0E0F',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}

// 濃い紫
export const COLOR_CODE_ITEM_DEEP_PURPLE: ColorCodeItem = {
  name: 'deep indigo',
  bgColor: '#C5CAE9',
  borderColor: '#9FA8DA',
  fontColor: '#100E1E',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}

// 濃い青
export const COLOR_CODE_ITEM_DEEP_BLUE: ColorCodeItem = {
  name: 'deep blue',
  bgColor: '#C0E3F4',
  borderColor: '#ABCBDB',
  fontColor: '#000024',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}

// 濃い緑
export const COLOR_CODE_ITEM_DEEP_GREEN: ColorCodeItem = {
  name: 'deep green',
  bgColor: '#D0EAC4',
  borderColor: '#8FC47B',
  fontColor: '#202A1E',
  isForMan: false,
  isForWoman: true,
  deafultCharaIndex: 9
}

// キャラ背景色の選択肢
export const THEME_COLOR_CODE_ITEMS: ColorCodeItem[] = [
  //COLOR_CODE_ITEM_LIGHT_RED,
  COLOR_CODE_ITEM_PINK,
  //COLOR_CODE_ITEM_PRE_SITE_PINK,
  //COLOR_CODE_ITEM_PRE_SITE_PURPLE,
  COLOR_CODE_ITEM_PURPLE,
  COLOR_CODE_ITEM_PRE_SITE_BLUE,
  //COLOR_CODE_ITEM_BLUE,
  //COLOR_CODE_ITEM_CYAN,
  COLOR_CODE_ITEM_TEAL,
  COLOR_CODE_ITEM_GREEN,
  COLOR_CODE_ITEM_PRE_SITE_GREEN,
  COLOR_CODE_ITEM_PRE_SITE_YELLOW,
  //COLOR_CODE_ITEM_LIME,
  COLOR_CODE_ITEM_ORANGE,
  //COLOR_CODE_ITEM_LIGHT_ORANGE,
  COLOR_CODE_ITEM_BEIGE,
  COLOR_CODE_ITEM_LIGHT_BROWN,
  COLOR_CODE_ITEM_GREY,
  COLOR_CODE_ITEM_WHITE,
  COLOR_CODE_ITEM_DEEP_RED,
  COLOR_CODE_ITEM_DEEP_PURPLE,
  COLOR_CODE_ITEM_DEEP_BLUE,
  COLOR_CODE_ITEM_DEEP_GREEN,

  COLOR_CODE_ITEM_PRE_SITE_ORANGE,
  //COLOR_CODE_ITEM_DARK_RED,
  //COLOR_CODE_ITEM_DARK_PURPLE,
  //COLOR_CODE_ITEM_DARK_BLUE,
  COLOR_CODE_ITEM_DARK_GREEN,
  //COLOR_CODE_ITEM_DARK_VIRIDIAN,
  COLOR_CODE_ITEM_DARK_BROWN,
  COLOR_CODE_ITEM_DARK_BLUE_GREY,
]

/*
// カラーコードの選択肢
export const CHARACTOR_COLOR_CODE_ITEMS = [
  '#e2f2fe',
  '#ffe0e0',
  '#edf9d7',
  '#fbf8c4',
  '#f7eed0',
  '#f4d9fb',
  '#fedbb4',
  '#e0fcf4',
  '#dedede',
  '#ffffff',
]*/

// 置き換え対象の色
export interface ReplaceTargetColor {
  bgColor: string,
  replaceColorCodeItem: ColorCodeItem,
}

// 置き換え対象の色
export const REPLACE_TARGET_COLORS: ReplaceTargetColor[] = [
  // 赤
  { bgColor: '#FCE4EC', replaceColorCodeItem: COLOR_CODE_ITEM_PRE_SITE_PINK },
  // 青
  { bgColor: '#e2f2fe', replaceColorCodeItem: COLOR_CODE_ITEM_PRE_SITE_BLUE },
  // 紫
  { bgColor: '#f4d9fb', replaceColorCodeItem: COLOR_CODE_ITEM_PRE_SITE_PURPLE },
  // 薄い緑
  { bgColor: '#F9FBE7', replaceColorCodeItem: COLOR_CODE_ITEM_GREEN },
  // 緑
  //{ bgColor: '#edf9d7', replaceColorCodeItem: COLOR_CODE_ITEM_GREEN },
  // ピンク
  //{ bgColor: '#ffe0e0', replaceColorCodeItem: COLOR_CODE_ITEM_PRE_SITE_PINK },
  // teal
  { bgColor: '#e0fcf4', replaceColorCodeItem: COLOR_CODE_ITEM_TEAL },
  // cyan
  { bgColor: '#E0F7FA', replaceColorCodeItem: COLOR_CODE_ITEM_TEAL },
  // 黄色
  { bgColor: '#fbf8c4', replaceColorCodeItem: COLOR_CODE_ITEM_YELLOW },
]

//======================================================
// 台本カテゴリ
//======================================================

// 台本カテゴリアイテム
export interface ScriptCategoryItem {
  name?: string,
  bgImageName?: string,
  bgSimpleImageName?: string,
  thumImageName?: string,
  colorCodeItem?: ColorCodeItem,
  color?: string,
  bgColor?: string,
  fontColor?: string,
  borderColor?: string,
}

// 台本カテゴリ
export const SCRIPT_CATEGORIES: ScriptCategoryItem[] = [
  { name: '恋愛', bgImageName: 'sakura-blooming-park-m.jpg', bgSimpleImageName: 'simple-green.jpg', color: 'red', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_LIGHT_RED_LIGHTEN },
  { name: 'コメディ', bgImageName: 'school-noon-m.jpg', bgSimpleImageName: 'simple-green.jpg', color: 'green', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_LIGHT_ORANGE },
  { name: 'ファンタジー', bgImageName: 'aura-church-m.jpg', bgSimpleImageName: 'simple-green.jpg', color: 'blue', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_BLUE },
  { name: 'ホラー', bgImageName: 'halloween-graveyard-m.jpg', bgSimpleImageName: 'simple-dark.jpg', color: 'purple', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_INDIGO },
  { name: 'ミステリー', bgImageName: 'magic-circle-room-m.jpg', bgSimpleImageName: 'simple-blue-green.jpg', color: 'orange', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_LIME },
  { name: '童話', bgImageName: 'forest-noon-m.jpg', bgSimpleImageName: 'simple-yellow-blur.jpg', color: 'brown', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_LIGHT_BROWN },
  { name: '時代劇', bgImageName: 'edo-m.jpg', bgSimpleImageName: 'simple-orange.jpg', color: 'success', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_TEAL },
  { name: 'その他', bgImageName: 'sky-country-m.jpg', bgSimpleImageName: 'simple-green.jpg', color: 'teal', colorCodeItem: CONSTANTS.COLOR_CODE_ITEM_GREEN },
]

//======================================================
// お気に入りボタン
//======================================================

// お気に入りボタンを10秒間に何回までクリックできるか
export const FAVORITE_BUTTON_CLICK_LIMIT = 10

//======================================================
// トップページ用のお知らせメッセージ
//======================================================

// 台本へのコメント時のメッセージ。{user}にはユーザ名、{title}にはタイトルが入る
export const TOP_PAGE_MSG_COMMENT_FOR_SCRIPT_COMMENT = 'さんが「{title}」にコメントしました。'
// コメント返信時のメッセージ。{user}にはユーザ名、{title}にはタイトルが入る
export const TOP_PAGE_MSG_COMMENT_FOR_REPLY_COMMENT = 'さんがあなたのコメントに返信しました。'
// 台本投稿時のメッセージ。{user}にはユーザ名、{title}にはタイトルが入る
export const TOP_PAGE_MSG_COMMENT_FOR_SCRIPT_POST = 'さんが新作台本「{title}」を投稿しました。'
// フォロー時のメッセージ
export const TOP_PAGE_MSG_COMMENT_FOR_FOLLOW = 'さんにフォローされました。'
// お知らせの中のユーザ名のキーワード
export const TOP_PAGE_MSG_USER_NAME_KEYWORD = '{user}'
// お知らせの中の台本名のキーワード
export const TOP_PAGE_MSG_SCRIPT_NAME_KEYWORD = '{title}'

//======================================================
// メッセージ
//======================================================

// 台本削除確認メッセージのプレフィックス
export const CONFIRM_MSG_DELETE_SCRIPT_PREFIX = '投稿済みの台本『'
// 台本削除確認メッセージのポストフィックス
export const CONFIRM_MSG_DELETE_SCRIPT_POSTFIX = '』を削除します。この操作は取り消せません。よろしいですか？'
// 違反報告時の確認メッセージ
export const CONFIRM_MSG_REPORT = 'このユーザについての違反報告を行います。よろしいですか？<br /><br />※利用規約違反や迷惑行為、盗作などに該当すると思われる場合に報告をお願いいたします。'
// 違反報告完了後のメッセージ
export const INFO_MSG_REPORT_DONE = '違反報告を受け付けました。<br />管理者側で内容精査後、実際に問題が確認できましたら適切な対処をさせていただきます。'

// 初回ログイン時の台本紐づけ確認用のメッセージ
export const CONFIRM_MSG_FIRST_LOGIN_LINK_SCRIPTS = 'ユーザ登録が完了しました。<br /><br />続けて、過去に「声劇台本置き場」に投稿した台本をこのアカウントに紐づけますか？ <br /><br />※台本を投稿したことがある場合、「OK」を選択して下さい。'
// 台本紐づけ失敗時のエラーメッセージ
export const ERROR_MSG_FAIL_LINK_SCRIPTS = '台本の紐づけでエラーが発生しました。作者名、パスワードが正しいか確認してください。'
// OKダイアログでエラーアイコンを表示する際のキーワード。メッセージに含まれる場合、エラーアイコンを表示
export const OK_DIALOG_SHOW_ERROR_ICON_KEYWORD = 'エラー'
// Xアカウントで初回ログインした際、XアカウントIDを変更した際のメッセージ
export const ERROR_MSG_WHEN_X_ACCOUNT_ID_CHANGED_IN_FIRST_LOGIN = 'Xでログインした場合、初回のプロフィール登録時にはXアカウントを変更できません。変更したい場合は、プロフィール登録が完了した後にマイページのプロフィール編集から変更を行って下さい。'

// お気に入りボタンが連打された場合のエラーメッセージ
export const ERROR_MSG_FAVORITE_BUTTON_MANY_CLICK = 'お気に入りボタンの連打はサーバに負荷がかかるのでおやめください🙇‍♂'

// 台本投稿エラー時のメッセージ
export const ERROR_MSG_SCRIPT_POST = '台本の投稿に失敗しました。同じタイトルの台本を既に投稿していないか確認して下さい。'

