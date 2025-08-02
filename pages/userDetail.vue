<script lang="ts" setup>
//======================================================
//
// userDetail.vue ユーザページ
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import User from '@/composables/type/user'
import Script from '@/composables/type/script'
import { useLoginUserStore } from '@/store/loginUserStore';
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useMuteUsersStore } from '@/store/muteUsersStore'

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({
  middleware: ["login-checker"]
})

//======================================================
// vars
//======================================================

// 対象ユーザ
const _targetUser = ref(new User())
// 表示する台本一覧
const _showScripts = ref(new Array<Script>())
// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    // クエリパラメータを元にユーザデータをセット
    setTargetUserFromQueryParam()
    // 初回ログイン時、台本紐づけ用のダイアログを表示
    showLinkScriptDialogForInitLogin()

    // 台本編集中を解除
    useScriptStore().isScriptPostingOrEditting = false
  } catch (error) {
    console.error(error)
  }
})

/**
 * クエリパラメータを元にユーザデータをセット
 */
const setTargetUserFromQueryParam = async() => {
  try {
    // クエリパラメータにユーザIDがあれば台本をセット
    if (useRoute().query.uid !== undefined) {
      // 数値に変換
      const uid = Number(useRoute().query.uid)

      _targetUser.value = await phpApiManager.useGetReadUserWithScriptsAndFollows(uid)
    } else { 
      // クエリパラメータが空でログインユーザの場合は自分のページを表示
      if (useLoginUserStore().hasLogined()) { 
        const uid = useLoginUserStore().user.id
        navigateTo(CONSTANTS.PAGE_NAME_USER_DETAIL + '?uid=' + uid)

        _targetUser.value = await phpApiManager.useGetReadUserWithScriptsAndFollows(useLoginUserStore().user.id)        
      }
    }

    // 台本をロード
    loadTargrtCategoryScripts()
  } catch (error) {
    console.error(error)
  }
}

/**
 * 台本を1ページ分ロード
 */
function loadTargrtCategoryScripts() {
  try {
    const sIndex = _showScripts.value.length
    const eIndex = sIndex + (CONSTANTS.SCRIPTS_LOAD_COUNT)
    console.log('[ロード前台本件数]' + _showScripts.value.length)

    // 台本がなければ終了
    if (_targetUser.value.scripts === undefined) {
      return
    }
    if (_targetUser.value.scripts.length === 0) {
      return
    }

    // 該当カテゴリの台本をロード
    for (let i = sIndex; i < eIndex; i++) {
      if (_targetUser.value.scripts[i] !== undefined) {
        _showScripts.value.push(_targetUser.value.scripts[i])
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 初回ログイン時、台本紐づけ用のダイアログを表示
 */
const showLinkScriptDialogForInitLogin = async () => {
  try {
    // ログインユーザの場合のみ
    if (useLoginUserStore().hasLogined()) {
      // 台本紐づけダイアログを表示する必要ありなら
      if (useUiEventStore().uiEvent.hasToShowScriptLinkDialog) {
        useUiEventStore().uiEvent.hasToShowScriptLinkDialog = false

        // 確認メッセージを表示
        let res = await showConfirmDialog(CONSTANTS.CONFIRM_MSG_FIRST_LOGIN_LINK_SCRIPTS)
        if (res) { 
          useUiEventStore().uiEvent.isUserScriptLinkDialogShowing = true
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// methods
//======================================================

/**
 * イベント プロフィール編集ボタンクリック
 */
const onProfileEditButtonClick = () => {
  try {
    console.log('onProfileEditButtonClick')

    navigateTo(CONSTANTS.PAGE_NAME_USER_EDIT_FORM)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント フォロー一覧チップクリック
 */
const onFollowsChipClick = () => {
  try {
    navigateTo(CONSTANTS.PAGE_NAME_FOLLOWS + '?uid=' + _targetUser.value.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント フォロワー一覧チップクリック
 */
const onFollowersChipClick = () => {
  try {
    navigateTo(CONSTANTS.PAGE_NAME_FOLLOWERS + '?uid=' + _targetUser.value.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント ミュート一覧チップクリック
 */
const onMuteUsersChipClick = () => {
  try {
    navigateTo(CONSTANTS.PAGE_NAME_MUTES + '?uid=' + _targetUser.value.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント ログインボタンクリック
 */
const onLoginButtonClick = () => {
  try {
    console.log('onLoginButtonClick')

    useUiEventStore().uiEvent.isLoginDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 台本アイテムクリック
 * 
 * @param script 台本
 */
const onScriptItemClick = (event: any, script: Script) => {
  try {
    if (event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button === 1)) {
      return;
    }
    // リンクのデフォルト動作をキャンセル
    event.preventDefault();    

    // リンクが存在していればリンク先へ
    if (script.scriptUrl !== '' && script.scriptUrl !== null) {
      // リンクのデフォルト動作をキャンセル
      event.preventDefault();
      // リンク先に新しいタブで遷移
      window.open(script.scriptUrl, '_blank')

      return
    }

    // ユーザID、台本ID、fromUserPageをセットして遷移
    const url = CONSTANTS.PAGE_NAME_SCRIPTS + '?' + CONSTANTS.URL_QUERY_KEY_SCRIPT_ID + '=' + script.id + '&'
      + CONSTANTS.URL_QUERY_KEY_FROM_USER_PAGE + '=' + CONSTANTS.URL_QUERY_VAL_TRUE + '&' + CONSTANTS.URL_QUERY_KEY_USER_ID + '=' + _targetUser.value.id

    navigateTo(url)
  } catch (error) {
    console.error(error)
  }
}


/**
 * inifinityLoading用設定
 * 
 * @param $state 
 */
const load = async ($state: any) => {
  console.log('script loading...');
  try {
    // 1ページ分ローディング
    loadTargrtCategoryScripts()
  } catch (error) {
    $state.error();
  }
};

//======================================================
// watch
//======================================================

/**
 * watch
 */
watch(() => useUiEventStore().uiEvent.hasUserScriptLinkSuccessed,
  async (newVal) => {
    try {
      if (!newVal) {
        return
      }

      // 紐づけに成功した場合
      if (useUiEventStore().uiEvent.hasUserScriptLinkSuccessed) {
        console.log('ユーザの台本を再取得')
        // ユーザの台本を再取得
        _targetUser.value = await phpApiManager.useGetReadUserWithScriptsAndFollows(_targetUser.value.id)

        useUiEventStore().uiEvent.hasUserScriptLinkSuccessed = false
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
  <div id="container" class="px-0">
    <v-card id="card-container" 
      :class="{
        'pb-12': true,
        'mt-0': true,
        'mb-12': true,
        'no-border': useDisplay().smAndDown.value,
      }"         
      flat
      >
      <header id="header"></header>

      <h4 class="mt-6 px-4 mb-0">
        <template v-if="_targetUser.name !== ''">
          <v-icon class="title-icon mr-2 ml-2 mb-1" color="red-lighten-3">mdi-account-circle</v-icon>{{ _targetUser.name }}さんのプロフィール
        </template>

        <!-- 未ログイン時 -->
        <template v-else>
          <template v-if="!useLoginUserStore().hasLogined()">
            <v-icon class="title-icon mr-2 ml-2 mb-1" color="red-lighten-3">mdi-account-circle</v-icon>マイページ
          </template>
        </template>
        
        <v-divider class="mt-2" />
      </h4>

      <v-row>
        <v-col id="basic-info-container" class="text-center">

          <!-- 未ログイン時 -->
          <template v-if="!useLoginUserStore().hasLogined() && _targetUser.id == 0">
            <div id="login-button-container" class="mt-12 pt-12">
              <p class="mb-12">ログインされていません。</p>
              <v-btn id="login-button" class="px-12 text-body-1 font-weight-bold" 
                @click="onLoginButtonClick"
                color="teal" rounded>
                ログイン</v-btn>
            </div>
          </template>

          <div id="top-buttons-container" class="text-right mr-2">
            <!-- プロフィール編集 -->
            <template v-if="useLoginUserStore().user.id === _targetUser.id && useLoginUserStore().hasLogined()">          
              <v-btn class="mr-2 text-grey-darken-2" icon="mdi-pencil" @click="onProfileEditButtonClick" variant="outlined" density="comfortable" />
            </template> 

            <!-- メニューボタン -->
            <template v-if="_targetUser.id !== 0 && useLoginUserStore().hasLogined()">               
              <user-detail-menu-button :target-user="_targetUser" />         
            </template>
          </div>

          <div id="profile-image-container" class="mt-8">
            <v-img :src="_targetUser.profileImageUrl" />
          </div>
          <p id="user-name" class="text-center mb-4">
            {{ _targetUser.name }}
          </p>
          <!-- Xアカウント -->
          <template v-if="_targetUser.twitterScreenName !== ''">
            <user-x-link-button :targetUser="_targetUser" />
          </template>

          <!-- 投稿数 -->
          <template v-if="_targetUser.id !== 0 || useLoginUserStore().hasLogined()">           
            <p>{{ _targetUser.scripts.length }}<small class="ml-1">作品投稿済</small></p>
          </template>

          <!-- フォロー数 -->
          <p class="text-grey-darken-2 mt-8 mb-8">
            <!-- 自分のフォロー、フォロワー数のみ表示 -->
            <template v-if="useLoginUserStore().user.id === _targetUser.id && _targetUser.id !== 0">             
              <v-chip 
                class="follow-follower-chip mr-2" 
                @click="onFollowsChipClick"              
                density="comfortable">{{ _targetUser.follows.length }}<small class="ml-1">follow</small>
              </v-chip>
              
              <v-chip 
                class="follow-follower-chip" 
                @click="onMuteUsersChipClick"   
                density="comfortable">{{ useMuteUsersStore().muteUserIds.length}}<small class="ml-1">mute</small>
              </v-chip>
            </template>
          </p>               
        </v-col>
      </v-row>

      <template v-if="useLoginUserStore().user.id !== _targetUser.id && _targetUser.id !== 0">
        <v-row class="text-center text-body-2 mt-2 mb-0">              
          <v-col cols="12" class="mb-0 py-2">
            <!-- フォローボタン -->
            <user-follow-button :target-user="_targetUser" :is-small-size="false" />   
            <!-- スペース -->
            <span class="ml-2" />         
            <!-- ミュートボタン -->
            <user-mute-button :target-user="_targetUser"  :is-small-size="false"/>              
          </v-col>
        </v-row>  
      </template>      

      <v-row class="text-center mt-8 mb-8">              
        <v-col cols="12" class="mb-0 py-0">
          <div id="description-outer-container">
            <p id="description-container" class="text-left">
              {{ _targetUser.description }}
            </p>    
          </div>
        </v-col>
      </v-row>           
    </v-card>

    <!-- ログイン時、または他ユーザのページを閲覧中なら表示 -->
    <template v-if="useLoginUserStore().hasLogined() || _targetUser.id !== 0">
      <v-row>
        <v-col>
          <h4 class="mt-4 px-4 mb-0">
            <v-icon class="title-icon mr-3 ml-2 mb-1" color="red-lighten-3">mdi-book-open-page-variant</v-icon>投稿済台本一覧
          </h4>    
        </v-col>    
      </v-row>

      <template v-if="_targetUser.scripts.length == 0">
        <v-row class="mt-8 mb-12">
          <v-col>
            <p class="text-center text-body-2">投稿済みの台本はありません。</p>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <!-- 台本一覧 -->
        <v-row class="justify-center mb-4 mt-4 py-0 px-1">
          <v-col cols="12" :class="{ 'px-0': !useDisplay().mobile.value, 'px-4': useDisplay().mobile.value}">
            <p class="text-right pr-4 text-grey-darken-2 text-body-2">
            <!--<v-icon class="mr-1" color="blue-grey-lighten-2">mdi-script</v-icon>-->
            {{ _targetUser.scripts.length }}件
            </p>

            <v-list id="script-list-container" class="my-0 py-0 px-0 bg-transparent" lines="three">
              <template v-for="(script, index) in _showScripts" :key="index">
                <script-user-list-item 
                  :href="script.getScriptLink()"              
                  @click="(event: any) => onScriptItemClick(event, script)"
                  :targetScript="script"
                />     
              </template>

              <InfiniteLoading @infinite="load" />
            </v-list>
          </v-col>
        </v-row>           
      </template>
    </template>    

    <!-- 台本紐づけ用ダイアログ -->
    <user-script-link-dialog />   
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
  height: $content_header-height;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  background-image: $my-page-header-image-path; //url('/web-app/img/bg/bluesky-glassland-m.jpg');  
}

#container {
  margin: auto;
  //height: 100%;
  max-width: $content-max-width;
}

.v-card {
  height: 100%;
  border: solid 1px $card-border-color;
  // 影をつける
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);  
}

.no-border {
  border: solid 0px #999999 !important;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2) !important;  
}

.title-icon {
  top: -1px;
}

#basic-info-container {
  position: relative;
}

#top-buttons-container {
  position: absolute;
  top: 20px;
  right: 14px;
  width: 100px;
  border: solid 0px #999999;
}

#profile-image-container {
  margin: auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: solid 0px #cccccc;  
}

.v-img {
  width: 100%;
  height: 100%;
}

#user-name {
  font-size: 90%;
  font-weight: bold;
}

.follow-follower-chip {
  width: 80px;
  justify-content: center;
  align-items: center;  
}

#description-outer-container {
  width: 90%;
  margin: auto;
}

#description-container {
  width: fit-content;
  max-width: 400px;
  margin: auto;
  font-size: 90%;  
  white-space: pre-wrap;
}

#scripts-container {
  position: relative;
}

#script-link-button-container {
  position: absolute;
  right: 20px;
  top: 0;
  height: 40px;
}

#script-link-button {
  font-size: 70%;
}

#login-button {
  height: 50px;
}
</style>
