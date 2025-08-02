//======================================================
//
// PHP API関連のマネージャ　
// ※セキュリティ対策のため、一部を残して空欄化済
//
// [索引]
//  - 1. CSRFトークン
//    - useGetAccessToken
//    - usePostCheckAccessToken
//
//  - 2. ユーザ関連
//    - useGetReadUser
//      対象IDのユーザを取得
//    - useGetReadUserByTwitterUserId
//      対象TwitterIDのユーザを取得
//    - useGetReadUserByTwitterUserIdAndTwitterScreenName
//      対象TwitterID、screenNameのユーザを取得
//    - useGetReadUserByGoogleUserId
//      対象GoogleIDのユーザを取得
//    - useGetReadUserByGoogleUserIdAndMailAddress
//      対象GoogleID、メールアドレスのユーザを取得
//    - useGetReadUserWithScriptsAndFollows
//      対象IDのユーザを台本、フォロー情報と共に取得
//    - usePostCreateUser
//      ユーザを作成
//    - usePostUpdateUser
//      ユーザを更新
//    - usePostUpdateUserNotifyPageWatchDate
//      ユーザの通知閲覧日時を更新
//    - usePostUpdateVoicetolandUserId
//      ユーザのボイストランドユーザIDを更新
//
//  - 3. 台本関連
//    - useGetReadAllScripts()
//      台本一覧を取得
//    - useGetReadScript()
//      対象IDの台本を取得
//    - usePostSearchScript()
//      台本検索
//
//  - 4. 台本お気に入り関連
//    - useGetReadScriptFavoritesByUserid()
//      対象ユーザの台本お気に入りデータ取得
//    - usePostCreateScriptFavorite()
//      お気に入り登録
//    - usePostDeleteScriptFavorite()
//      お気に入り解除
//
//  - 5. コメント関連
//    - useGetReadCommentsByScriptId()
//      対象台本のコメントを取得
//    - usePostCreateComment()
//      コメント投稿
//    - usePostUpdateComment()
//      コメント更新
//    - usePostDeleteComment()
//      コメント削除
//
//  - 6. フォロー関連
//    - useGetReadFollowUsersByUserId()
//      対象ユーザのフォローデータ取得
//    - useGetReadFollowingUsersForTargetUserId()
//      対象ユーザのフォロワーデータ取得
//    - usePostCreateFollow()
//      フォロー登録
//    - usePostDeleteFollow()
//      フォロー解除
//
//  - 7. ミュート関連
//    - useGetReadMutesByUserId()
//      対象ユーザのミュートデータ取得
//    - usePostCreateMute()
//      ミュート登録
//    - usePostDeleteMute()
//      ミュート解除
//
//  - 8. アップロード関連
//    - usePostUploadUserImage()
//      ユーザ画像アップロード
//
//  - 9. 通知関連
//    - useGetReadNotificationsForUserId()
//      対象ユーザの通知データ取得
//    - usePostCreateNotification()
//      通知登録
//    - usePostCreateNotificationsForFollowers()
//      フォロワー宛に通知登録
//
//  - 10. 通報関連
//    - useGetReadAllReports()
//      通報データ取得
//    - usePostCreateReport()
//      通報登録
//
//  - 11. ユーザ設定関連
//    - usePostCreateUserSetting()
//      ユーザ設定を更新
//
//  - 12. Cookie関連
//    - useGetCookiePastInputPassword()
//      Cookieから過去に入力した投稿用パスワード取得
//
//======================================================

import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import * as CONSTANTS from '../etc/constants'
import Script from '@/composables/type/script'
import User from '@/composables/type/user'
import Comment from '@/composables/type/comment'
import Charactor from '@/composables/type/charactor'
import Follow from '@/composables/type/follow'
import Mute from '@/composables/type/mute'
import ScriptFavorite from '@/composables/type/scriptFavorite'
import Notification from '@/composables/type/notification'
import Report from '@/composables/type/report'
import UserSetting from '@/composables/type/userSetting'
import SearchCondition from '@/composables/type/searchCondition'
import AccessToken from '@/composables/type/accessToken'
import PostScriptCreateReqParam from '@/composables/type/apiParam/postScriptCreateReqParam'
import PostScriptUpdateReqParam from '@/composables/type/apiParam/postScriptCreateReqParam'
import PostScriptUpdateWatchCountReqParam from '@/composables/type/apiParam/postScriptUpdateWatchCountReqParam'
import PostScriptDeleteReqParam from '@/composables/type/apiParam/postScriptCreateReqParam'
import PostScriptFavoriteCreateReqParam from '@/composables/type/apiParam/postScriptFavoriteCreateReqParam'
import PostScriptFavoriteDeleteReqParam from '@/composables/type/apiParam/postScriptFavoriteDeleteReqParam'
import PostUserCreateReqParam from '@/composables/type/apiParam/postUserCreateReqParam'
import PostUserCreateResParam from '@/composables/type/apiParam/postUserCreateResParam'
import PostUserUpdateReqParam from '@/composables/type/apiParam/postUserUpdateReqParam'
import PostUserUpdateResParam from '@/composables/type/apiParam/postUserUpdateResParam'
import PostScriptLinkByNameAndPasswordReqParam from '@/composables/type/apiParam/postScriptLinkByNameAndPasswordReqParam'
import PostScriptLinkByNameAndPasswordResParam from '@/composables/type/apiParam/postScriptLinkByNameAndPasswordResParam'
import GetUserByTwitterUserIdResParam from '@/composables/type/apiParam/getUserByTwitterUserIdResParam'
import GetUserByGoogleUserIdResParam from '@/composables/type/apiParam/getUserByGoogleUserIdResParam'
import GetCookiePastInputPasswordResParam from '@/composables/type/apiParam/getCookiePastInputPasswordResParam'
import * as scriptTextManager from '@/composables/util/scriptTextManager';
import { API_URL_GET_READ_USER_BY_TWITTER_USER_ID_AND_SCREEN_NAME, API_URL_GET_READ_USER_BY_GOOGLE_USER_ID_AND_MAIL_ADDRESS, API_URL_POST_UPDATE_USER_VOICETOLAND_USER_ID } from '../etc/constants';

//======================================================
// 定数
//======================================================

// Content-Type
const CONTENT_TYPE_JSON = 'application/json'
// Content-Type
const CONTENT_TYPE_MUTLIPART_FORM_DATA = 'multipart/form-data'
// http satatus ok
const HTTP_STATUS_OK = 200
// http status created
const HTTP_STATUS_CREATED = 201
// http status no content
const HTTP_STATUS_NO_CONTENT = 204

/**
 * インタフェース APIレスポンス
 */
interface ApiResponse {
  success: boolean;
  statuCode?: number; // ステータスコード
  data?: any; // 応答データの型に応じて変更してください
  error?: string; // エラーメッセージ
}

//======================================================
//
// 1. CSRFトークン
//
//======================================================

//======================================================
// useGetAccessToken
//======================================================

/**
 * CSRFトークンを取得
 * 
 * @returns 
 */
export async function useGetAccessToken(): Promise<AccessToken> {
  let accessToken = new AccessToken()

  try {
    // API URLをセット
    const urlPostfix = CONSTANTS.API_URL_GET_GENERATE_CSRF_TOKEN
    // GETリクエスト発行
    const resJson = await getJsonValByFetch(urlPostfix)
    if (resJson) {
      accessToken = plainToInstance(AccessToken, resJson)
    }
  }
  catch (error) {
    console.error(error)
  }

  return accessToken
}

/**
 * Getリクエストを発行し、レスポンスをJSON形式で取得
 * 
 * @param urlPostfix ベースURLを除いたURLポストフィックス
 * @returns エラー時はnull
 */
const getJsonValByFetch = async (urlPostfix: string): Promise<any> => {
  let resJson = null

  try {
    // API URLをセット
    let apiURL = getAPIURLPrefix()
    apiURL += urlPostfix
    console.log('[API接続]' + apiURL)

    const options = {
      method: 'GET',
      headers: {
        [CONSTANTS.HTTP_HEADER_KEY_ORIGIN]: window.location.origin
      }
    }

    // GETリクエスト発行
    const res = await fetch(apiURL, options)
      .catch((error) => {
        console.error(error)
      })

    console.log(res)

    // レスポンスが存在し、ステータスコードが200、204の場合
    if (res && (res.status === HTTP_STATUS_OK)) {
      resJson = await res.json()
    } else if (res && (res.status === HTTP_STATUS_NO_CONTENT)) {
      // 204の場合はnull
      resJson = null
    } else {
      // その他のエラー
      console.error(`Error: ${res ? res.status : 'no response'}`)
    }
  }
  catch (error) {
    console.error(error)
  }

  return resJson
}

/**
 * API URLのプレフィックスをセット
 */
function getAPIURLPrefix() {
  let apiUrlPrefix = ''

  try {
    apiUrlPrefix = useRuntimeConfig().public.PHP_API_URL

    // 末尾が '/' でなければ付与
    if (apiUrlPrefix.slice(-1) !== '/') {
      apiUrlPrefix += '/'
    }
  }
  catch (error) {
    console.error(error)
  }

  return apiUrlPrefix
}

//======================================================
// usePostCheckAccessToken
//======================================================

/**
 * CSRFトークンを検証（デバッグ用）
 * 
 * @returns 
 */
export async function usePostCheckAccessToken(p: AccessToken): Promise<boolean> {
  let res: ApiResponse = { success: false }

  try {
    let aToken = new AccessToken()
    let u = new User()

    // API URLをセット
    const urlPostfix = CONSTANTS.API_URL_POST_CHECK_CSRF_TOKEN
    // POSTリクエスト発行
    res = await postRequestByJson(urlPostfix, p, aToken, u)
  }
  catch (error) {
    console.error(error)
  }

  return res.success
}

/**
 * POSTリクエストを発行し、レスポンスを取得
 * 
 * [HTTPヘッダ]
 * ・Content-Type: application/json
 * ・X-Csrf-Token: CSRFトークン
 * ・X-Session-ID: セッションID
 * ・X-Uuid: UUID
 * ・X-User-Id: ユーザID
 * 
 * @param urlPostfix ベースURLを除いたURLポストフィックス
 * @param p 送信するJSONパラメータ
 * @param accessToken CSRFトークン、セッションID
 * @param u 自分のユーザ情報
 * @returns APIレスポンス
 */
const postRequestByJson = async (urlPostfix: string, p: any, aToken: AccessToken, u: User): Promise<ApiResponse> => {
  let res: ApiResponse = { success: false }

  try {
    // API URLをセット
    let apiURL = getAPIURLPrefix()
    apiURL += urlPostfix
    console.log('[API接続]' + apiURL)
    console.log(p)

    await axios.post(apiURL, p, {
      headers: {
        [CONSTANTS.HTTP_HEADER_KEY_CONTENT_TYPE]: CONTENT_TYPE_JSON,
        [CONSTANTS.HTTP_HEADER_KEY_CSRF_TOKEN]: aToken.csrfToken,
        [CONSTANTS.HTTP_HEADER_KEY_SESSION_ID]: aToken.sessionId,
        [CONSTANTS.HTTP_HEADER_KEY_UUID]: u.uuid,
        [CONSTANTS.HTTP_HEADER_KEY_USER_ID]: u.id,
      }
    })
      .then(response => {
        //console.log(response)
        //console.log(response.data)

        // レスポンスステータスコードをセット
        res.statuCode = response.status

        // 200、201、204ならTrue
        if (response.status === HTTP_STATUS_CREATED || response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_NO_CONTENT) {
          res.success = true
          res.data = response.data
        }
      })
      .catch(error => {
        console.log(error)

        res.success = false
      })
  }
  catch (error) {
    console.error(error)
  }

  return res
}

// ※セキュリティ対策のため以下全て空欄化