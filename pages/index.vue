<script lang="ts" setup>
//======================================================
//
// index.vue 台本一覧
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as preferenceManager from '@/composables/util/preferenceManager'
import Script from '@/composables/type/script'

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

// router
const _router = useRouter();

// ブラウザバック無効化済か
let _isPopstateListenerRegistered = false

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {
    // ブラウザバックを無効化
    disableBrowserBack()
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * ブラウザバックを無効化
 */
const disableBrowserBack = () => {
  try {
    if (_isPopstateListenerRegistered) {
      console.warn('disableBrowserBack. already registered')

      return
    }

    history.pushState(null, '', location.href);
    // ブラウザバック時
    window.addEventListener('popstate', (e) => {
      console.log('popstate')
      // ブラウザバック時の処理
      onBrowserBack()
    
      // デフォルトの動作を無効化
      e.preventDefault()

      return
    });

    _isPopstateListenerRegistered = true
    console.info('<<<<<Disable Browser Back.>>>>>')    
  } catch (error) {
    console.log(error)
  }
}

/**
 * イベント ブラウザバック
 *  ・縦書き表示中　縦書き表示を解除
 *  ・編集中　編集フォームへ
 *  ・ユーザページから遷移してきた時　ユーザページへ
 *  ・詳細閲覧中　一覧に戻る
 */
const onBrowserBack = async () => {
  try {
    console.log(useUiEventStore().uiEvent)

    // 検索ダイアログ表示中
    if (useUiEventStore().uiEvent.isSearchDialogShowing) {
      console.log('onBrowserBack. for search dialog view')
      useUiEventStore().uiEvent.isSearchDialogShowing = false

      return
    // ログインダイアログ表示中
    } else if (useUiEventStore().uiEvent.isLoginDialogShowing) {
      console.log('onBrowserBack. for login dialog view')
      useUiEventStore().uiEvent.isLoginDialogShowing = false

      return
    // 縦書き表示中
    }  else if (useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      console.log('onBackButtonClick. for fullScreenDialog view')
      //_showVerticalView.value = false
      useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
    
      return
      // 編集中
    } else if (useUiEventStore().uiEvent.isScriptEditConfirmPageShowing) {
      useUiEventStore().uiEvent.isScriptEditConfirmPageShowing = false

      return
      // ユーザページから遷移
    } else if (useRoute().query.fromUserPage) {
      console.log('onBackButtonClick. for user page view')
      let uid = useRoute().query.uid
      console.log(uid)

      const url = CONSTANTS.PAGE_NAME_USER_DETAIL + '?' + CONSTANTS.URL_QUERY_KEY_USER_ID + '=' + uid
      // 他ユーザページへ
      _router.push(url)

      return 
      // 詳細閲覧中
    } else {
      console.log('onBackButtonClick. for detail view')

      // 閲覧中の台本を削除
      useScriptStore().targetScript = new Script()
      useScriptStore().watchingScriptId = 0

      // スクロール位置を戻す
      document.documentElement.scrollTop = useUiEventStore().uiEvent.bodyScrollTop 
      console.log('[restore scrollTop] ' + document.documentElement.scrollTop)     

      // 0.1秒後にスクロール位置を戻す。上記がうまく行かない場合の対策
      setTimeout(() => {
        document.documentElement.scrollTop = useUiEventStore().uiEvent.bodyScrollTop 
        console.log('[restore scrollTop] ' + document.documentElement.scrollTop)     
      }, 50)
    }
  } catch (error) {
    console.error(error)
  }
}


//======================================================
// onUnmounted
//======================================================

/**
 * onUnmounted
 * ・ブラウザバックを有効化
 */
onUnmounted(() => {
  try {
    console.log('[onUnmounted] scriptDetailContainer')
    _isPopstateListenerRegistered = false
    // ブラウザバックを有効化
    enableBrowserBack()
  } catch (error) {
    console.error(error)
  }
})

/**
 * ブラウザバックを有効化
 */
const enableBrowserBack = () => {
  try {
    window.removeEventListener('popstate', (e) => {
      history.go(1);
    });
  } catch (error) {
    console.log(error)
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
  <script-index-container 
  v-show="useScriptStore().targetScript.id === 0" />
  <script-detail-container 
    v-if="useScriptStore().targetScript.id !== 0" :targetScript="useScriptStore().targetScript"
    />
  <!-- footer -->   
  <template v-if="useScriptStore().targetScript.id !== 0">
    <script-detail-footer />
  </template>  
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

// スクロールバー
::-webkit-scrollbar {
  //width: $index-scrollbar-width;
}



</style>
