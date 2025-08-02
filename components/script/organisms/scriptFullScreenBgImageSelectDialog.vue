<script lang='ts' setup>

//======================================================
// 
// scriptFullScreenBgImageSelectDialog.vue
//
//======================================================

import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import * as ViewRouter from 'vue-router'
import * as CONSTANTS from '@/composables/etc/constants'
import * as firebaseManager from '@/composables/util/firebaseManager'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useLoginUserStore } from '@/store/loginUserStore';
import { useUiEventStore } from '@/store/uiEventStore';
import * as preferenceManager from '@/composables/util/preferenceManager';
import * as loginManager from '@/composables/util/loginManager';
import User from '@/composables/type/user';
import GoogleUser from '@/composables/type/googleUser';
import TwitterUser from '@/composables/type/twitterUser';

//======================================================
// vars
//======================================================

// tooltip表示
const _showCopiedTooltip = ref(false)

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {

  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 背景画像ボタンクリック
 */
const onBgIllustImageButtonClick = async() => {
  try {
    console.log("背景画像ボタンクリック")
    useUiEventStore().uiEvent.isScriptBgIllustImageShowing = true
    useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = false
    useUiEventStore().uiEvent.isScriptBgImageHidden = false        
    useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing = false    

    // Cookieに保存
    await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_FULLSCREEN_BG_IMAGE, CONSTANTS.COOKIE_VAL_FULLSCREEN_BG_IMAGE_ILLUST)       
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント シンプル背景画像ボタンクリック
 */
const onBgSimpleImageButtonClick = async() => {
  try {
    console.log("背景画像ボタンクリック")
    useUiEventStore().uiEvent.isScriptBgIllustImageShowing = false    
    useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = true
    useUiEventStore().uiEvent.isScriptBgImageHidden = false    
    useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing = false    

    // Cookieに保存
    await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_FULLSCREEN_BG_IMAGE, CONSTANTS.COOKIE_VAL_FULLSCREEN_BG_IMAGE_SIMPLE)    
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 背景なしボタンクリック
 */
const onBgImageHiddenButtonClick = async() => {
  try {
    console.log("背景画像ボタンクリック")
    useUiEventStore().uiEvent.isScriptBgIllustImageShowing = false    
    useUiEventStore().uiEvent.isScriptBgSimpleImageShowing = false    
    useUiEventStore().uiEvent.isScriptBgImageHidden = true
    useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing = false

    // Cookieに保存
    await preferenceManager.useSetValToCookie(CONSTANTS.COOKIE_KEY_FULLSCREEN_BG_IMAGE, CONSTANTS.COOKIE_VAL_FULLSCREEN_BG_IMAGE_NONE)    
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing = false
  } catch (error) {
    console.error(error)
  }
}

</script>
<!--
//======================================================
//
// template
//
//======================================================
-->
<template>
  <v-dialog v-model='useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing'>
    <div id='inner-container'>

      <!-- 閉じるボタン -->
      <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-card class='pt-0 pb-10'> 
        <v-card-title class="text-center">
          <h5 class="mt-1">背景変更</h5>
        </v-card-title>     
        <v-card-text class='mx-0 px-0'>
          <v-row class='mt-8 mx-0 text-center'>
            <v-col cols='12' class="px-0">
              <div id="buttons-container" class="d-flex">
                <!-- 背景画像 -->
                <v-btn
                  :class="{ 'card-button': true, 'wide': useDisplay().smAndUp.value }"
                  @click="onBgIllustImageButtonClick"
                  variant="outlined" >
                  <p class="button-image">
                    <v-img 
                    :src="useRuntimeConfig().public.APP_BASE_URL + CONSTANTS.IMAGE_FULLSCREEN_IMAGE_SELECT_BUTTON_ICON_PATH" width="40"
                    rounded
                    />
                  </p>
                  <p class="caption-s-line">画像</p>            
                </v-btn>

                <!-- シンプル -->
                <v-btn 
                  :class="{ 'card-button': true, 'wide': useDisplay().smAndUp.value }"
                  variant="outlined"
                  @click="onBgSimpleImageButtonClick"
                  >
                  <p class="button-icon"><v-icon color="teal-lighten-2" class="text-h4">mdi-image</v-icon></p>
                  <p class="caption-s-line">シンプル</p>            
                </v-btn>

                <!-- 背景なし -->
                <v-btn                
                  :class="{ 'card-button': true, 'wide': useDisplay().smAndUp.value }"
                  variant="outlined"
                  @click="onBgImageHiddenButtonClick"
                >
                  <p class="button-icon"><v-icon color="grey" class="text-h4">mdi-checkbox-blank-outline</v-icon></p>
                  <p class="caption-s-line">背景なし</p>            
                </v-btn>
              </div>
            </v-col>            
          </v-row>
        </v-card-text>
      </v-card>
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

<style lang='scss' scoped>
#outer-container {
  position: fixed;
  top: 0px;  
  margin-top: -10000px;
  text-align: center;
  z-index: 10;
  border: solid 10px #999999;
}

.v-dialog {
  max-width: 500px;
  overflow-y: auto;
}

#inner-container {
  padding: 8px;
  //max-height: 90lvh;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow-y: auto;
  z-index: 10;
  opacity: 0.95;
}

.v-card {
  background-color: $bg-orange-color;  
  overflow-y: auto;
}

#close-button {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 30px;
  height: 30px;
  color: #585858;
  font-size: x-small;
  z-index: 10;
  /** 半透明に */
  background-color: rgba(255, 255, 255, 0.5);
}

#close-button-mobile {
  position: absolute;
  top: 6px;
  right: 0px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

#buttons-container {  
  width: fit-content;
  margin: 0 auto;
  border: solid 0px #999999;
}

.card-button {
  position: relative;  
  width: 90px;
  height: 120px;
  margin: auto;
  margin-right: 4px;
  margin-left: 4px;  
  border: solid 1px #999999;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wide {
  width: 120px;
}

.button-image {
  position: absolute;
  top: 38px;
}

.button-icon {
  position: absolute;
  top: 34px;
}

.caption-s-line {
  position: absolute;
  bottom: 22px;
}

.caption-w-line {
  position: absolute;
  bottom: 8px;
}

</style>