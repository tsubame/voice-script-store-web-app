<script lang="ts" setup>

//======================================================
//
// userProfileDialog.vue ユーザプロフィール用ダイアログ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from "@/composables/etc/constants"
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useMuteUsersStore } from '@/store/muteUsersStore'
import { useFollowUsersStore } from '@/store/followUsersStore'
import { useUiEventStore } from '@/store/uiEventStore'
import { useLoginUserStore } from '@/store/loginUserStore'
import User from '@/composables/type/user'

//======================================================
// vars
//======================================================  

// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});
// 対象ユーザ
const _targetUser = ref<User>(new User())

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
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
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isUserProfileDialogShowing = false
    useUiEventStore().uiEvent.profileShowingTargetUserId = 0
  } catch (error) {
    console.error(error)
  }
}

/**
 * ユーザのプロフィールページへ移動
 */
const onMoveToUserPageButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isUserProfileDialogShowing = false
    useUiEventStore().uiEvent.profileShowingTargetUserId = 0

    // 現在のURLをセット
    let currentUrl = location.href
    console.log("[currentUrl]" + currentUrl)

    // 通知ダイアログを閉じる
    useUiEventStore().uiEvent.isNotificationDialogShowing = false
    // 台本フルスクリーンを解除
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false

    // ユーザページへ
    const url = CONSTANTS.PAGE_NAME_USER_DETAIL + "?" + CONSTANTS.URL_QUERY_KEY_USER_ID + "=" + _targetUser.value!.id      
    navigateTo(url)  
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch ユーザプロフィール表示
 */
watch(() => useUiEventStore().uiEvent.isUserProfileDialogShowing,
  async (isUserProfileShowing) => {
    try {
      if (isUserProfileShowing) {
        // プロフィールデータをセット
        const tid = useUiEventStore().uiEvent.profileShowingTargetUserId
        if (tid !== 0) {
          // APIからユーザデータをセット
          _targetUser.value = await phpApiManager.useGetReadUserWithScriptsAndFollows(tid)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
)
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
    v-model="useUiEventStore().uiEvent.isUserProfileDialogShowing" 
    max-width="500px">
    <div id='outer-container'>
      <div id='inner-container'>
        <v-card class="pt-4 pb-8 ">
          <!-- 閉じるボタン -->
          <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-card-text 
            :class="{ 'transparent': _targetUser.id === 0 }"
            >
            <!-- プロフィール画像 -->
            <v-row justify="center">
              <v-col cols="12" id="profile-icon-container ">
                <v-img :src="_targetUser.profileImageUrl" class="profileIcon" />
              </v-col>
            </v-row>

            <v-row class="py-0 my-0">
              <v-col cols="12" class="text-center">
                <!-- 名前 -->
                <h4 class="mt-2 py-0" id="name-container">
                  <span>{{ _targetUser.name }}</span>
                </h4>

                <!-- Xアカウント -->
                <template v-if="_targetUser.revealTwitterScreenName && _targetUser.twitterScreenName !== ''">
                  <p class="my-4 text-caption" color="grey">
                    <user-x-link-button :target-user="_targetUser" />
                  </p>
                </template>

                <!-- 投稿数 -->
                <p class="text-grey-darken-5 mt-4 mb-2 text-body-1">
                    {{ _targetUser.scripts.length }}<small class="ml-1">作品投稿済</small>
                </p>
                <v-divider class="my-4" />

                <template v-if="_targetUser.description != '' && _targetUser.description !== null">
                  <p class="mt-8 mb-4 text-left px-4" id="description">
                    {{ _targetUser.description }}
                  </p>
                </template>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row class="text-center mt-2 mb-0" v-if="_targetUser.id !== useLoginUserStore().user.id">              
              <v-col cols="12" class="mb-0 py-2">
                <!-- フォローボタン -->
                <user-follow-button :target-user="_targetUser" :isSmallSize="false" />   
                <!-- スペース -->
                <span class="ml-2" />         
                <!-- ミュートボタン -->
                <user-mute-button :target-user="_targetUser" :isSmallSize="false" />   

              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="mt-2 mb-4">
                <v-btn 
                id="move-to-profile-button" 
                class="btn" 
                variant="outlined"
                @click="onMoveToUserPageButtonClick" rounded>
                  作品一覧に移動
                </v-btn>
              </v-col>   
            </v-row>
          </v-card-text>
        </v-card>
      </div>
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
.v-dialog {
  max-width: 500px;
  overflow-y: hidden;
}

#inner-container {
  padding: 0px;
  max-height: 80lvh;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 10;
  opacity: 1;
}

.v-card {
  max-width: 600px;
  min-height: 480px;
  max-height: 90lvh;
  overflow-y: hidden;
  background-color: $bg-grey-color;  
}

.transparent {
  opacity: 0;
}

#h-explain {
  font-size: 60%;
}

.userIcon {
  border-radius: 50%;
}

#tags-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

#name-container {
  position: relative;
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
  background-color: rgba(255, 255, 255, 0.5);
}

#close-button-mobile {
  position: absolute;
  top: 6px;
  right: 12px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.button-title {
  font-weight: bold;
}

#profile-icon-container {
  position: relative;
}

.profileIcon {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  border: solid 2px white;
  opacity: 1;

  /** 背景色を半透明の黒に */
  background-color: rgba(128, 128, 128, 0.5);
}

// ミュートアイコン
#mute-icon {
  top: -2px;
  font-weight: bold;
}

.follow-container {
  text-align: left;
}

.userProfileArea {
  text-align: center;
}

.btn {
  width: 160px;
  //height: 30px;
  font-weight: bold;
  font-size: 90%;
  /** 半透明に */
  opacity: 0.9;
}

#description {
  width: fit-content;
  max-width: 400px;
  max-height: 20lvh;
  margin: 0 auto;
  overflow-y: auto;
  white-space: pre-wrap;
}

#move-to-profile-button {
  font-size: 90%;
}

.button-title {
  font-weight: bold;
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

.confirm-dialog-message {
  font-size: 110%;
  line-height: 160%;
}

.item-explain {
  font-size: 90%;
}

.tag-chip {
  font-size: 80%; /* お好みのフォントサイズに変更 */
  flex: 1;
}

</style>