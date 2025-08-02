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
import { useDisplay, useTheme } from 'vuetify'
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
    const theme = useTheme()
    console.log(theme.global.name.value)
    //theme.global.name.value = 'dark'
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
  <v-app id="inspire"
    >
    <!-- ヘッダ（PC） -->
    <template v-if="!useDisplay().mobile.value">
      <common-header-pc />
    </template>
    <!-- ヘッダ（モバイル）-->
    <template v-if="useDisplay().mobile.value">
      <common-header-mobile />
    </template>

    <!-- メイン要素  --> 
    <v-main>
      <slot />
    </v-main>

    <!-- 検索ボックス -->
    <script-search-dialog />
    <!-- OKダイアログ -->
    <common-ok-dialog />
    <!-- 確認ダイアログ -->
    <common-confirm-dialog />    
    <!-- 通知ダイアログ -->
    <common-notification-dialog />
    <!-- ユーザプロフィールダイアログ -->
    <user-profile-dialog />    
    <!-- ログインダイアログ -->
    <user-login-dialog />    
    <!-- 利用規定説明ダイアログ -->
    <script-policy-explain-dialog />    
    <!-- 台本共有ダイアログ -->
    <script-share-dialog />
    <!-- フルスクリーン時の背景選択ダイアログ -->
    <script-full-screen-bg-image-select-dialog />    
    <!-- ユーザ共有ダイアログ -->
    <user-share-dialog />    
    <!-- 台本紐づけ確認ダイアログ -->
    <script-link-confirm-dialog />        
  
    <!-- 左メニュー -->
    <template v-if="!useDisplay().mobile.value">
      <template v-if="CONSTANTS.USE_LEFT_NAVIGATION_AT_PC">     
        <common-left-pc-navigation />
      </template> 
    </template>
    <!-- 左メニュー（モバイル） -->
    <template v-else>
      <common-left-mobile-navigation />
    </template>
  
    <!-- 画面下の通知 -->
    <common-bottom-notification />

    <!-- 設定ダイアログ -->
    <user-setting-dialog />      
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

:root {
	--header-container-height: 92px; // 90px;
	--header-inner-height: 45px;
	--header-height-difference: calc(
		var(--header-container-height) - var(--header-inner-height)
	);
	--header-bg: #fff;

  overflow-x: hidden;
}

body {
  font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
}

// v-app
#inspire {
  // 背景色
  background-color: $bg-orange-color;// $bg-blue-color;//$bg-orange-color; //$bg-blue-color; //$bg-orange-color;// $body-bg-color; //#f2f5f7;
  //background-image: url('./img/bg/simple/simple-orange-transparent-2.jpg');
  overflow-x: hidden;
}

.title-icon {
  top: -2px;
}

.h-icon {
  top: -1px;
  margin-right: 4px;
  //font-size: 100%;  
}

@media screen and (max-width: 600px) {
  .h-icon {
    top: -5px;
  }
}

// 見出し
h3.green {
  font-size: 80%;  
  padding: 0.8em 1em;/*文字の上下 左右の余白*/
  color: #494949;/*文字色*/
  background: #f4f4f4;/*背景色*/
  border-left: solid 5px #80CBC4;/*左線*/
  border-bottom: solid 3px #d7d7d7;/*下線*/
}

// 見出し
h3.blue {
  font-size: 80%;  
  padding: 0.8em 1em;/*文字の上下 左右の余白*/
  color: #494949;/*文字色*/
  background: #f4f4f4;/*背景色*/
  border-left: solid 5px #7db4e6;/*左線*/
  border-bottom: solid 3px #d7d7d7;/*下線*/
}

</style>
