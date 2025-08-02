<script lang="ts" setup>
//======================================================
//
// scriptTextCard.vue
// 別コンポーネントから呼び出され、台本詳細の縦書きページをページ全体に表示
//
//======================================================

import type { DefineComponent } from 'vue';
import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import Script from '@/composables/type/script'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import * as scriptTextManager from '@/composables/util/scriptTextManager'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  // 対象の台本
  targetScript: Script,
  // 縦書きで表示するか
  showByVertical: Boolean,
})

//======================================================
// vars
//======================================================

// 台本表示領域
const scriptScrollContainer = ref<DefineComponent | null>(null);

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    console.log('scriptTextCard onMounted')

    setRealViewportHeight();
    window.addEventListener('resize', setRealViewportHeight);
    window.addEventListener('orientationchange', setRealViewportHeight);

    // スクロール位置を変更
    scriptScrollContainer.value!.$el.scrollLeft = 0
  } catch (error) {
    console.error(error)
  }
})

/**
 * リアルビューポート高さを設定
 */
function setRealViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}

//======================================================
// methods
//======================================================

/**
 * イベント セリフクリック
 */
const onClickWordItem = async (cName: string) => {
  try {
    if (cName == '') {
      return
    }

    console.log(cName)

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
 * イベント ホイール移動
 */
const onWheelMove = (e: WheelEvent) => {
  try {
    //console.log('onWheelMove')
    // ホイール移動量
    const delta = e.deltaY
    if (scriptScrollContainer.value == null) {
      return
    }

    // 横書き表示の場合は終了
    if (!props.showByVertical) {
      return
    }

    const scrollLeft = scriptScrollContainer.value.$el.scrollLeft
    // スクロール位置を変更
    scriptScrollContainer.value.$el.scrollLeft = scrollLeft - delta
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント コピー時
 * ・コピーをキャンセル
 */
const onCopyEvent = (e: ClipboardEvent) => {
  try {
    e.preventDefault()
    alert('台本の本文はコピーできません。')    
  } catch (error) {
    console.error(error)    
  }
}

/**
 * イベント 縦書き/横書き切替ボタンクリック
 */
const onSwitchButtonClick = () => {
  try {
    useUiEventStore().uiEvent.showFullScreenScriptByVertical = !useUiEventStore().uiEvent.showFullScreenScriptByVertical
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onCloseButtonClick = () => {
  try {
    // スクロール位置を変更
    scriptScrollContainer.value!.$el.scrollLeft = 0

    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch スクロールバーのリセット
 */
watch(() => useUiEventStore().uiEvent.hasToResetFullScreenDialogScroll, (val) => {
  try {
    scriptScrollContainer.value!.$el.scrollLeft = 0
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// onUnmounted
//======================================================

/**
 * onUnmounted
 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', setRealViewportHeight);
  window.removeEventListener('orientationchange', setRealViewportHeight);
});

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->

<template>
  <div>
    <!-- 台本本文 -->
    <v-row class="my-0">
      <v-col id="container" 
        :class="{
          'px-2': true, 'py-0': true,
          'container-with-no-fotter': useDisplay().mobile.value && CONSTANTS.SHOW_HEADER_IN_SCRIPT_FULLSCREEN_FOR_MOBILE,
        }">    

        <v-card 
          id="script-scroll-container" ref="scriptScrollContainer" 
          :class="{
            'vertical-card': props.showByVertical,
            'horizontal-card': !props.showByVertical,
            'is-mobile': useDisplay().mobile.value && !CONSTANTS.SHOW_HEADER_IN_SCRIPT_FULLSCREEN_FOR_MOBILE,  
            'script-scroll-container-with-no-footer': useDisplay().mobile.value && CONSTANTS.SHOW_HEADER_IN_SCRIPT_FULLSCREEN_FOR_MOBILE,
            'with-border': useUiEventStore().uiEvent.isScriptBgImageHidden || useUiEventStore().uiEvent.isScriptBgSimpleImageShowing,
          }" 
          @wheel="onWheelMove">

          <div 
            id="script-card-inner-container"
            :class="{
              'my-1': true,        
              'mx-1': true,
              'px-4': props.showByVertical,
              'pt-0': props.showByVertical,
              'pt-10': !props.showByVertical,
            }">
            <!-- タイトル -->
            <p :class="{
              'pt-2': props.showByVertical,              
              'pl-5': props.showByVertical,
              'pb-3': !props.showByVertical,
            }">
              <h3 class="mr-10">『{{ scriptTextManager.useConvertCharToFullWidth(targetScript?.title!) }}』</h3>

              <p class="mr-2">
                <span>　{{ targetScript?.category }}</span>
                <span>　作者：{{ targetScript?.authorName }}</span>
              </p>
            </p>
            <v-divider class="mt-10"></v-divider>

            <!-- セリフ -->
            <template v-for="( wd, i ) in targetScript?.words " :key="i">
              <div  
                @click="onClickWordItem(wd.charaName)" 
                @copy="onCopyEvent"
                :class="{
                  'selected-vertical': useUiEventStore().uiEvent.scriptSelectedNames.includes(wd.charaName) && props.showByVertical,
                  'selected-horizontal': useUiEventStore().uiEvent.scriptSelectedNames.includes(wd.charaName) && !props.showByVertical,
                  'vertical-list-item': props.showByVertical,
                  'horizontal-list-item': !props.showByVertical,
                  'px-4': !useDisplay().mobile.value,
                  'px-2': useDisplay().mobile.value,
                }"
                :ripple="false"
                >
                <!-- セリフ -->
                <div 
                  :class="{
                    'pt-2': props.showByVertical,
                    'text-body-1': true,
                    'text-black': true,
                  }">
                  <script-text-card-word :targetWord="wd" :showByVertical="props.showByVertical" />
                </div>
              </div>
            </template>
          </div>
        </v-card>

        <!-- 縦横切替ボタン -->
        <template v-if="!useDisplay().mobile.value">          
          <v-btn 
            @click="onSwitchButtonClick"
            id="switch-button" class="font-weight-bold"
            color="teal-lighten-1" variant="flat" rounded>
            縦横切替
          </v-btn>
        </template>
      </v-col>
    </v-row>
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

// スクロールバー
::-webkit-scrollbar {
  width: 2px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #AAAAAA;
}

// 外側のコンテナ
#container {
  position: relative;
  height: calc(100dvh - env(safe-area-inset-top) - $footer-height - 0px); 
  margin-top: -4px;
  overflow: hidden;  
}

.container-with-no-fotter {
  height: calc(100dvh - env(safe-area-inset-top) - $script-full-screen-header-height) !important;  
}


#close-button-pc {
  position: absolute;
  top: 16px;
  right: 34px;
  width: 40px;
  height: 40px;
  padding: 0;
  z-index: 10;
  font-size: 60%;
  color: rgb(120, 120, 120);
  background-color: rgba(255, 255, 255, 1);
  border: solid 1px #b2b2b2;
  opacity: 0.9;
}

// 台本外枠
#script-scroll-container {
  position: relative;
  width: 100%;
  /** iOS対応 */
  height: calc(100dvh - env(safe-area-inset-top) - $footer-height - 20px);

  margin: 0 auto;
  margin-top: 4px;
  -ms-writing-mode: tb-rl;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.7);

  border: solid 1px transparent;
}

.is-mobile {
  height: calc(100dvh - env(safe-area-inset-top) - $script-full-screen-header-height - $footer-height) !important;
}

.script-scroll-container-with-no-footer {
  height: calc(100dvh - env(safe-area-inset-top) - $script-full-screen-header-height) !important;  
}

// 枠線有り外枠
.with-border {
  border: solid 1px $script-full-screen-card-border-color !important;  
}

// 台本描画欄
#script-card-inner-container {
  background-color: white; 
  border-radius: 0px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: scroll;
}

// 縦書きのカード
.vertical-card {
  overflow-x: scroll;
  writing-mode: vertical-rl;
}
// 横書きのカード
.horizontal-card {
  overflow-y: scroll;
  writing-mode: horizontal-tb;
}

// 縦書きのリストアイテム
.vertical-list-item {
  margin-top: 10px;
  margin-bottom: 10px;
}

// 横書きのリストアイテム
.horizontal-list-item {
  min-height: 60px;
  border-bottom: solid 1px #DDDDDD; // #DDDDDD;
  align-items: center;
}

/* 台本描画欄 キャラ名 + セリフ */
div#script-scroll-container div {
  padding: 4px;

  cursor: pointer;
}

/* キャラ名 */
.vertical-chara-name {
  display: block;
  height: fit-content;
  margin: 0;
  padding: 4px 2px;
  border-radius: 4px;
  min-height: 60px;
  writing-mode: vertical-rl;
  width: 25px;
  font-size: small;
  border: solid 1px #999999;
  background-color: #f0f0f0;
}

.horizontal-chara-name {
  position: relative;
  display: block;
  left: 0px;
  min-width: 80px;
  width: fit-content;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 0px;
  padding: 0px 0px;
  border-radius: 4px;
  text-align: center;
  font-size: small;
  border: solid 1px #999999;
  background-color: #f0f0f0;
}

.empty-chara-name {
  display: inline-block;
  width: 70px;
  min-width: 70px;
  margin-left: 4px;
  padding: 2px;
  font-size: small;
  border-radius: 4px;
  text-align: center;
  border: solid 0px #b1b1b1;
  background-color: transparent;
}

/* セリフ */
div#script-scroll-container div p {
  margin: 4px 12px;
  cursor: pointer;
  /** 改行を有効化 */
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
}

.horizontal-word {
  position: relative;
  left: 0px;
  margin: 4px 4px 8px !important;
  font-size: 90%;
  border: solid 0px #999999;
}

.vertical-word {
  padding-bottom: 20px;
}

.v-list {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow-y: scroll;
}

.v-list-item {
  padding: 4px;
  cursor: pointer;
  background-color: transparent;
}

.v-list-item-title {
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  white-space: normal;
  border: solid 0px #999999;
}

/* セリフ */
.v-list-item-title p {
  font-size: small;
  line-height: 150%;
  cursor: pointer;
  border: solid 1px #999999;
  background-color: red;
}

// 選択されたセリフ（縦書き）
.selected-vertical {
  background-color: $fullscreen-vertical-selected-word-color;// #e2e2e2;
}

// 選択されたセリフ（横書き）
.selected-horizontal {
  background-color: $fullscreen-horizontal-selected-word-color;// #e2e2e2;
}

#close-button {
  position: absolute;
  top: 70px;
  right: 4px;
  padding: 0;
  z-index: 10;
  font-size: 50%;
  color: rgb(104, 104, 104);
  /* 半透明に */
  background-color: rgba(255, 255, 255, 0.3);
}

#vertical-script-info-button {
  position: absolute;
  right: -20px;
  writing-mode: vertical-rl !important;
}

#vertical-script-info-button {
  display: inline-block;
  margin-left: 10px;
  writing-mode: vertical-rl !important;
}

.vertical-text {
  writing-mode: vertical-rl !important;
  text-orientation: upright !important;
}

#vertical-act-end-button-container {
  position: relative;
  height: 100%;
  border-right: solid 1px #d3d3d3;
}

#vertical-act-end-button-container .button-explain {
  position: absolute;
  top: 60px;
  right: 69px;
  font-size: 90%;
  color: white;
  border: solid 0px #999999;
  font-weight: bold;
}

#vertical-act-end-button-container #act-end-button {
  /* 横書きに */
  writing-mode: horizontal-tb !important;
  font-weight: bold;
}

#act-end-button {
  /* 横書きに */
  font-weight: bold;
}

#horizontal-act-end-button-container {
  position: relative;
  height: 100%;
  /* 横書きに */
  writing-mode: horizontal-tb !important;
  /** コンテンツを中央に配置  */
  display: flex;
  justify-content: center;
  align-items: center;

  border: solid 0px #999999;
}

#horizontal-act-end-button-container .button-explain {
  display: block;
  position: absolute;
  top: 40px;
  width: 200px;
  font-size: 70%;
  text-align: center;
  color: white;
  border: solid 0px #999999;
}

/* ルビありの行 */
.ruby-txt {
  line-height: 180%;
}

// 縦横切替ボタン
#switch-button {
  position: absolute;
  right: 34px;
  bottom: 30px;
  z-index: 10;
}
</style>
