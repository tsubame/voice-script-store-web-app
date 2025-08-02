<script lang='ts' setup>

//======================================================
// 
// accountLink.vue
// ボイストランドアカウント連携用
//
// [索引]
//  □ 0. イベント onMounted
//
//======================================================

import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import * as ViewRouter from 'vue-router'
import * as CONSTANTS from '@/composables/etc/constants'
import * as firebaseManager from '@/composables/util/firebaseManager'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useLoginUserStore } from '@/store/loginUserStore';
import User from '@/composables/type/user';
import GoogleUser from '@/composables/type/googleUser';
import TwitterUser from '@/composables/type/twitterUser';

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

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 * ・ログインしていなければ終了
 * ・ログインしていれば、クエリパラメータで受け取ったuserIdを元に、ユーザー情報を更新
 */
onMounted(async () => {
  try {
    // 未ログインならログインページへ
    if (useLoginUserStore().user.id === 0) {
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }

    // ボイストランドユーザID
    const vUid = useRoute().query[CONSTANTS.URL_QUERY_KEY_VOICETOLAND_USER_ID]     
    // リダイレクトURL
    const redirectUrl = useRoute().query[CONSTANTS.URL_QUERY_KEY_CALLBACK_URL]     
    console.log("ボイストランドユーザID", vUid)
    console.log("リダイレクトURL", redirectUrl)
            
    // クエリパラメータにユーザIDがあればセット
    if (vUid !== undefined) {
      console.log("ボイストランドユーザID", vUid)
      // 数値に変換
      const uid = Number(vUid)
      // storeにセット
      useLoginUserStore().user.voicetolandUserId = uid
      // APIサーバのデータ更新
      const res = await phpApiManager.usePostUpdateVoicetolandUserId(useLoginUserStore().user, useAccessTokenStore().accessToken)
      if (res) { 
        // リダイレクト
        if (redirectUrl !== undefined) {
          const url = redirectUrl?.toString()
          // リダイレクト
          if (url !== '') {
            navigateTo(url, { external: true })
          }
        }
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
// template
//
//======================================================
-->
<template>
  <div>
    <!-- ログインダイアログ 
    <template v-if="useUiEventStore().uiEvent.isLoginDialogShowing">
      <user-login-dialog />
    </template>
  -->
  </div>
</template>

<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang='scss' scoped></style>