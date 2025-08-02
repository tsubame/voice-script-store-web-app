<script lang="ts" setup>
//======================================================
//
// userSettingDialog.vue 設定用ダイアログ
//
//======================================================

import { reactive, onMounted, nextTick, watch, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import UserSetting from '@/composables/type/userSetting'
import { useLoginUserStore } from '../../../store/loginUserStore';

//======================================================
// vars
//======================================================

// フォームの値
const _formVals = reactive({
  userSetting: new UserSetting(),
})


//======================================================
// onMounted
//======================================================

/**
 * イベント onMounted
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
 * OKボタンクリック
 */
const onOkButtonClick = async() => {
  try {
    // ユーザIDをセット
    _formVals.userSetting.userId = useLoginUserStore().user.id

    // ユーザ設定を保存
    let res = await phpApiManager.usePostCreateUserSetting(_formVals.userSetting, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      // 成功
      console.log("ユーザ設定を保存しました")
  
      useUiEventStore().uiEvent.isUserSettingDialogShowing = false  
      // store更新
      useUserSettingStore().setDbSavedUserSetting(_formVals.userSetting)            
    } else {
      // 失敗
      console.error("ユーザ設定の保存に失敗しました")
    }

  } catch (error) {
    console.error(error);
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isUserSettingDialogShowing = false        
  } catch (error) {
    console.error(error);
  }
}

//======================================================
// watch
//======================================================

/**
 * ユーザ設定データをセット
 */
watch(() => useUiEventStore().uiEvent.isUserSettingDialogShowing, (newVal, oldVal) => {
  try {
    if (useUiEventStore().uiEvent.isUserSettingDialogShowing) {
      console.log(useUserSettingStore().dbSavedUserSetting)


      if (useUserSettingStore().dbSavedUserSetting.showNewPostNotification) {
        _formVals.userSetting.showNewPostNotification = true
      } else { 
        _formVals.userSetting.showNewPostNotification = false
      }

      if (useUserSettingStore().dbSavedUserSetting.showCommentNotification) {
        _formVals.userSetting.showCommentNotification = true
      } else { 
        _formVals.userSetting.showCommentNotification = false
      }

      if (useUserSettingStore().dbSavedUserSetting.showScriptFavoriteNotification) {
        _formVals.userSetting.showScriptFavoriteNotification = true
      } else { 
        _formVals.userSetting.showScriptFavoriteNotification = false
      }

      if (useUserSettingStore().dbSavedUserSetting.showAgeRestrictedScript) {
        _formVals.userSetting.showAgeRestrictedScript = true
      } else { 
        _formVals.userSetting.showAgeRestrictedScript = false
      }

      if (useUserSettingStore().dbSavedUserSetting.showFavCountAndWatchCount) {
        _formVals.userSetting.showFavCountAndWatchCount = true
      } else { 
        _formVals.userSetting.showFavCountAndWatchCount = false
      }

      console.log(_formVals.userSetting)
    }
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
  <v-dialog 
    v-model="useUiEventStore().uiEvent.isUserSettingDialogShowing" 
    :fullscreen="useDisplay().smAndDown.value" 
    max-width="650px">
    <div id='outer-container'>
      <!-- 閉じるボタン -->
      <v-btn id='close-button-mobile' icon='mdi-close' variant="text" @click='onClickDialogCloseButton' />

      <v-card id="inner-container" class="px-0">
        <div id="inner-card-container">
          <!-- タイトル -->
          <v-card-title id="title" class="mt-2 mb-4 px-1 text-left">
            <span class="title-icon text-body-2 mr-2">
              <v-icon class="h-icon" color="teal-lighten-2">mdi-cog</v-icon>
            </span>
            <span class="text-subtitle-1 font-weight-bold">設定変更</span>
          </v-card-title>
          <v-card-text>
            <v-container class="text-left px-0 mx-0">
              <v-row class="mb-1 pl-2">
                <v-col>
                  <h4
                  :class="{
                    'pl-7': useDisplay().smAndUp.value,
                  }"
                    >「新着通知」に表示する項目</h4>
                </v-col>
              </v-row>
              
              <v-card class="list-container text-body-1" flat>
                <v-row class="my-0">
                  <v-col cols="9" class="py-2">
                    <p class="switch-label">
                      <!--<v-icon class="h-icon mr-2" color="teal-lighten-3">mdi-note</v-icon>-->フォロー中の作者の台本投稿</p>                  
                  </v-col>              
                  <v-col cols="3">
                    <v-switch
                      v-model=" _formVals.userSetting.showNewPostNotification"
                      color="teal"
                      hide-details
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-divider />
                <v-row class="my-0">
                  <v-col cols="9" class="py-2">
                    <p class="switch-label">
                      <!--<v-icon class="h-icon mr-2" color="teal-lighten-3">mdi-message-processing-outline</v-icon>-->
                      自作台本へのコメント</p>                  
                  </v-col>              
                  <v-col cols="3">
                    <v-switch
                      v-model="_formVals.userSetting.showCommentNotification"
                      color="teal"
                      hide-details
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>              

                <v-divider />
                <v-row class="my-0">
                  <v-col cols="9" class="py-2">
                    <p class="switch-label">
                      <!--<v-icon class="h-icon mr-2" color="teal-lighten-3">mdi-star</v-icon>-->
                      自作台本へのお気に入り</p>                  
                  </v-col>              
                  <v-col cols="3">
                    <v-switch
                      v-model="_formVals.userSetting.showScriptFavoriteNotification"
                      color="teal"
                      hide-details
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>                       
              </v-card>

              <v-row class="mb-1 pl-2 mt-8">
                <v-col>
                  <h4
                  :class="{
                    'pl-8': useDisplay().smAndUp.value,
                  }"                  
                  >台本表示設定</h4>
                </v-col>
              </v-row>

              <v-card  class="list-container text-body-1"  flat>
                <v-row class="my-0">
                  <v-col cols="9" class="py-2">
                    <p class="switch-label">
                      <v-icon class="h-icon mr-1" color="red-lighten-3">mdi-alert-box</v-icon>
                      R18台本を一覧に表示</p>                  
                  </v-col>              
                  <v-col cols="3">
                    <v-switch
                      v-model="_formVals.userSetting.showAgeRestrictedScript"
                      color="teal"
                      hide-details
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-divider />
                <!--
                <v-row class="my-0">
                  <v-col cols="9" class="py-2">
                    <p class="switch-label">
                      台本の閲覧数を表示</p>                  
                  </v-col>              
                  <v-col cols="3">
                    <v-switch
                      v-model="_formVals.userSetting.showFavCountAndWatchCount"
                      color="teal"
                      hide-details
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>        
              -->      
              </v-card>
              
              <v-row justify="center" class="mt-10 px-3">
                <v-spacer></v-spacer>
                <!-- OKボタン -->
                <v-btn id="ok-button" color="teal" elevation="2" @click="onOkButtonClick">
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>
          </v-card-text>
        </div>
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
  //background-color: rgba(255, 255, 255, 0.5);

  background-color: $bg-orange-color;  
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
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

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 10px);   
  right: 10px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

#inner-card-container {
  //max-width: 550px;
  margin: auto;
}

.title-icon {
  position: relative;
  top: -1px;
  margin-left: 0em;
  margin-right: 0.3em;
  border: solid 0px #999999;
  font-size: small;
}

.v-icon {
  top: -2px;
}

h5 {
  max-width: 550px;
  margin: auto;  
}

.list-container {
  max-width: 550px;
  margin: auto;
  border: solid 1px #BCBCBC;
}

.switch-label {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  font-size: 100%;
  font-weight: bold;
}

.v-switch {
  position: absolute;
  right: 20px;
}

#ok-button {
  width: 100%;
  max-width: 360px;
  height: 60px;
  margin: 0.5em 2em 2em;
  vertical-align: middle;
  color: #FFFFFF;
  font-size: large;
  font-weight: bold;
}
</style>