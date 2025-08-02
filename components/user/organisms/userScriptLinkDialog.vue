<script lang="ts" setup>

//======================================================
//
// userScriptLinkDialog.vue ユーザの台本紐づけ用ダイアログ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from "@/composables/etc/constants"
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as loginManager from '@/composables/util/loginManager'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useMuteUsersStore } from '@/store/muteUsersStore'
import { useFollowUsersStore } from '@/store/followUsersStore'
import { useUiEventStore } from '@/store/uiEventStore'
import User from '@/composables/type/user'
import { useLoginUserStore } from '@/store/loginUserStore'
import { useSetUserDataToStoreByTwitterUserIdStr } from '../../../composables/util/loginManager';

//======================================================
// vars
//======================================================  

// フォーム値
const _formVals = reactive({
  // 名前
  authorName: '' as string,
  // パスワード
  password: '' as string,
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {
    _formVals.authorName = useLoginUserStore().user.name
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isUserScriptLinkDialogShowing = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント OKボタンクリック
 */
const onOkButtonClick = async() => {
  try {
    if (_formVals.authorName === '' || _formVals.password === '') {
      // エラーダイアログを表示
      useUiEventStore().uiEvent.okDialogMessage = '作者名、パスワードを入力して下さい。'
      useUiEventStore().uiEvent.isOkDialogShowing = true

      return
    }

    // ユーザの台本紐づけ
    const scripts = await phpApiManager.usePostLinkScriptsByNameAndPassword(useLoginUserStore().user, _formVals.authorName, _formVals.password, useAccessTokenStore().accessToken)
    if (0 < scripts.length) {
      // storeに台本紐づけ成功を記録
      useUiEventStore().uiEvent.hasUserScriptLinkSuccessed = true
      // 通知データなどをセットし直す
      await resetNotifications()

      // ダイアログを閉じる
      useUiEventStore().uiEvent.isUserScriptLinkDialogShowing = false
      // エラーダイアログを表示
      useUiEventStore().uiEvent.okDialogMessage = scripts.length + '件の台本の紐づけに成功しました。'
      // ダイアログを表示
      useUiEventStore().uiEvent.isOkDialogShowing = true      
    } else {
      // エラーダイアログを表示
      useUiEventStore().uiEvent.okDialogMessage = CONSTANTS.ERROR_MSG_FAIL_LINK_SCRIPTS
      useUiEventStore().uiEvent.isOkDialogShowing = true
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 通知データなどをセットし直す
 */
const resetNotifications = async () => {
  try {
    // 通知閲覧データを2000年に
    const date = new Date(2000, 0, 1)    
    useLoginUserStore().user.notifyPageWatchDate = date

    // 通知データなどをセットし直す
    if (useLoginUserStore().user.twitterUserIdStr !== '') { 
      await loginManager.useSetUserDataToStoreByTwitterUserIdStr(useLoginUserStore().user.twitterUserIdStr)
    } else if (useLoginUserStore().user.googleUserIdStr !== '') {
      await loginManager.useSetUserDataToStoreByGoogleUserIdStr(useLoginUserStore().user.googleUserIdStr)
    }
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch 
 */
watch(() => useUiEventStore().uiEvent.isUserScriptLinkDialogShowing, async(newVal, oldVal) => {
  try {
    if (newVal === true) {
      // APIサーバから過去に入力したパスワードを取得
      _formVals.password = await phpApiManager.useGetCookiePastInputPassword()
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
  <v-dialog 
    v-model="useUiEventStore().uiEvent.isUserScriptLinkDialogShowing"
    >
    <div id="outer-container">
      <div id="inner-container">
        <!-- 閉じるボタン -->
        <v-btn id='close-button-mobile' icon='mdi-close' variant="text" @click='onClickDialogCloseButton' />

        <v-card class="pt-0 pb-4">
          <!-- タイトル -->
          <v-card-title id="title" class="mt-2 mb-4 text-left">
            <span class="title-icon text-body-2 mr-2">

            </span>
            <span class="text-subtitle-2 font-weight-bold">投稿済台本の紐づけ</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="py-4">
            <v-row>
              <v-col id="explain-container" class="text-body-2 text-left">
                <v-alert
                  class="mt-10 mx-0 bg-white"
                  color="teal"
                  variant="outlined"
                >
                <p>過去に声劇台本置き場に投稿した台本を現在のアカウントに紐づけます。</p>
                <p class="mt-4">投稿時の台本作者名、パスワードを入力して下さい。</p>
                </v-alert>   
              </v-col>
            </v-row>            
            <form id="form-container" class="mt-8 px-2">
              <v-row>
                <v-col class="text-left">
                  <h4 class="mb-1">
                    台本作者名
                  </h4>
                  <input type="text" name="authorName" v-model="_formVals.authorName" placeholder="台本作者名" required>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-left">
                  <h4 class="mb-1">
                    パスワード
                  </h4>                  
                  <input type="password" id="edit_pass_tb" name="edit_password" placeholder="" v-model="_formVals.password" 
                    style="ime-mode:disabled;"
                    autocomplete="new-password" />		
                </v-col>
              </v-row>  								              
            </form>
          </v-card-text>

          <v-card-actions class="mt-8 mb-8 px-4  py-0">
            <v-spacer></v-spacer>
            <v-btn id="ok-button" variant="elevated" color="teal" @click="onOkButtonClick">
              OK
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>     
        </v-card>
      </div>
    </div>   
  </v-dialog>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>
.v-dialog {
  max-width: 600px;
  overflow-y: hidden;
}

#inner-container {
  padding: 0px;
  max-height: 80lvh;
  /** 半透明の白に */
  background-color: $bg-grey-color;  
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 10;
  opacity: 0.95;
}

.v-card {
  max-width: 600px;
  max-height: 90lvh;
  background-color: $bg-orange-color;    
  overflow-y: hidden;
}

#h-explain {
  font-size: 60%;
}

#close-button-mobile {
  position: absolute;
  top: 18px;
  right: 15px;
  width: 30px;
  height: 30px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
}
#explain-container {
  max-width: 400px;
  margin: 0px auto;
  border: solid 0px #999999;
}

#form-container {
  max-width: 400px;
  margin: 0px auto;
  border: solid 0px #999999;
  background-color: $bg-grey-color;    
}

input {
  width: 100%;
  max-width: 400px;
  padding: 8px 16px;
  font-size: 120%;
  border: solid 1px #999999;
  border-radius: 4px;
  background-color: white;
}

#ok-button {
  width: 100%;
  max-width: 200px;
  height: 50px;
  font-size: large;
}

</style>