<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerInner.vue 台本詳細
// 別コンポーネントから呼び出され、台本詳細ページをページ全体に表示
//
//======================================================

import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading';
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as preferenceManager from '@/composables/util/preferenceManager'
import * as loginUserStore from '@/store/loginUserStore'
import { useAccessTokenStore } from '@/store/accessTokenStore'
import { useScriptStore } from '@/store/scriptStore'
import Script from '@/composables/type/script'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetScript: Script,
}>()

// emits
const emits = defineEmits(['scrollToSavedPosition', 'onScriptPostButtonClick'])

//======================================================
// vars
//======================================================

// コンテナ
const scriptDetailContainer = ref<HTMLElement>()
// 外側コンテナ
const outerContainer = ref(null)
// タブインデックス
//const _selectedTabIndex = ref(0)


//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {
    console.log('[onMounted] scriptDetailContainer')

    useScriptStore().targetScript = new Script()

    nextTick()
    // スクロール
    if (scriptDetailContainer.value !== undefined) {
      scriptDetailContainer.value.scrollTop = 0
    }

    //console.log(scriptDetailContainer.value!)
    console.log('[scrollTop] ' + scriptDetailContainer.value!.scrollTop)
            
    nextTick()
    useScriptStore().targetScript = props.targetScript!

    // ブラウザバックを無効化
    //disableBrowserBack()

    // 選択された名前を初期化
    useUiEventStore().uiEvent.scriptSelectedNames = new Array<string>()
  } catch (error) {
    console.error(error)
  }
})


//======================================================
// methods
//======================================================

/**
 * イベント セリフクリック
 */
const onClickWordItem = (cName: string) => {
  try {
    if (cName == '') {
      return
    }

    // 選択済なら
    if (useUiEventStore().uiEvent.scriptSelectedNames.indexOf(cName) !== -1) {
      // 配列から削除
      useUiEventStore().uiEvent.scriptSelectedNames = useUiEventStore().uiEvent.scriptSelectedNames
        .filter((name) => name !== cName)
    } else {
      // 配列に追加
      useUiEventStore().uiEvent.scriptSelectedNames.push(cName)
    }

    console.log(useUiEventStore().uiEvent.scriptSelectedNames)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 縦書きで表示ボタンクリック
 */
const onVerticalViewButtonClick = () => {
  try {
    //_showVerticalView.value = true
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = true

    //console.log(useScriptStore().targetScript)
    //console.log(useUiEventStore().uiEvent)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 編集キャンセルボタンクリック
 */
const onEditCancelButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isScriptEditConfirmPageShowing = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 戻るボタンクリック
 *  ・縦書き表示中　縦書き表示を解除
 *  ・編集中　編集フォームへ
 *  ・ユーザページから遷移してきた時　ユーザページへ
 *  ・詳細閲覧中　一覧に戻る
 */
const onBackButtonClick = async () => {
  try {
    console.log(useUiEventStore().uiEvent)

    // 縦書き表示中
    if (useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      console.log('onBackButtonClick. for fullScreenDialog view')
      //_showVerticalView.value = false
      useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
    
      return
      // 編集中
    } else if (useUiEventStore().uiEvent.isScriptEditConfirmPageShowing) {
      useUiEventStore().uiEvent.isScriptEditConfirmPageShowing = false

      return
      // ユーザペーから遷移
    } else if (useRoute().query.watchingUserId) {
      let uid = useRoute().query.watchingUserId

      // マイページへ
      if (uid === useLoginUserStore().user.id.toString()) {
        navigateTo(CONSTANTS.PAGE_NAME_USER_DETAIL)
      }

      // 詳細閲覧中
    } else {
      console.log('onBackButtonClick. for detail view')

      // スクロール位置を戻す
      document.documentElement.scrollTop = useUiEventStore().uiEvent.bodyScrollTop      
      // 閲覧中の台本を削除
      //useScriptStore().targetScript = new Script()
      //useScriptStore().watchingScriptId = 0
      useScriptStore().clearScriptVals()
      navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 台本編集ボタンクリック
 */
const onEditButtonClick = async () => {
  try {
    // 編集中の台本IDをセット
    useScriptStore().edittingScriptId = props.targetScript!.id
    // 画面遷移
    navigateTo(CONSTANTS.PAGE_NAME_SCRIPT_EDIT_FORM)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 台本投稿ボタンクリック
 */
const onSubmitButtonClick = async () => {
  try {
    // emits実行
    emits('onScriptPostButtonClick')
  } catch (error) {
    console.error(error)
  }
}


//======================================================
// watch
//======================================================

/**
 * watch 閲覧対象の台本ID変更
 */
watch(() => useScriptStore().watchingScriptId,
  async (val) => {
    try {
      if (useScriptStore().watchingScriptId == 0) {
        return
      }

      // 0.5秒後にタブインデックスを0に
      setTimeout(() => {
        useUiEventStore().uiEvent.scriptDetailTabIndex = CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY
      }, 500)
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * watch フォントサイズ拡大ボタン
 */
watch(() => useUiEventStore().uiEvent.isFontSizePlusButtonClicked,
  async (val) => {
    try {
      if (val) {
        // フォントサイズを拡大
        useUserSettingStore().cookieSavedScriptTextFontSizeRate += CONSTANTS.SCRIPT_TEXT_FONT_SIZE_CHANGE_AMOUNT

        const val = useUserSettingStore().cookieSavedScriptTextFontSizeRate
        const valTxt = val.toString()
        console.log('[fontSize] ' + valTxt + '%')

        // Cookieにセット
        await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_FONT_SIZE, valTxt)
        // ボタン押下状態を解除
        useUiEventStore().uiEvent.isFontSizePlusButtonClicked = false
      }
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * watch フォントサイズ縮小ボタン
 */
watch(() => useUiEventStore().uiEvent.isFontSizeMinusButtonClicked,
  async (val) => {
    try {
      if (val) {
        useUserSettingStore().cookieSavedScriptTextFontSizeRate -= CONSTANTS.SCRIPT_TEXT_FONT_SIZE_CHANGE_AMOUNT

        const val = useUserSettingStore().cookieSavedScriptTextFontSizeRate
        const valTxt = val.toString()
        console.log('[fontSize] ' + valTxt + '%')
        // Cookieにセット
        await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_FONT_SIZE, valTxt)
        // ボタン押下状態を解除
        useUiEventStore().uiEvent.isFontSizeMinusButtonClicked = false        
      }
    } catch (error) {
      console.error(error)
    }
  }
)

/**
 * watch コメントに移動ボタン押下状況
 */
watch(() => useUiEventStore().uiEvent.isScriptCommentButtonClicked,
  async (val) => {
    try {
      if (val) {
        console.log('コメントに移動')

        const COMMENT_DIV_ID = 'comment-container'
        const element = document.getElementById(COMMENT_DIV_ID);
        console.log(element)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      console.error(error)
    }
  })

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <!-- フルスクリーンの縦書き表示 -->
  <template v-if="useUiEventStore().uiEvent.isScriptFullScreenDialogShowing">
    <script-full-screen-container />
  </template>

  <div ref="outerContainer" >
    <!-- フルスクリーン以外の台本詳細表示 -->
    <v-container id="script-detail-container" ref="scriptDetailContainer" 
      v-show="!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing" class="px-0 pt-0">

      <div id="script-info-body-container">
        <v-card id="script-info" class="pt-0 pb-0 px-0 text-black"       
          :class="{
            'no-border': useDisplay().smAndDown.value,
          }"   
          flat
          >
          <!-- ヘッダ -->
          <template v-if="props.targetScript !== null && props.targetScript !== undefined">
            <div id="header" class="mt-0 mb-5"
              :style="{ backgroundImage: `url('${props.targetScript.getBgIllustImageUrlWithAppBaseUrl()}')` }">
            </div>          
          </template>
          <!-- 確認メッセージ。台本投稿・編集時のみ -->
          <template v-if="useScriptStore().isScriptPostingOrEditting && useUiEventStore().uiEvent.isScriptEditConfirmPageShowing">
            <!-- 新規投稿 -->
            <script-confirm-notification v-if="useScriptStore().edittingScriptId === 0"
              message="この内容で台本を投稿します。問題なければ「投稿」ボタンを押してください。" />
            <!-- 編集 -->
            <script-confirm-notification v-if="useScriptStore().edittingScriptId !== 0"
              message="この内容で投稿済台本の編集を行います。問題なければ「編集完了」ボタンを押してください。" />
            <v-divider class="mt-10 mb-4" />
          </template>

          <!-- 概要、登場人物 -->
          <div
            :class="{
              'px-0': useDisplay().smAndDown.value,
              'px-2': useDisplay().mdAndUp.value,
            }"
          >
            <!-- 概要-->          
            <div class="px-0">
              <script-detail-container-basic-info :targetScript="props.targetScript" />
            </div>

            <!-- 登場人物 -->
            <script-detail-container-chara-info :targetScript="props.targetScript" />
          </div>
        </v-card>

        <v-row class="mt-7 mr-2 mb-12">
          <v-spacer></v-spacer>
          <!-- 編集ボタン。自分の台本、かつ編集中でない場合のみ表示-->
          <v-btn id="edit-button"
            v-if="props.targetScript?.userId === useLoginUserStore().user.id && !useScriptStore().isScriptPostingOrEditting "
            class="mt-7 mr-2 text-caption " 
            @click="onEditButtonClick"
            color="info"
            rounded>
            
            <span class="mx-1 font-weight-bold">
              <v-icon class="title-icon mr-1">mdi-lead-pencil</v-icon>
              台本を編集
            </span>
          </v-btn>

          <!-- 縦書き表示ボタン -->
          <v-btn id="switch-button" 
            :class="{'mt-7': true, 'text-grey-darken-2': useScriptStore().isScriptPostingOrEditting }" plain dark @click="onVerticalViewButtonClick" rounded
            :color="useScriptStore().isScriptPostingOrEditting ? 'white' : 'teal-lighten-1'"
            :variant="useScriptStore().isScriptPostingOrEditting ? 'elevated' : 'elevated'"
            >
            <span class="mx-1 font-weight-bold">
              <template v-if="!useScriptStore().isScriptPostingOrEditting">
                <v-icon class="mr-1">mdi-compare-vertical</v-icon>
              </template>
              <template v-if="props.targetScript?.userId === useLoginUserStore().user.id">              
                縦書き表示
              </template>
              <template v-else>              
                台本を縦書き表示
              </template>              
            </span>
          </v-btn>
        </v-row>

        <!-- 投稿ボタン -->
        <template v-if="useScriptStore().isScriptPostingOrEditting && useUiEventStore().uiEvent.isScriptEditConfirmPageShowing">
          <v-row  justify="center" class="text-center mb-12 mx-1 mt-0">
            <v-col cols="3" class="mb-4 mx-0">
              <v-btn id="submit-cancel-button" color="" @click="onEditCancelButtonClick">
                <template v-slot:prepend v-if="!useDisplay().mobile.value"><v-icon
                    color="grey">mdi-arrow-left-circle</v-icon></template>
                戻る</v-btn>
            </v-col>
            <v-col cols="6" class="mb-4 mx-0">
              <v-btn id="submit-button" color="success" @click="onSubmitButtonClick">
                <!--<template v-slot:prepend><v-icon>mdi-send-circle</v-icon></template>-->
                <!-- 新規投稿 -->
                <template v-if="useScriptStore().edittingScriptId === 0">投稿</template>
                <!-- 編集 -->
                <template v-if="useScriptStore().edittingScriptId !== 0">編集完了</template>
              </v-btn>
            </v-col>
            <v-col cols="3" class="mb-4 mx-0">
            </v-col>
          </v-row>
        </template>

        <v-card 
          id="tabs-container"
          :class="{
            'no-border': useDisplay().smAndDown.value,
            'text-black': true,
          }"
          flat
          >
      
          <!-- タブ要素 -->
          <v-window v-model="useUiEventStore().uiEvent.scriptDetailTabIndex" :touch="false">
            <!-- 本文 -->
            <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY" :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY">              
              <v-card-title :class="{
                  'px-2': useDisplay().smAndDown.value,
                  'px-4': useDisplay().mdAndUp.value,        
                }">
                <h3 class="green mt-6 px-4 mb-12">
                  <v-icon class="title-icon mr-2" color="teal-lighten-3">mdi-book-open-page-variant</v-icon>                  
                  台本本文
                </h3>   
              </v-card-title>
              
              <script-detail-container-script-body :words="props.targetScript?.words"
                @onClickWordItem="onClickWordItem" />
            </v-window-item>

            <!-- 編集中でなければ表示 -->
            <template v-if="!useScriptStore().isScriptPostingOrEditting">
              <!-- コメント -->
              <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_COMMENT" :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_COMMENT">
                  <script-detail-container-comment-tab-item :targetScript="props.targetScript" />
              </v-window-item>

              <!-- 作者の他台本 
              <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT" :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT">
                <template v-if=" useUiEventStore().uiEvent.scriptDetailTabIndex == CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT">
                  <script-detail-container-other-script-tab-item 
                    :author-user="props.targetScript.authorUser"
                    :scripts="props.targetScript.sameAuthorScripts" />
                </template>
              </v-window-item>
            -->
            </template>
          </v-window>    
          
          <!-- 編集中でなければ表示 -->          
          <template v-if="!useScriptStore().isScriptPostingOrEditting">
            <div id="comment-container" class="mt-12 pt-12">
              <script-detail-container-comment-tab-item :targetScript="props.targetScript" />          
            </div>
          </template>
        </v-card>
    
        <!-- 編集中でなければ表示 -->
        <template v-if="!useScriptStore().isScriptPostingOrEditting">
          <!-- 作者の他台本 -->
          <script-detail-container-other-script-tab-item 
            :author-user="props.targetScript.authorUser"
            :scripts="props.targetScript.sameAuthorScripts" />
        </template>
      </div>
    </v-container>

    <!-- 上に戻るボタン -->
    <template v-if="!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing">
      <common-move-to-top-button />
    </template>       
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

#script-detail-container {  
  width: 100%;
  max-width: $content-max-width;
  height: fit-content;
  min-height: 100vh;
  padding-bottom: 0px;
  border: solid 0px #999999;
  background-color: transparent;  
  z-index: 10;
}

.v-card {
  border: solid 1px $content-card-border-color;
}

@media (max-width: 600px) {
  .v-card {
    border-radius: 0px;
  }
}

.no-border {
  border: solid 0px #999999 !important;
  border-bottom: solid 1px $content-card-border-color !important;
  border-top: solid 1px $content-card-border-color !important;  
  // 影をつける
  box-shadow: 0 1px 1px 0 rgba(132, 122, 110, 0.2) !important;
}

#header {
  height: $script-header-height;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: white;
  //background-color: rgba(0, 0, 0, 0.5);
}

#script-info-body-container {
  //background-color: #fbfafa;
  background-color: transparent;
}

/** 台本情報 */
#script-info {
  position: relative;
}

#script-info p {
  font-size: small;
}

#basic-info {
  position: relative;
}

#edit-button {
  //position: absolute;
  height: 44px;
  font-size: 85% !important;  
}

/** 縦書き表示ボタン */
#switch-button {
  height: 44px;
  font-size: 85%;
}

/** 台本詳細説明 */
#description {
  padding: 0px 8px;
  background-color: #EEEEEE;
}

.textLength {
  color: #737373;
  font-size: x-small;
}





/** 台本本文 
#script-body {
  padding: 0px 0px;
  border: solid 0px #999999;
}

.v-list {
  border: solid 0px #999999;
}

.word {
  display: flex;
  align-items: center;
  min-height: 70px;

  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: solid 1px #DDDDDD;
}

.word:hover {
  cursor: pointer;
}

#script-body .v-list-item {
  margin: 0px;
  border-top: solid 1px #DDDDDD;
}

#script-body .v-list-item-title {
  margin-left: -8px;
  width: 80px;
  white-space: normal;
  overflow: visible;
}

.word-text {
  display: block;
  font-size: 90%;
  border: solid 0px #999999;
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
}
  */

/* 選択されたセリフ */
.selected {
  background-color: #f0f8fc;
  /*#f3f9fd; /* 縦書き:"#efefef" */
}

/** タブ */
.v-tabs {
  color: #777777;
}

/* *
.v-tab {
  width: 33%;
  max-width: 300px;
  font-size: small;
}*/


#tabs-container {
  margin-top: 40px;
  margin-bottom: 0px;
  padding-bottom: 80px;
  //margin-bottom: 48px;
}

.transparent {
  //background-color: #f6f8f9;
  border: solid 0px #999999;
  background-color: transparent;
  // 影を消す
  //box-shadow: none;
  //border: solid 0px #999999;
}

.v-window-item {
  padding: 0px;
  border: solid 0px #999999;
}


#submit-cancel-button {
  width: 95%;
  max-width: 300px;
  min-height: 80px;
  font-size: large;
}

#submit-button {
  width: 95%;
  max-width: 500px;
  min-height: 80px;
  font-size: x-large;
  font-weight: bold;
}
</style>
