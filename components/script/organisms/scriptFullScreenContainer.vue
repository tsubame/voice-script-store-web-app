<script lang="ts" setup>
//======================================================
//
// scriptFullScreenContainer.vue
// 別コンポーネントから呼び出され、台本詳細の縦書きページをページ全体に表示
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import * as  CONSTANTS from '@/composables/etc/constants'
import * as preferenceManager from '@/composables/util/preferenceManager';

//======================================================
// computed
//======================================================

/**
 * 背景画像を返す
 * ・イラスト画像、シンプルな背景画像の表示を切り替える
 */
const getBgImageUrl = computed(() => {
  // 背景画像非表示
  if (useUiEventStore().uiEvent.isScriptBgImageHidden) {
    return 'none'
  }
  // シンプルな背景画像表示
  if (useUiEventStore().uiEvent.isScriptBgSimpleImageShowing) {
    console.log('getBgImageUrl: simple')
    console.log(`url(${useScriptStore().targetScript?.getBgSimpleImageUrlWithAppBaseUrl()})`)
    return `url(${useScriptStore().targetScript?.getBgSimpleImageUrlWithAppBaseUrl()})`
  }

  return `url(${useScriptStore().targetScript?.getBgIllustImageUrlWithAppBaseUrl()})`
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {
    console.log("[onMounted] ScriptVerticalDialog")    

    // Cookieから背景画像を取得
    let bgImageMode = await preferenceManager.useGetValFromCookie(CONSTANTS.COOKIE_KEY_FULLSCREEN_BG_IMAGE)
    if (bgImageMode !== '') {
      if (bgImageMode == CONSTANTS.COOKIE_VAL_FULLSCREEN_BG_IMAGE_ILLUST) {
        useUiEventStore().uiEvent.isScriptBgIllustImageShowing = true
        useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = false
        useUiEventStore().uiEvent.isScriptBgImageHidden = false
      } else if (bgImageMode == CONSTANTS.COOKIE_VAL_FULLSCREEN_BG_IMAGE_SIMPLE) {
        useUiEventStore().uiEvent.isScriptBgIllustImageShowing = false
        useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = true
        useUiEventStore().uiEvent.isScriptBgImageHidden = false
      } else {
        useUiEventStore().uiEvent.isScriptBgIllustImageShowing = false
        useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = false
        useUiEventStore().uiEvent.isScriptBgImageHidden = true
      }
    // Cookieがない場合、背景画像
    } else { 
        useUiEventStore().uiEvent.isScriptBgIllustImageShowing = true
        useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = false
        useUiEventStore().uiEvent.isScriptBgImageHidden = false
    }
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 縦書き/横書き切替ボタンクリック
 */
const onSwitchButtonClick = () => {
  try {
    //_showByVertical.value = !_showByVertical.value
  } catch (error) {
    console.error(error)
  }
}


/**
 * イベント 戻るボタンクリック
 */
const onBackButtonClick = async () => {
  try {
    // スクロールをリセット
    useUiEventStore().uiEvent.hasToResetFullScreenDialogScroll = true

    console.log('onBackButtonClick. for fullScreenDialog view')
    // nextTick
    await nextTick()
    // ダイアログを閉じる
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
    useUiEventStore().uiEvent.hasToResetFullScreenDialogScroll = false
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
  <!-- 全体のコンテナ。背景画像表示時は半透明の黒 -->
  <div id="outer-container" 
    :style="{
      backgroundImage: getBgImageUrl
    }" 
    :class="{
      'has-top-margin': useDisplay().mobile.value,      
      'background-half-black': useUiEventStore().uiEvent.isScriptBgIllustImageShowing,
      'background-image-hidden': useUiEventStore().uiEvent.isScriptBgImageHidden,
      'background-fit-to-width': useDisplay().mobile.value,         
    }">

    <!-- ヘッダ -->
    <template v-if="CONSTANTS.SHOW_HEADER_IN_SCRIPT_FULLSCREEN_FOR_MOBILE">
      <template v-if="useDisplay().mobile.value && useUiEventStore().uiEvent.isScriptFullScreenDialogShowing ">
        <script-full-screen-header />
      </template>
    </template>

    <!-- 戻るボタン -->
    <common-back-button
      :isFixed="true"
      :isOutlined="false"
      @click="onBackButtonClick"
      />        

    <!-- 内側のコンテナ。背景画像表示時は半透明の白 -->
    <div id="inner-container" 
      :class="{     
        'background-half-white': useUiEventStore().uiEvent.isScriptBgIllustImageShowing,
      }">     

      <!-- コンテンツのコンテナ -->
      <div id="contents-container" 
        :class="{
          'full-screen-width': useDisplay().mobile.value,
          'not-full-screen-width': !useDisplay().mobile.value,
        }">

        <!-- 台本用カード -->
        <script-text-card 
          :class="{
          }" :targetScript="useScriptStore().targetScript"
          :show-by-vertical="useUiEventStore().uiEvent.showFullScreenScriptByVertical" 
          />  
       
      </div>
    </div>
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

// 外側のコンテナ。全画面
#outer-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;

  /** iOS対応 */
  height: calc(100lvh - env(safe-area-inset-top)); //calc(100svh - 140px);
  padding-top: calc(env(safe-area-inset-top) + 20px);

  margin: 0;
  //padding: 0 16px;
  //background-repeat: repeat-y;
  background-size: cover;
  //background-color: $bg-grey-color;   
  background-color: rgb(39, 39, 39);
  overflow-y: hidden;
  overflow-x: hidden;
  opacity: 0.95;
}

// 背景を横幅にあわせる
.background-fit-to-width {
  background-size: 100% auto !important;
  background-repeat: repeat-y !important;  
}

// 背景を横幅にあわせる
.background-cover {
  background-size: cover;
  background-position: center center;  
}


#container::before {
  content: '';
  position: absolute;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //backdrop-filter: blur(4px);
}

// モバイル用のマージン
.has-top-margin {
  padding-top: calc(env(safe-area-inset-top) + $script-full-screen-header-height) !important;
}

// 半透明の黒背景
.background-half-black {
  background-color: rgba(0, 0, 0, 0.2) !important;  
}

// インナーコンテナ
#inner-container {
  width: 99%;

  // iOS対応
  height: calc(100lvh - env(safe-area-inset-top) - $footer-height - 10px); //calc(100svh - 140px);

  margin: auto;
}

// 半透明の白背景
.background-half-white {
  background-color: rgba(255, 255, 255, 0.1) !important;  

  // ブラー
  //backdrop-filter: blur(4px);
}

#top-buttons-container {
  //height: 36px;
  border: solid 0px #999999;
}

#contents-container {
  margin: 0 auto;
}

.full-screen-width {
  width: 100%;
}

.not-full-screen-width {
  width: 90%;
  max-width: $full-screen-content-max-width;
}

</style>
