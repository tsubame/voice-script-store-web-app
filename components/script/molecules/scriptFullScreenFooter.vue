<script lang="ts" setup>

//======================================================
//
// scriptFullScreenFooter.vue 台本フルスクリーン時のフッター
//
//======================================================

import { reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as preferenceManager from '@/composables/util/preferenceManager'
import * as phpApiManager from '@/composables/util/phpApiManager'
import { he } from 'vuetify/locale';

//======================================================
// methods
//======================================================

/**
 * イベント プラスボタンクリック
 */
const onPlusButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isFontSizePlusButtonClicked = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント マイナスボタンクリック
 */
const onMinusButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isFontSizeMinusButtonClicked = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 戻るボタンクリック
 */
const onBackButtonClick = async () => {
  try {
    console.log('onBackButtonClick. for fullScreenDialog view')
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 縦横切り替えボタンクリック
 */
const onSwitchButtonClick = async () => {
  try {
    useUiEventStore().uiEvent.showFullScreenScriptByVertical = true

    // 解除
    setTimeout(() => {
      useUiEventStore().uiEvent.showFullScreenScriptByVertical = false
    }, 50)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 背景画像非表示ボタンクリック
 */
const onHideBgImageButtonClick = async () => {
  try {
    useUiEventStore().uiEvent.isScriptBgImageHidden = !useUiEventStore().uiEvent.isScriptBgImageHidden
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
  <!-- 全画面の場合、モバイルなら表示 -->           
  <template v-if="useUiEventStore().uiEvent.isScriptFullScreenDialogShowing">
    <v-footer class="py-0 px-0 dark" app>
      <v-row class="pr-0 text-right">
        <v-col cols="12" id="buttons-container" class="pr-0 half-transparent">
          <v-btn 
            id="close-button"
            @click="onBackButtonClick"
            class="mr-2" color="white" density="compact" variant="outlined" rounded 
            ><v-icon>mdi-arrow-left-thick</v-icon>戻る</v-btn>

            <div
              :class="{
                'full-screen-width': useDisplay().mobile.value,
                'not-full-screen-width': !useDisplay().mobile.value,
              }"           
            >
              <v-btn 
                @click="onMinusButtonClick"
                icon="mdi-minus" class="mr-2" color="white" density="compact" variant="outlined" rounded 
                />
              <v-btn
                @click="onPlusButtonClick"
                icon="mdi-plus" color="white" density="compact" variant="outlined" rounded 
                />

              <v-btn 
                id="switch-button"
                @click="onSwitchButtonClick"
                class="ml-2" color="white" density="compact" variant="outlined" rounded 
                ><v-icon>mdi-swap-horizontal</v-icon>
                <template v-if="!useDisplay().mobile.value">
                  縦横切替
                </template>
              </v-btn>       

              <template v-if="!useDisplay().mobile.value">
                <v-btn 
                  id="switch-button"
                  @click="onHideBgImageButtonClick"
                  class="ml-2" color="white" density="compact" variant="outlined" rounded 
                  >
                    背景非表示
                </v-btn>                   
              </template>
            </div>          
          </v-col>
      </v-row>
    </v-footer>
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

.v-footer {
  height: $footer-height;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
}

.full-screen-width {
  width: 100%;
  padding: 0 16px;  
}

.not-full-screen-width {
  width: 90%;
  margin: auto;
  padding: 0 16px;  
  max-width: $full-screen-content-max-width;
  border: solid 0px #999999;
}

.transparent {
  background-color: transparent !important;
}

.dark {
  background-color: rgb(0, 0, 0, 0.4) 
}

.half-transparent {
  opacity: 0.5;
}

#menu-button {
  opacity: 0.8;
}

.plus-minus-button {
  width: 24px;
  height: 24px;
}

#buttons-container {
  position: relative;
}

#close-button {
  position: absolute;
  top: 10px;
  height: 30px;
  left: 30px;
}

#switch-button {
  height: 30px;
}
</style>
