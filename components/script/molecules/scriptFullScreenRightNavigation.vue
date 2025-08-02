<script lang="ts" setup>
//======================================================
//
// scriptFullScreenRightNavigation.vue
// 台本全画面時の右側のナビゲーションエリア
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import * as  CONSTANTS from '@/composables/etc/constants'
import * as scriptStore from '@/store/scriptStore'
import Script from "@/composables/type/script"

//======================================================
// methods
//======================================================

/**
 * イベント プロフィールアイコンクリック
 */
const onAuthorProfileClick = () => {
  try {    
    console.log("onAuthorProfileClick")

    useUiEventStore().uiEvent.profileShowingTargetUserId = useScriptStore().targetScript.authorUser.id!
    useUiEventStore().uiEvent.isUserProfileDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

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

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <template
    v-if="useUiEventStore().uiEvent.isScriptFullScreenDialogShowing"
    >
    <v-navigation-drawer 
      id="right-menu" 
      location="right"
      class="py-4 px-4"
      >

      <!-- 台本情報 -->
      <v-card class="card-outer-container mt-6 dark-text">      
        <v-card-title class="text-center text-caption">  『{{ useScriptStore().targetScript!.title }}』</v-card-title>     
          <v-divider color="black" />
          <v-card-text class="pl-4 pb-6">
            <v-row class="mt-0">
              <v-col class="pt-0 pb-2 text-center">
                <p id="author-profile-contianer" class="mb-2"
                  @click="onAuthorProfileClick"
                  >
                  <div id="profile-image-container"
                  >
                    <v-img id="progile-image" :src="useScriptStore().targetScript!.authorUser.profileImageUrl" class="mr-2"></v-img>
                  </div>
                  <span id="author-user-name"
                  >{{ useScriptStore().targetScript!.authorUser.name }}</span>
                </p>
                <p class="text-caption">
                  {{ useScriptStore().targetScript!.actorCount }}人用台本
                  {{ useScriptStore().targetScript!.minutes }}分           
                </p>

                <p class="mt-4">
                  <!-- お気に入りボタン -->
                  <script-like-button :is-for-right-menu="true" />

                  <!-- メニューボタン -->
                  <script-detail-menu-button
                    :outlined="true"
                  />         
                </p>
              </v-col>
            </v-row>
          </v-card-text>        
      </v-card>

      <!-- 文字サイズ拡大縮小ボタン -->
      <template v-if="!useDisplay().mobile.value">
        <v-card class="card-outer-container mt-10 dark-text">        
          <v-card-title class="text-center text-caption">文字サイズ</v-card-title>     
            <v-divider color="black" />
            <v-card-text class="pl-4 pb-6">
              <v-row class="mt-0">
                <v-col class="pt-0 pb-2 text-center">

                  <p class="mt-4">
                    <!-- マイナスボタン -->
                    <v-btn 
                      class="mr-2 text-caption" 
                      @click="onMinusButtonClick"
                      icon="mdi-minus"                                       
                      density="comfortable" variant="outlined" />
                              
                    <!-- プラスボタン -->
                    <v-btn 
                      class="mr-2 text-body-1"
                      icon="mdi-plus" 
                      @click="onPlusButtonClick"
                      density="comfortable"  variant="outlined" />
                  </p>
                </v-col>
              </v-row>
            </v-card-text>        
        </v-card>      
      </template>
    </v-navigation-drawer>
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

// 右側のメニュー
#right-menu {
  background-color: rgba(0, 0, 0, 0);  
  /** iOS対応 */
  padding-top: calc(env(safe-area-inset-top));

  z-index: 10;
  border: solid 0px #999999;
}

.v-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
}

.card-outer-container {
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.5);
}

.card-inner-container {
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.8);
}

#author-profile-contianer {
  display: flex;
  width: fit-content;
  margin: 0 auto;
  cursor: pointer;
}

#profile-image-container {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: solid 0px #bebebe;
}

#progile-image {
  width: 100%;
  border-radius: 50%;
  border: solid 1px rgba(0, 0, 0, 0.2);
}

#author-user-name {
  margin-top: 4px;
  margin-left: 8px;
  font-size: 80%;
}

#buttons-container {
  position: relative;
  text-align: center;
}

#bottom-buttons-container {  
  position: absolute;
  bottom: 40px;
  text-align: center;
}


.v-btn {
  opacity: 0.5;
}

.dark-text {
  position: relative;
  display: block;
  //width: fit-content;
  /*min-height: 2em;*/
  margin-left: 0.2em;
  margin-bottom: 0.3em;
  padding: 0.3em 0.4em;
  color: white;
  font-size: 0.85em;
  line-height: 1.7em;
  border: solid 0px #999999;
  border-radius: 4px;
  background-color: rgb(0, 0, 0, 0.36)
}

</style>
