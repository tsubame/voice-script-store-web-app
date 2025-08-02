//======================================================
//
// API 'xxx'のレスポンスパラメータ
//
//======================================================

import Script from '@/composables/type/script'
import Charactor from '@/composables/type/charactor'
import User from '@/composables/type/user'

/**
 * API 'xxx'のレスポンスパラメータ
 */
export default class PostScriptCreateReqParam {

  // 台本
  script: Script = new Script()
  // キャラクター
  charactors: Charactor[] = []
  // ユーザ
  user: User = new User()

} 
