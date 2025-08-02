<script lang="ts" setup>
// ======================================================
//
// default.vue 標準レイアウトテンプレート
//
// [索引]
//   □ 0-1. onMounted
//    ・モバイル以外の環境でのみ左メニューを表示
//
// ======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import Script from '@/composables/type/script'

//======================================================
// vars
//======================================================

// タブインデックス
const _selectedTabIndex = ref(0)

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 * ・ログイン中の場合、フォローデータ、ミュートデータをセット
 */
onMounted(() => {
  try {

  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * トップページ表示中かを返す
 * 
 * @returns {boolean} トップページ表示中か
 */
const isInTopPage = (): boolean => {
  try {
    if (useRoute().fullPath.indexOf(CONSTANTS.URL_QUERY_KEY_SCRIPT_ID) === -1) {
      return true
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
  <v-app id="inspire">
    <!-- ヘッダ -->
    <common-header />
    
    <!-- メイン要素 -->
    <v-container class="layout-container px-0" >
      <v-main class="main">
        <slot />
      </v-main>

      <template
        v-if="useUiEventStore().uiEvent.isScriptFullScreenDialogShowing"
        >
        <v-navigation-drawer 
          id="right-menu" 
          location="right"
          class="py-4 px-4"
          >
          <v-card id="sample-card">
            　
          </v-card>
        </v-navigation-drawer>
      </template>

      <!-- footer -->
      <script-detail-footer />

      <!-- 検索ボックス -->
      <script-search-dialog />
      <!-- OKダイアログ -->
      <common-ok-dialog />
      <!-- 通知ダイアログ -->
      <common-notification-dialog />
      <!-- ユーザプロフィールダイアログ -->
      <user-profile-dialog />
      <!-- 設定ダイアログ -->
      <user-setting-dialog />      
      <!-- ログインダイアログ -->
      <user-login-dialog />
    </v-container>
  </v-app>
</template>

<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap");

/*
*,
*:after,
*:before {
	box-sizing: border-box;
}
*/

:root {
	--header-container-height: 90px;
	--header-inner-height: 45px;
	--header-height-difference: calc(
		var(--header-container-height) - var(--header-inner-height)
	);
	--header-bg: #fff;
}

/*
body {
	font-family: "DM Sans", sans-serif;
	background-color: #f2f5f7;
	line-height: 1.5;
	position: relative;
}*/

// v-app
#inspire {
  //background-color: #f2f5f7;
}

.layout-container {
  max-width: 1280px;
  position: relative;
}

// 右側のメニュー
#right-menu {
  /** 背景を半透明の黒に */
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);

  /** iOS対応 */
  padding-top: calc(env(safe-area-inset-top));

  z-index: 9;
}

.v-card {
  //background-color: rgba(255, 255, 255, 0.5);
  //border-radius: 10px;
}

// サンプル
#sample-card {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

</style>
