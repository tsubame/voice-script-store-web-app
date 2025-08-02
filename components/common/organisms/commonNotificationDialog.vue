<script lang="ts" setup>

//======================================================
//
// commonNotificationDialog.vue.vue 
// 新着通知一覧ダイアログ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import * as CONSTANTS from "@/composables/etc/constants"
import Notification from '@/composables/type/notification';

//======================================================
// methods
//======================================================

/**
 * イベント アイテムクリック
 * ・台本にジャンプ、またはユーザのプロフィール表示
 * 
 * @param {Notification} nf
 */
const onListItemClick = (nf: Notification) => {
  try {
    // 台本にジャンプ
    if (nf.scriptId !== 0) {
      // 閲覧用の台本IDをセット
      useScriptStore().watchingScriptId = nf.scriptId
      // クリックイベントをstoreにセット
      useUiEventStore().uiEvent.hasNotifactionScriptItemClicked = true
      // 台本一覧ページにいない場合、遷移
      navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS + "?" + CONSTANTS.URL_QUERY_KEY_SCRIPT_ID + "=" + nf.scriptId)
      // ダイアログを閉じる
      useUiEventStore().uiEvent.isNotificationDialogShowing = false
      // クリックイベントを0.5秒後に解除
      setTimeout(() => {
        useUiEventStore().uiEvent.hasNotifactionScriptItemClicked = false
      }, 500)

      return
    }

    // ユーザのプロフィール表示
    if (nf.userId !== 0) {
      useUiEventStore().uiEvent.isUserProfileDialogShowing = true
      useUiEventStore().uiEvent.profileShowingTargetUserId = nf.userId
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント プロフィールアイコンクリック
 * 
 * @param {Notification} nf
 */
const onUserImageClick = (nf: Notification) => {
  try {
    console.log('onUserImageClick')

    // ユーザのプロフィール表示
    if (nf.userId !== 0) {
      useUiEventStore().uiEvent.isUserProfileDialogShowing = true
      useUiEventStore().uiEvent.profileShowingTargetUserId = nf.userId
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 新着かを返す
 * 
 * @param {Notification} nf
 * @returns {boolean} 新着か
 */
const isNewItem = (nf: Notification): boolean => {
  try {
    let d = new Date(nf.postedAt)
    let w = new Date(useLoginUserStore().user.notifyPageWatchDate)

    //console.log('通知閲覧日時')
    //console.log(w)

    return w < d
  } catch (error) {
    console.error(error)
  }

  return false
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isNotificationDialogShowing = false
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
  <v-dialog 
    v-model='useUiEventStore().uiEvent.isNotificationDialogShowing'    
    :fullscreen="useDisplay().mobile.value" 
    :transition="useDisplay().mobile.value ? 'dialog-transition' : 'dialog-transition'"  
    max-width="750px">
    <div id='outer-container'>

      <v-card id="inner-container">
        <!-- タイトル -->
        <v-card-title id="title" class="mt-2 mb-4 text-left">
          <span class="title-icon text-body-2 mr-2">
            <v-icon color="teal-lighten-2">mdi-information</v-icon>
          </span>
          <span class="text-subtitle-2 font-weight-bold">新着通知</span>

          <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text :class="{ 'not-mobile-v-card-text': !useDisplay().mobile.value }">
          <!-- 通知無しの場合 -->           
          <template v-if="useLoginUserStore().user.notifications.length === 0">        
            <!-- 通知無しの場合 -->
            <template v-if="useLoginUserStore().hasLogined()">      
              <p>新着通知はありません。</p>               
            </template>          

            <v-row>
              <v-col>
                <template v-if="!useLoginUserStore().hasLogined()">
                  <v-alert
                    class="my-4 text-left bg-white"
                    color="teal"
                    icon="$info"
                    variant="outlined"
                  >ログイン後、作者をフォローするとここに新着台本通知が一覧表示されます。</v-alert>                    
                </template>
                <template v-else>
                  <v-alert
                    class="my-8 text-left bg-white"
                    color="teal"
                    icon="$info"
                    variant="outlined"
                  >フォロー中の作者の台本投稿、または自作台本へのコメントがあった際にここに表示されます。</v-alert>          
                </template>    
                </v-col>
            </v-row>               
          </template>
          <!-- 通知ありの場合 -->
          <template v-else>
            <div id="list-container">
              <v-list lines="two" class="mx-0 mt-0 mb-8 px-2 py-0 ">
                <template v-for="(nf, i) in useLoginUserStore().user.notifications" v-bind:key="i">
                  <v-list-item 
                    :class="{ 'py-0': true, 'my-0': true, 'px-0': true, 'isNewNotification': isNewItem(nf) }"
                    >
                    <div id="item-list" class="my-0 py-2 pl-2">
                      <div id="list-item-prepend-area">
                        <!-- 新着 -->
                        <div class="new-mark-container">
                          <v-icon class="new-mark" color="success" v-if="isNewItem(nf)">mdi-circle</v-icon>
                        </div>

                        <!-- ユーザアイコン -->
                        <div class="user-icon-container">                       
                          <v-avatar size="30" class="mr-0 ml-1" rounded="4" @click="onUserImageClick(nf)">
                            <v-img :src="nf.user.profileImageUrl" class="user-icon" />
                          </v-avatar>
                        </div>
                      </div>

                      <div class="text-caption text-left" id="list-item-append-area" @click="onListItemClick(nf)">
                        <span class=" user-name">{{ nf.user.name }}</span>

                        {{ nf.message.replace(nf.user.name, "") }}

                        <v-list-item-subtitle class="date-container text-right pr-2 text-grey-darken-2" @click="onListItemClick(nf)">
                          <small>{{ new Date(nf.postedAt).toLocaleDateString() }}
                          </small>
                        </v-list-item-subtitle>
                      </div>
                    </div>
                  </v-list-item>
                  <v-divider class="mx-0"></v-divider>
                </template>
              </v-list>
            </div>
          </template>
        </v-card-text>
        <v-card-actions class="text-center justify-center">
          <v-btn color="teal" id="action-close-button" class="mt-8 mb-8 font-weight-bold" variant="elevated" @click='onClickDialogCloseButton'>
            閉じる
          </v-btn>
        </v-card-actions>
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

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

#outer-container {
  padding: 0px;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow-y: auto;
  z-index: 10;
  opacity: 1;
}

#inner-container {
  position: relative;  
  height: 100%;
  padding-top: calc(env(safe-area-inset-top) + 0px); 

  background-color: $bg-grey-color;
  overflow-y: auto;  
}

#title {
  width: 95%;
  margin: auto;
  border-bottom: solid 1px #CCCCCC;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 10px);   
  right: 0px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.v-card-text {
  margin: auto;
  margin-top: 40px;
  overflow-y: auto;  
}

.not-mobile-v-card-text {
  max-height: 600px;
  margin: auto;
  margin-top: 40px;  
  overflow-y: auto;  
}

#list-container {
  max-width: 600px;
  margin: 0 auto;
  border: solid 0px #999999;
}

.v-list {
  max-width: 600px;
  border: solid 1px #c3c3c3;
  border-radius: 4px;
}

.v-list-item {
  margin: 0px auto;
  padding: 8px;
  border: solid 0px #999999;
}

.v-list-item-title {
  font-size: 100%;
}

#item-list {
  display: flex;
  min-height: 80px;
  border: solid 0px #999999;
  align-items: center;
}

#item-list:hover {
  background-color: #e7e7e7;
  cursor: pointer;
}

#list-item-prepend-area {
  display: flex;
  width: fit-content;
  border: solid 0px #999999;
}

.new-mark-container {
  display: flex;
  align-items: center;
  width: 12px;
  height: 100%;
  min-height: 50px;
  border: solid 0px #999999;
}

.new-mark {
  display: flex; 
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.user-icon-container {
  display: flex;
  align-items: center; 
  border: solid 0px #999999;
}

.user-icon {
  border-radius: 50%;
}

#list-item-append-area {
  width: 100%;
  margin: 0px;
  padding: 8px 12px;
  border: solid 0px #999999;
}

.user-name {
  font-weight: bold;
  z-index: 10;
}


#close-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  color: #585858;
  font-size: x-small;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.7);
}

#action-close-button {
  width: 100%;
  max-width: 200px;
  height: 40px;
  margin: auto;
  border: solid 0px #999999;
}

.v-alert {
  max-width: 500px ;
  margin: auto;
}
</style>