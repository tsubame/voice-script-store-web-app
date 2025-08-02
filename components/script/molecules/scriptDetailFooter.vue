<script lang="ts" setup>

//======================================================
//
// 下メニュー　モバイルでのみ表示
//
//======================================================

import { reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as preferenceManager from '@/composables/util/preferenceManager'
import * as phpApiManager from '@/composables/util/phpApiManager'

//======================================================
// vars
//======================================================

// プラスボタン用のツールチップ表示
const _showPlusButtonTooltip = ref(false)

// マイナスボタン用のツールチップ表示
const _showMinusButtonTooltip = ref(false)

//======================================================
// computed
//======================================================

/**
 * isOutlinedで表示するかを返す
 * ・全画面表示中、かつ背景画像表示中はtrue
 */
const getHasToDrawByOutlined = computed(() => {
  // 全画面表示でなければfalse
  if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
    return false
  }
  // 背景画像非表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgImageHidden) {
    return false
  }
  // シンプルな背景画像表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgSimpleImageShowing) {
    return false
  }
  // イラスト画像表示中の場合はtrue
  if (!useUiEventStore().uiEvent.isScriptBgIllustImageShowing) {
    return false
  }

  return true
})

/**
 * 黒背景で表示するかを返す
 * ・全画面表示中、かつ背景画像表示中、かつモバイルならtrue
 */
const hasToDrawByDark = computed(() => {
  // 全画面表示でなければfalse
  if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
    return false
  }

  // イラスト画像表示中、かつモバイルの場合はtrue
  if (useUiEventStore().uiEvent.isScriptBgIllustImageShowing) {
    return true
  }  
  // 背景画像非表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgImageHidden) {
    return false
  }
  // シンプルな背景画像表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgSimpleImageShowing) {
    return false
  }

  return true
})

/**
 * 半透明の白背景で表示するかを返す
 * ・全画面表示中、かつシンプル背景表示中はtrue
 */
const hasToDrawByHalfTransparentWhite = computed(() => {
  // 全画面表示でなければfalse
  if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
    return false
  }
  // シンプルな背景画像表示の場合はtrue
  if (useUiEventStore().uiEvent.isScriptBgSimpleImageShowing) {
    return true
  }  
  // イラスト画像表示中の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgIllustImageShowing) {
    return false
  }  
  // 背景画像非表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgImageHidden) {
    return false
  }

  return true
})

/**
 * 背景を透明で表示するかを返す
 * ・全画面表示中、かつ背景画像非表示ならtrue
 */
const hasToDrawByTransparent = computed(() => {
  // 全画面表示でなければfalse
  if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
    return false
  }
  // 背景画像非表示の場合はtrue
  if (useUiEventStore().uiEvent.isScriptBgImageHidden) {
    return true
  }
  // シンプルな背景画像表示の場合はfalse
  if (useUiEventStore().uiEvent.isScriptBgSimpleImageShowing) {
    return true
  }
  // イラスト画像表示中の場合はtrue
  if (!useUiEventStore().uiEvent.isScriptBgIllustImageShowing) {
    return false
  }

  return true
})

//======================================================
// methods
//======================================================

/**
 * イベント プラスボタンクリック
 */
const onPlusButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isFontSizePlusButtonClicked = true

    _showPlusButtonTooltip.value = true    

    // 1秒後に非表示
    setTimeout(() => {
      _showPlusButtonTooltip.value = false
    }, 1000)
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

    _showMinusButtonTooltip.value = true    

    // 1秒後に非表示
    setTimeout(() => {
      _showMinusButtonTooltip.value = false
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント シェアボタンクリック
 */
const onShareButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isScriptShareDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 縦横切り替えボタンクリック
 */
const onSwitchButtonClick = async () => {
  try {
    useUiEventStore().uiEvent.showFullScreenScriptByVertical = !useUiEventStore().uiEvent.showFullScreenScriptByVertical 
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
</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <v-footer class="px-0" 
    :class="{
      'transparent': hasToDrawByTransparent,
      'dark': hasToDrawByDark && useDisplay().mobile.value,
      'half-dark': hasToDrawByDark && !useDisplay().mobile.value,
      }"
    app>
    <div id="container">
      <v-row class="py-1 pr-0 text-right">
        <v-col cols="12" 
          :class="{
            'pr-2': true,
          }">   

          <!-- マイナスボタン -->
          <v-tooltip
            v-model="_showMinusButtonTooltip"     
            location="bottom" 
          >   
            <template v-slot:activator="{ props }">    
              <span class="ml-0">
                <v-btn id="minus-button" 
                  v-bind="props"                    
                  :class="{
                    'plus-minus-button': true,
                    'button-flat': !hasToDrawByDark,
                  }" 
                  @click="onMinusButtonClick"
                  icon="mdi-minus" 
                  :variant="hasToDrawByDark ? 'text' : 'text'" 
                  :color="hasToDrawByDark ? 'white' : 'grey-darken-2'"
                  rounded />   
              </span>   
            </template>
            台本文字サイズ縮小
          </v-tooltip>  

          <v-tooltip
            v-model="_showPlusButtonTooltip"   
            location="bottom"    
          >   
            <template v-slot:activator="{ props }">
              <!-- プラスボタン -->
              <span class="ml-2">
                <v-btn id="plus-button" 
                  v-bind="props"             
                  :class="{
                    'plus-minus-button': true,
                    'button-flat': !hasToDrawByDark,
                  }" 
                  @click="onPlusButtonClick"
                  icon="mdi-plus"
                  :variant="hasToDrawByDark ? 'text' : 'text'" 
                  :color="hasToDrawByDark ? 'white' : 'grey-darken-2'"
                  rounded
                  >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </span>
            </template>
              台本文字サイズ拡大
          </v-tooltip>            

          <!-- シェアボタン -->
          <span class="mx-2">
            <v-btn id="share-button"      
              @click="onShareButtonClick"               
              icon="mdi-share-variant"
              :variant="hasToDrawByDark ? 'text' : 'text'" 
              :color="hasToDrawByDark ? 'white' : 'grey-darken-2'"
              >
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </span>

          <!-- メニューボタン -->
          <script-detail-menu-button 
            :outlined="hasToDrawByDark"
            />            
        </v-col>
      </v-row>
    </div>
  </v-footer>
</template>

<!--
======================================================
  CSS
======================================================  
-->
<style lang="scss" scoped>

.v-footer {
  height: $footer-height;
  padding: 4px 16px;
  background-color: rgba(255, 255, 255, 1);
  z-index: 10;
}

#container {
  margin: auto;
  width: $script-full-screen-inner-width;
}

.transparent {
  background-color: transparent !important;
}

.dark {
  background-color: rgb(0, 0, 0, 0.7) !important;  
}

.half-dark {
  background-color: rgb(0, 0, 0, 0.4) !important;  
}

.half-white {
  background-color: rgb(255, 255, 255, 0.4) !important;
}


#close-button {
  position: absolute;
  top: 10px;
  height: 30px;
  left: 10px;
}

#switch-button {
  position: absolute;
  top: 16px;
  height: 30px;
  left: 10px;
}

.plus-minus-button {
  width: 36px;
  height: 30px; 
  font-size: 100%;
}

.button-flat {
  color: #8f8f8f !important;
}

.button-switch-flat {
  background-color: white !important;
  color: #454545 !important;
  border: solid 1px #C7C7C7;
}
</style>
