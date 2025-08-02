<script lang="ts" setup>
//======================================================
//
// scriptBgImgSelectDialog.vue 背景画像洗濯用ダイアログ
//
//======================================================

import { reactive, onMounted, nextTick, watch, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import { useScriptStore } from '@/store/scriptStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import SearchCondition from '@/composables/type/searchCondition'

//======================================================
// props、emits
//======================================================

// emits
const emits = defineEmits(
  ["onBgImageSelect"]
)

//======================================================
// vars
//======================================================

//======================================================
// onMounted
//======================================================

/**
 * イベント onMounted
 */
onMounted(async () => {
  try {
    console.log("[onMounted] scriptBgImgSelectDialog")
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 画像クリック
 * ・emits実行
 * 
 * @param imageItem 
 */
const onImageClick = (imageItem: CONSTANTS.BgImageItem) => {
  try {
    emits('onBgImageSelect', imageItem)
    useUiEventStore().uiEvent.isSelectBgImgDialogShowing = false            
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isSelectBgImgDialogShowing = false        
  } catch (error) {
    console.error(error);
  }
}

/**
 * 画像のパスを返す
 * ・環境変数のAPP_BASE_URLの値を付与
 * 
 * @param imageItem
 * @returns
 */
const getImagePath = (imageItem: CONSTANTS.BgImageItem): string => {
  let path = ""

  try {
    path = useRuntimeConfig().public.APP_BASE_URL + imageItem.path
  } catch (error) {
    console.error(error);
  }

  return path
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
  <v-dialog 
    v-model="useUiEventStore().uiEvent.isSelectBgImgDialogShowing" 
    :fullscreen="useDisplay().mobile.value" 
    max-width="750px">
    <div id='outer-container'>
      <!-- 閉じるボタン -->
      <v-btn id='close-button-mobile' icon='mdi-close' variant="text" @click='onClickDialogCloseButton' />

      <v-card id="inner-container">
        <!-- タイトル -->
        <v-card-title id="title" class="mt-2 mb-4 text-left">
          <span class="title-icon">
            <v-icon color="teal-lighten-2" class="mr-2">mdi-image</v-icon></span><span class="text-subtitle-2">ヘッダ画像選択
          </span>
          <v-divider class="mt-2"></v-divider>
          <p class="text-caption mt-4 ml-2">
            台本のヘッダ画像を選択して下さい。
          </p>       
        </v-card-title>
        <v-card-text>
          <v-container class="pl-6 pr-6">
            <v-row class="my-4">
              <template v-for="imageItem in CONSTANTS.SCRIPT_POST_FORM_VALS_BG_IMAGE_ITEMS">
                <v-col cols="6" sm="6" md="4" class="d-flex">
                  <v-card class="image-container-card px-2 py-2 mx-2"
                    @click="onImageClick(imageItem)">
                    <v-img
                      :src="getImagePath(imageItem)"
                    />
                    <p class="text-caption text-center mt-2">
                      {{ imageItem.title }}
                    </p>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-container>
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
<style lang="scss" scoped>

#outer-container {
  padding: 0px;
  height: 100%;
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

#inner-container {
  position: relative;  
  height: 100%;
  // iOS対応
  padding-top: calc(env(safe-area-inset-top) + 0px); 

  background-color: $bg-grey-color;
  overflow-y: auto;  
}

#title {
  width: 90%;
  margin: auto;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 8px);   
  right: 20px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.image-container-card {
  width: 200px;
  border: solid 1px #cacaca;
}

.v-img {
  width: 200px;
  border-radius: 4px;
  cursor: pointer;
}

</style>