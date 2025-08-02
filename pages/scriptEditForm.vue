<script lang="ts" setup>
//======================================================
//
// scriptEditForm.vue 台本編集フォーム
//
//======================================================

import { reactive, onMounted, ref } from 'vue';
import { useDisplay } from "vuetify";
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import * as preferenceManager from "@/composables/util/preferenceManager"
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as scriptStore from '@/store/scriptStore'
import { useUiEventStore } from '@/store/uiEventStore'
import Script from '@/composables/type/script'
import Notification from '@/composables/type/notification'
import { useConfirmDialog } from '@/composables/util/dialogManager'

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

// 編集中の台本
const _editTargetScript = ref<Script>(new Script())


//======================================================
// useAsyncData
//======================================================

/**
 * useAsyncData
 * 　・クエリパラメータに台本IDがあれば台本をセット
 */
await useAsyncData(async () => {
  try {
    console.log('[useAsyncData] scriptEditForm ')

    // 編集対象の台本があればセット
    if (useScriptStore().edittingScriptId != 0) { 
      // 対象台本を取得
      _editTargetScript.value = await phpApiManager.useGetReadScript(useScriptStore().edittingScriptId)
    }
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    console.log('scriptEditForm onMounted')

    // 台本編集作業中をセット
    useScriptStore().isScriptPostingOrEditting = true
    // 台本投稿確認中をfalseに
    useUiEventStore().uiEvent.isScriptEditConfirmPageShowing = false
    // 選択されたファイル名を初期化
    useScriptStore().uploadSelectedFileName = ""
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// emits
//======================================================

/**
 * イベント 確認ボタンクリック
 * 
 * @param sc 台本
 */
const showDetail = (sc: Script) => {
  try {
    // 確認中をtrueに
    useUiEventStore().uiEvent.isScriptEditConfirmPageShowing = true
    // ユーザ情報をセット
    sc.authorUser = useLoginUserStore().user

    // 確認対象の台本をセット
    _editTargetScript.value = sc

    // スクロール位置を戻す
    console.log('scroll to top.')
    document.documentElement.scrollTop = 0
    console.log('sctollToTop')
    console.log('[after scrollTop] ' + document.documentElement.scrollTop)

    // 0.1秒後にスクロール位置を戻す
    setTimeout(() => {
      document.documentElement.scrollTop = 0
      console.log('sctollToTop')
      console.log('[after scrollTop] ' + document.documentElement.scrollTop)

    }, 100)
  } catch (error) {
    console.log(error)
  }
}

/**
 * イベント 投稿ボタンクリック
 */
const onScriptPostButtonClick = async() => { 
  try {
    let res = false
    // 新規投稿
    if (useScriptStore().edittingScriptId === 0) {
      res = await phpApiManager.usePostCreateScript(_editTargetScript.value, _editTargetScript.value.charactors!, useLoginUserStore().user, useAccessTokenStore().accessToken)
      // 編集
    } else {
      res = await phpApiManager.usePostUpdateScript(_editTargetScript.value, _editTargetScript.value.charactors!, useLoginUserStore().user, useAccessTokenStore().accessToken)
    }

    if (res) {
      alert('投稿が完了しました。')
      // 値を初期化
      useScriptStore().clearScriptVals()
      // 通知送信

      // ナビゲーション
      navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS)
    } else {
      // 失敗
      alert(CONSTANTS.ERROR_MSG_SCRIPT_POST)
      console.log('台本投稿失敗')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 投稿通知をフォロワーに送信
 */
const sendPostNotification = async () => {
  try {
    // 自分の台本なら通知を送信しない
    if (_editTargetScript.value.userId === useLoginUserStore().user.id) {
      return
    }

    // お知らせを登録
    let us = new Notification()
    us.userId = useLoginUserStore().user.id
    us.notifyTargetUserId = _editTargetScript.value.userId
    us.scriptId = _editTargetScript.value.id
    us.isCommentNotification = false
    us.message = CONSTANTS.TOP_PAGE_MSG_COMMENT_FOR_SCRIPT_POST
    us.message = us.message.replace(CONSTANTS.TOP_PAGE_MSG_SCRIPT_NAME_KEYWORD, _editTargetScript.value.title)
    us.user = useLoginUserStore().user

    await phpApiManager.usePostCreateNotification(us, useLoginUserStore().user, useAccessTokenStore().accessToken)
  } catch (error) {
    console.error(error)
  }
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
  <div id="script-container" ref="scriptContainer">
    <v-main id="script-main" ref="scriptMain">
      <v-container id="script-container-inner" ref="scriptContainerInner" class="px-0 py-0 my-0">
        <v-container id="script-detail-container" ref="scriptDetailContainer" class="px-0 pt-0">
          <!-- 入力フォーム -->
          <script-edit-input-form-container 
            v-show="!useUiEventStore().uiEvent.isScriptEditConfirmPageShowing" 
            @showDetail="showDetail"
            :target-script="_editTargetScript"
            />

          <!-- 詳細表示 -->
          <script-detail-container 
            v-if="useUiEventStore().uiEvent.isScriptEditConfirmPageShowing" :targetScript="_editTargetScript"
            @onScriptPostButtonClick="onScriptPostButtonClick"
            />
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
#script-container {
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

#script-container-inner {
  min-height: 100svh;
  max-width: $content-max-width;
  border: solid 0px #999999;
  background-color: transparent;
}
</style>
