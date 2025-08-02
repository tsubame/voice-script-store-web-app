<script lang='ts' setup>

//======================================================
// 
// loginDialog.vue
//
//======================================================

import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
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

// twitterUser
const _twitterUser = ref<TwitterUser>(new TwitterUser()) 
// twitterUser
const _googleUser = ref<GoogleUser>(new GoogleUser()) 
// ユーザ
const _user = ref<User>(new User())
// ボタンを非表示にするか
const _isButtonHidden = ref(false)

//======================================================
// computed
//======================================================

/**
 * iOSユーザかを返す
 */
const isIosUser = computed(() => {
  return /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);
})


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
 * イベント Twitter認証ボタン押下
 */
const onClickTwitterAuthWithPopup = async () => {
  try {
    // セキュリティ対策のため空欄化済
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント Google認証ボタン押下（SignInWithPopup）
 */
const onClickGoogleAuthWithPopup = async () => {
  try {
    // セキュリティ対策のため空欄化済 
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isLoginDialogShowing = false    
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
  <v-dialog 
    v-model="useUiEventStore().uiEvent.isLoginDialogShowing" 
    :fullscreen="useDisplay().smAndDown.value" 
    max-width="600px">
    <div id='outer-container'>
      <v-btn id='close-button-mobile' variant="text" @click='onClickDialogCloseButton'>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card id="inner-container" class="pb-12">
        <!-- タイトル -->
        <v-card-title id="title" class="mt-2 mb-4 px-0 text-left">
          <v-icon color="teal" class="title-icon mr-3 text-h5">mdi-login</v-icon>         
          <span class="title-text text-body-1 font-weight-bold">ログイン</span>

        </v-card-title>
        <v-card-text class='py-2 mx-2'>
          <p class='text-left mt-4 mb-4 text-body-2'>
            <p>台本投稿、お気に入り等の機能を使うにはログインが必要です。</p>
            <p class="mt-2">以下SNSアカウントのどちらかでログインし、当サイトに未登録の場合はプロフィール登録を行って下さい。</p>
          </p>

          <!-- ボタン非表示-->
          <template v-if="_isButtonHidden">
            <div id="loading-container" class="mt-12">
              <v-progress-circular
                  :size="40"
                  color="grey"
                  indeterminate
                ></v-progress-circular>

              <v-alert
                class="mt-10 bg-white text-left"
                color="info"
                icon="$info"
                variant="outlined"
              >
                <p>ログイン中です。</p>
              </v-alert>
            </div>
          </template>
          <template v-else>
            <v-row class='mt-8'>
              <v-col cols='12'>
                <v-btn class='login-button font-weight-bold text-body-1' color="black" @click="onClickTwitterAuthWithPopup">
                  <template v-slot:prepend>
                    <v-icon class="mr-2">mdi-alpha-x-box</v-icon>
                  </template>
                  <span>
                  Xでログイン
                  </span>
                </v-btn>
              </v-col>
              <v-col cols='12' class="mb-4">
                <v-btn class='login-button font-weight-bold text-body-1' color="success" @click="onClickGoogleAuthWithPopup">
                  <template v-slot:prepend>
                    <v-icon class="mr-2">mdi-google</v-icon>
                  </template>
                  Googleでログイン
                </v-btn>
              </v-col>

              <v-col cols='12' class="mb-12 text-left">  
                <v-alert
                  class="mt-10 bg-white"
                  color="teal-lighten-2"
                  icon="$info"
                  variant="outlined"
                >                
                  <span class="text-teal-darken-2">
                    <p>Xでログインする場合、上のボタンを押す前に先にブラウザからXにログインしておいて下さい。</p>          
                  </span>
                </v-alert>                            
              </v-col>
            </v-row>
          </template>
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
.dialog {
  overflow-y: hidden;  
}

#outer-container {
  padding: 0px;
  height: 100%;
  /** 半透明の白に */
  //background-color: red;// #F4F4F4; //rgba(255, 255, 255, 1);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow-y: hidden;
  z-index: 10;
  opacity: 1;
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
  border-bottom: solid 1px #CCCCCC;
}

.title-icon {
  top: -2px;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 10px);   
  right: 4px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.v-card-text {
  max-width: 700px;
  margin: auto;
}

.v-alert {
  max-width: 400px;
  margin: auto;
}

#ok-button {
  width: 100%;
  max-width: 400px;
  height: 60px;
  vertical-align: middle;
  color: #FFFFFF;
  font-size: large;
  font-weight: bold;
}
.login-button {
  margin-top: 20px;
  width: 300px;
  height: 60px;
  text-transform: none;  
  border-radius: 40px;
}

#loading-container {
  margin: auto;
}

</style>