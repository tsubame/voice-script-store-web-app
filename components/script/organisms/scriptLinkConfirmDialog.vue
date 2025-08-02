<script lang='ts' setup>

//======================================================
// 
// scriptLinkConfirmDialog.vue
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
 * イベント はいボタンクリック
 */
const onOkButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isUserScriptLinkDialogShowing = true
    useUiEventStore().uiEvent.isScriptLinkConfirmDialogShowing = false    
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onCancelButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isScriptLinkConfirmDialogShowing = false
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
  <v-dialog v-model="useUiEventStore().uiEvent.isScriptLinkConfirmDialogShowing">
    <div id='inner-container'>      
      <v-card class='pt-0 pb-4'>  
        <v-card-title class="text-center">
          <h5 class="mt-1"><v-icon class="title-icon mr-2" color="teal-lighten-2">mdi-help-circle</v-icon>確認</h5>
          <v-divider class="mt-2" />
        </v-card-title>          
        <v-card-text class='mx-4'>
          <v-row class='mt-8 text-left text-body-1'>
            <v-col cols='12'>
              <p>ユーザ登録が完了しました。</p>

              <p class="mt-5">続けて、過去に声劇台本置き場に投稿した台本の紐づけを実行しますか？</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-alert
                class="mt-4 mx-0 px-4 text-left bg-white"
                color="teal"
                variant="outlined"
              >台本を投稿したことがある場合、「はい」を選択して下さい。
              </v-alert>     
            </v-col>                 
          </v-row>
          <v-row class="mt-12">
            <v-col cols="6">
              <v-btn color="grey-lighten-1" @click="onCancelButtonClick" class="item-button mb-7">
                いいえ
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn color="success" @click="onOkButtonClick" class="item-button mb-3">はい</v-btn>
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
  background-color: $bg-orange-color;
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
  //opacity: 0.95;
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

.login-button {
  margin-top: 20px;
  width: 300px;
  height: 50px;
}

.card-button {
  position: relative;
  width: 120px;
  height: 120px;
  margin: auto;
  border: solid 1px #999999;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-image {
  position: absolute;
  top: 24px;
}

.caption-s-line {
  position: absolute;
  bottom: 22px;
}

.caption-w-line {
  position: absolute;
  bottom: 8px;
}

#dummy-button {
  width: 0px;
  height: 0px;
  opacity: 0;
}


.item-button {
  opacity: 0.9;
  width: 100%;
  max-width: 400px;
  height: 50px;
  font-weight: bold;
  font-size: 120%;
  border-radius: 4px;
}
</style>