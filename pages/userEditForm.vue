<script lang="ts" setup>
//======================================================
//
// userEditForm.vue ユーザ編集フォーム
//
//======================================================

import { reactive, onMounted, ref } from 'vue';
import { useDisplay } from "vuetify";
import axios from 'axios'
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import * as preferenceManager from "@/composables/util/preferenceManager"
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as loginManager from '@/composables/util/loginManager';
import * as scriptStore from '@/store/scriptStore'
import Script from '@/composables/type/script'
import User from '@/composables/type/user'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useAccessTokenStore } from '../store/accessTokenStore';
import { useLoginUserStore } from '../store/loginUserStore';

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({  
  middleware: [
    'login-checker',
    'access-token-checker'
  ]
})


//======================================================
// vars
//======================================================

// フォームの値
const _formVals = reactive({
  // 名前
  name: '',
  // 説明
  description: '',
  // Twitterアカウント
  twitterScreenName: '',
  // Twitterアカウントを公開するか
  revealTwitterScreenName: true,
  // HP URL
  webSiteUrl: '',  
  // タグ
  tags: [],
  // タグテキスト
  tagsTxt: '',
  // プロフィール画像URL
  profileImageUrl: '',
  // 選択された画像ファイル
  selectedImageFile: null as any  
})

// 登録するユーザデータ
const _user = ref<User>(new User())
// 登録実行ボタンを無効化するか（二重クリック防止）
const _isRegisterButtonDisabled = ref(false)
// twitterログインした際のtwitterScreenName
const _loginedTwitterScreenName = ref('')
// 入力フォームバリデーション用定数 
const editForm = ref();

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    // 未ログイン（初回登録の場合、一時ログインユーザをセット）
    if (!useLoginUserStore().hasLogined()) {      
      _user.value = useLoginUserStore().tempUserForRegister
      _formVals.profileImageUrl = _user.value.profileImageUrl
      _formVals.name = _user.value.name
      _formVals.description = _user.value.description
      _formVals.twitterScreenName = _user.value.twitterScreenName
      // Twitterログイン時のtwitterScreenNameをセット
      _loginedTwitterScreenName.value = _user.value.twitterScreenName

      // 画像ファイルが外部URL形式の場合、ダウンロード
      await downloadRemoteServerImage()

      // 一時ログインユーザがセットされていない場合はエラー
      if (_user.value.googleUserIdStr === '' && _user.value.twitterUserIdStr === '') {
        alert('GoogleまたはTwitterでのログインが必要です。')
        navigateTo(CONSTANTS.PAGE_NAME_LOGIN)

        return
      }

      return
    }

    // フォームの初期値を設定
    _formVals.name = loginUserStore.useLoginUserStore().user.name
    _formVals.description = loginUserStore.useLoginUserStore().user.description
    _formVals.twitterScreenName = loginUserStore.useLoginUserStore().user.twitterScreenName
    _formVals.profileImageUrl = loginUserStore.useLoginUserStore().user.profileImageUrl

    if (!loginUserStore.useLoginUserStore().user.revealTwitterScreenName) {
      _formVals.revealTwitterScreenName = false
    } else {
      _formVals.revealTwitterScreenName = true
    }
  } catch (error) {
    console.error(error)
  }
})

/**
 * 画像ファイルが外部URL形式の場合、ダウンロード
 */
const downloadRemoteServerImage = async() => {
  try {
    // APIサーバのURLを含んでいればダウンロードしない
    if (_formVals.profileImageUrl.includes(useRuntimeConfig().public.PHP_API_URL)) {
      return
    } else if (_formVals.profileImageUrl === '') {
      return
    }

    const response = await axios.get(_formVals.profileImageUrl, { responseType: 'blob' });
    const blob = response.data;
    const file = new File([blob], 'downloaded_image.jpg', { type: blob.type });
    _formVals.selectedImageFile = file;

    console.log('リモートサーバの画像ファイルをダウンロード')
  } catch (error) {
    console.error(error)
  }
}


//======================================================
// methods
//======================================================

/**
 * イベント 画像変更ボタンクリック 
 * 　・画像のURLをform要素にセット（画像をプレビュー欄に表示）
 * 　・_state.selectedImageFileに画像をセット
 * 
 * @param event 
 */
function onChangeImageButtonClick(event: any) {
  try {
    // 画像をstateの要素にセット
    _formVals.selectedImageFile = event.target.files[0];
    // 画像のURLをform要素にセット
    _formVals.profileImageUrl = URL.createObjectURL(_formVals.selectedImageFile);
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 登録実行ボタンクリック
 * ・初回登録時、twitterログインを使用した場合はtwitterIDは変更不可
 */
const onSubmitButtonClick = async () => {
  try {
    console.log('onSubmitButtonClick')
    // フォームのバリデーション
    let res = await checkValidation()
    if (!res) {
      return
    }

    // ボタンを無効化
    _isRegisterButtonDisabled.value = true

    // 画像アップロード
    res = await uploadImageFile()
    if (!res) {
      console.error('画像アップロード失敗')    
      //alert('画像アップロードに失敗しました。')
      
      //return
    }

    // ユーザデータをセット。ログインユーザの場合はログインユーザを初期値にセット
    if (useLoginUserStore().hasLogined()) {
      _user.value = useLoginUserStore().user
    }

    // フォームの値でユーザデータを上書き
    _user.value.description = _formVals.description
    _user.value.name = _formVals.name
    _user.value.profileImageUrl = _formVals.profileImageUrl
    _user.value.tagsTxt = _formVals.tags.toString()
    _user.value.revealTwitterScreenName = _formVals.revealTwitterScreenName

    // 初回ログインの場合以外はtwitterIDをセット
    if (useLoginUserStore().hasLogined()) {
      _user.value.twitterScreenName = _formVals.twitterScreenName
    // 初回ログインの場合以外で、googleでログインした場合はtwitterIDにフォームの値をセット
    } else {
      if (useLoginUserStore().googleUserIdStrFetchedFromGoogleLogin !== '') {
        _user.value.twitterScreenName = _formVals.twitterScreenName
      }
    }

    //  _user.value.twitterScreenNameから@を削除
    if (_user.value.twitterScreenName !== '') {
      _user.value.twitterScreenName = _user.value.twitterScreenName.replace('@', '')
      _user.value.twitterScreenName = _user.value.twitterScreenName.replace('＠', '')
    }

    // ユーザを作成
    if (!useLoginUserStore().hasLogined()) {
      res = await createUser()
    // ユーザを編集
    } else {
      res = await updateUser()
    }

    if (res) { 
      // スクロール位置をトップに
      document.documentElement.scrollTop = 0
      // ナビゲーションを移動
      useUiEventStore().uiEvent.headerTabIndex = CONSTANTS.HEADER_MY_PAGE_NAVIGATION_INDEX
      // ユーザ詳細ページに遷移        
      navigateTo(CONSTANTS.PAGE_NAME_USER_DETAIL)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * バリデーションチェック
 * ・名前が入力されていなければNG
 * ・初回登録時、twitterログインを使用した場合はtwitterIDは変更不可
 * 
 * @returns 
 */
const checkValidation = async () => {
  try {
    // フォームのバリデーション
    let res = await editForm.value.validate()
    console.log(res.valid)
    if (!res.valid) {
      return false
    }

    // 画像ファイルの容量が1MB以上ならアップロードしない    
    const imageFileRes = await checkImageFileSize()
    if (!imageFileRes) {
      return false
    }

    // 初回登録時、twitterログインを使用した場合はtwitterIDは変更不可
    if (!useLoginUserStore().hasLogined()) {
      if (useLoginUserStore().twitterUserIdStrFetchedFromTwitterLogin !== '') {
        if (_formVals.twitterScreenName !== _loginedTwitterScreenName.value) {
          alert(CONSTANTS.ERROR_MSG_WHEN_X_ACCOUNT_ID_CHANGED_IN_FIRST_LOGIN)

          // twitterIDを初期値にセット
          _formVals.twitterScreenName = _loginedTwitterScreenName.value

          return false
        }
      }
    }

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}

/**
 * 画像ファイルのサイズチェック
 * 
 * @returns boolean
 */
const checkImageFileSize = () => {
  try {
    if (_formVals.selectedImageFile === null) {
      return true
    }

    // 画像ファイルの容量が1MB以上ならアップロードしない    
    const maxFileSize = 1024 * 1024 * CONSTANTS.USER_EDIT_FORM_MAX_FILE_SIZE_MB
    if (maxFileSize < _formVals.selectedImageFile.size) {
      alert('画像ファイルの容量が大きすぎます。' + CONSTANTS.USER_EDIT_FORM_MAX_FILE_SIZE_MB + 'MB以下の画像を選択してください。')

      return false
    }
  } catch (error) {
    console.error(error)
  }

  return true
}

/**
 * 画像ファイルをアップロード
 */
async function uploadImageFile(): Promise<boolean> {
  try {
    // APIサーバのURLを含んでいればアップロードしない
    if (_formVals.profileImageUrl.includes(useRuntimeConfig().public.PHP_API_URL)) {
      return true
    }

    // 画像ファイルの容量が1MB以上ならアップロードしない    
    const maxFileSize = 1024 * 1024 * CONSTANTS.USER_EDIT_FORM_MAX_FILE_SIZE_MB
    if (maxFileSize < _formVals.selectedImageFile.size) {
      alert('画像ファイルの容量が大きすぎます。' + CONSTANTS.USER_EDIT_FORM_MAX_FILE_SIZE_MB + 'MB以下の画像を選択してください。')

      return false
    }

    // アップロード実行
    const resUrl = await phpApiManager.usePostUploadUserImage(_formVals.selectedImageFile, _user.value, useAccessTokenStore().accessToken)
    if (resUrl === '') {
      return false
    }

    // APIサーバのURLを付与
    _formVals.profileImageUrl = useRuntimeConfig().public.PHP_API_URL + resUrl
    console.log(_formVals.profileImageUrl)

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}

/**
 * ユーザ登録
 * 
 * @returns
 */
const createUser = async(): Promise<boolean> => {
  try {
    console.log('ユーザ登録実行')    

    let resUser = await phpApiManager.usePostCreateUser(_user.value, useAccessTokenStore().accessToken)
    if (resUser.id !== 0) {
      console.log('ユーザ登録成功')
      // twitterId、googleIdを保存済の一時ユーザからセット
      resUser.twitterUserIdStr = useLoginUserStore().twitterUserIdStrFetchedFromTwitterLogin
      resUser.googleUserIdStr = useLoginUserStore().googleUserIdStrFetchedFromGoogleLogin

      console.log(resUser)

      // ユーザデータをCookie、Storeにセット
      await loginManager.useSetUserDataToStoreAndCookie(resUser)

      let msg = 'ユーザ登録が完了しました。'
      // 台本データの紐づけが成功している場合、メッセージを追加
      if (0 < resUser.scripts.length) {
        // ユーザデータを通知データ込みでセットし直す
        await resetNotifications(resUser)
        
        msg += '<br /><br />また、Xアカウント' + _user.value.twitterScreenName + 'で投稿済の台本' + resUser.scripts.length + '件の紐づけが完了しました。'

        useUiEventStore().uiEvent.okDialogMessage = msg        
        useUiEventStore().uiEvent.isOkDialogShowing = true
        useUiEventStore().uiEvent.isEditUserDialogShowing = false        
        // 台本紐づけが未完了の場合、紐づけ確認用のダイアログを表示
      } else {
        useUiEventStore().uiEvent.isScriptLinkConfirmDialogShowing = true
        useUiEventStore().uiEvent.isEditUserDialogShowing = false        
      }

      return true
    } else { 
      console.log('ユーザ登録失敗')
    }
  } catch (error) {
    console.error(error)
  }

  return false
}

/**
 * 通知データなどをセットし直す
 */
const resetNotifications = async (resUser: User) => {
  try {
    // 通知閲覧データを2000年に
    const date = new Date(2000, 0, 1)    
    useLoginUserStore().user.notifyPageWatchDate = date

    // ユーザデータを通知データ込みでセットし直す
    await loginManager.useSetUserDataToStoreByTwitterUserIdStr(resUser.twitterUserIdStr)
  } catch (error) {
    console.error(error)
  }
}

/**
 * ユーザ編集
 * 
 * @returns
 */
const updateUser = async(): Promise<boolean> => {
  try {
    console.log('ユーザ編集実行')    

    let resUser = await phpApiManager.usePostUpdateUser(_user.value, useAccessTokenStore().accessToken)
    if (resUser.id !== 0) {
      console.log('ユーザ編集成功')
      // ユーザデータをCookie、Storeにセット
      await loginManager.useSetUserDataToStoreAndCookie(_user.value)

      useUiEventStore().uiEvent.okDialogMessage = 'プロフィール編集が完了しました。'
      useUiEventStore().uiEvent.isOkDialogShowing = true
      useUiEventStore().uiEvent.isEditUserDialogShowing = false

      return true
    } else { 
      console.log('ユーザ編集失敗')
    }
  } catch (error) {
    console.error(error)
  }

  return false
}
</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <div id="user-edit-form-container" ref="scriptContainer">
    <v-main id="user-edit-form-main" ref="scriptMain">
      <v-container id="user-edit-form-container-inner" ref="scriptContainerInner" class="px-0 py-0 my-0">
        <v-container id="user-edit-form-detail-container" ref="scriptDetailContainer" class="px-0 pt-0">
          <v-form ref="editForm">
            <v-card id="card-container" class="pb-12 mt-0 mb-0">
              <header id="header"></header>

              <h3 class="mt-4 px-4 mb-4">
                <v-icon class="mr-2 mb-1" color="success">mdi-pen</v-icon>
                <template v-if="!useLoginUserStore().hasLogined()">
                  プロフィール登録
                </template>
                <template v-else>
                  プロフィール編集
                </template>
                <v-divider class="mt-2" />
              </h3>

              <v-row>
                <v-col cols="10" class="mx-6 mt-4 text-body-1">
                  <template v-if="!useLoginUserStore().hasLogined()">                
                    <p>新規ユーザ登録を行います。</p>
                    <p>プロフィール情報を入力し、登録ボタンを押して下さい。</p>
                  </template>       
                </v-col>
              </v-row>              

              <div  class="form-container mt-4 px-6">
                <!-- プロフィール画像 -->
                <v-row class="mb-4">
                  <v-col cols='12 d-flex justify-center'>
                    <div id='profile-icon-container'>
                      <v-img :src='_formVals.profileImageUrl' id='profile-icon' />

                      <!-- 変更用アイコン、ラベル -->
                      <v-icon class="fa">mdi-camera-outline</v-icon>
                      <strong>画像を変更</strong>
                      <!-- 画像選択用ボタン -->
                      <input id="file-select-button" type="file" ref="imgRef" accept="image/*"
                        @change="onChangeImageButtonClick">        
                    </div>          
                  </v-col>
                </v-row>

                <v-row class="my-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">
                      <h5 class="input-htxt">ユーザ名</h5>
                    </template>
                    <v-text-field v-model="_formVals.name" 
                      :label="useDisplay().mobile.value ? 'ユーザ名' : ''"
                      :rules="CONSTANTS.FORM_VALIDATION_RULE" 
                      placeholder="例：たろう" 
                      variant="outlined" density="compact">
                    </v-text-field>
                  </v-col>
                </v-row>

                <template v-if="useLoginUserStore().twitterUserIdStrFetchedFromTwitterLogin !== '' || useLoginUserStore().user.twitterScreenName !== '' || useLoginUserStore().hasLogined()">
                  <v-row class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">         
                      <v-col cols="8" class="my-0 py-0">
                        <h5 class="input-htxt">Xアカウント</h5>
                      </v-col>
                    </template>                          
                    <v-col cols="7" class="my-0 py-0">
                      <v-text-field v-model="_formVals.twitterScreenName" 
                        :label="useDisplay().mobile.value ? 'Xアカウント' : ''"
                        placeholder="例：tanaka1234" 
                        :readonly="!useLoginUserStore().hasLogined()"
                        variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="5" class="my-0 py-0">
                      <v-select variant="outlined"
                        :items="CONSTANTS.USER_POST_FORM_TWITTER_SCREEN_NAME_REVEAL_ITEMS"
                        v-model="_formVals.revealTwitterScreenName" 
                        item-text="title"
                        item-value="value"                      
                        density="compact"
                        />
                    </v-col>
                  </v-row>
                </template>

                <v-row class="my-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">         
                      <h5 class="input-htxt">自己紹介</h5>
                    </template>  
                    <v-textarea 
                      class="py-0 textarea-basic-description" 
                      v-model="_formVals.description"              
                      :label="useDisplay().mobile.value ? '自己紹介' : ''"                            
                      placeholder="プロフィールに表示される紹介文を記入してください。（空欄でも可）" 
                      variant="outlined" rows="5" auto-grow 
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row class="text-center mb-12" justify="center" t>
                  <v-col cols="12" class="mb-0">
                    <v-btn 
                    id="submit-button" 
                    color="success" 
                    :disabled="_isRegisterButtonDisabled"                     
                    @click="onSubmitButtonClick">
                      <template v-if="!useLoginUserStore().hasLogined()">               
                      登録
                      </template>     
                      <template v-else>
                        編集完了
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-form>
        </v-container>
      </v-container>
    </v-main>
  </div>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->

<style lang="scss" scoped>

#header {
  height: 100px;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  background-image: $my-page-header-image-path; 
}

#user-edit-form-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 0;
  //overflow-y: hidden;
  overflow-x: hidden;
  z-index: 4;
}

#user-edit-form-container-inner {
  min-height: 100svh;
  max-width: 1000px;
  border: solid 0px #999999;
  background-color: transparent;
}

#header {
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  background-image: $my-page-header-image-path;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
}

.v-container {
  width: 100%;
  height: fit-content;
}

.form-container {
  width: 100%;
  max-width: 500px;
  margin: auto;
  border: solid 0px #999999;
}

#card-container {
  height: 100vh;
  min-height: 1000px;
}

input {
  background-color: #F4F7FA;
  border: solid 1px #cbcbcb;
  border-radius: 4px;
}


#profile-icon-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0px auto;
  margin-bottom: 16px;
  padding: 0;
  border-radius: 50%;
  border: solid 1px #cdcdcd;
  background: rgb(0, 0, 0, 0.3);
  color: white;
}

#profile-icon-container strong {
  position: absolute;
  top: 65%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 100%;
  margin: 0;
  padding: 0;
  color: white;
  font-size: 85%;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
}

#profile-icon-container .fa {
  position: absolute;
  top: 30%;
  left: 37%;
  font-size: 200%;
}

#profile-icon {
  margin: 0 auto;
  border-radius: 50%;
  border: solid 2px white;
  opacity: 0.3;

  /** 背景色を半透明の黒に */
  background-color: rgba(128, 128, 128, 0.5);
}

#file-select-button {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 100px;
  height: 100px;
  opacity: 0;
}

.short-width {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .v-text-field {
    max-width: 600px;
  }
}

.flex {
  flex-direction: row;
}

h3 {
  font-size: 110%;
}

h4 small {
  color: #6b6b6b;
  font-weight: normal;
}

h5.input-htxt {
  color: #616161;
}

.input-row-clm {
  height: 70px;
  margin-top: 12px;
  border: solid 0px #999999;
  padding: 0px;
}

#submit-button {
  width: 100%;
  max-width: 600px;
  min-height: 60px;
  font-size: large;
  font-weight: bold;
}

</style>
