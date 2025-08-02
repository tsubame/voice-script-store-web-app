<script lang="ts" setup>
//======================================================
//
// commonHeaderProfileIcon.vue プロフィールアイコン
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as  CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { PROFILE_MENU_ITEMS_FOR_LOGINED_WITH_NOTIFICATION } from '../../../composables/etc/constants';

//======================================================
// vars
//======================================================

const _menuItems = [
  { title: 'プロフィール' },
  { title: 'ログアウト' },
]

//======================================================
// computed
//======================================================

/**
 * ログイン状態に合わせてメニューのアイテム変更
 * 
 * @returns
 */
const getMenuItems = computed((): CONSTANTS.MenuItem[] => {
  try {
    // ログイン済
    if (useLoginUserStore().hasLogined()) {
      if (CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_PC) {
        return CONSTANTS.PROFILE_MENU_ITEMS_FOR_LOGINED_WITH_NOT_NOTIFICATION
      } else { 
        return CONSTANTS.PROFILE_MENU_ITEMS_FOR_LOGINED_WITH_NOTIFICATION
      }
    }
  } catch (error) {
    console.error(error)
  }

  return CONSTANTS.PROFILE_MENU_ITEMS_FOR_NOT_LOGIN
})

//======================================================
// methods
//======================================================

/**
 * イベント メニューアイテムクリック
 * ・リンクがある場合は遷移
 * ・リンク先がマイページの場合、uidに自分のIDをセット
 * 
 * @param {CONSTANTS.MenuItem} item
 */
const onClickMenuItem = (item: CONSTANTS.MenuItem) => {
  try {
    // 新着通知
    if (item.title === CONSTANTS.MENU_ITEM_NOTIFICATION.title) {
      useUiEventStore().uiEvent.isNotificationDialogShowing = true

      // 通知閲覧日時を更新
      phpApiManager.usePostUpdateUserNotifyPageWatchDate(useLoginUserStore().user, useAccessTokenStore().accessToken)
      // マイページ
    } else if (item.title === CONSTANTS.MENU_ITEM_MY_PAGE.title) {
      let url = item.link
      useScriptStore().watchingScriptId = 0

      if (url === PAGE_NAME_USER_DETAIL) {
        url = PAGE_NAME_USER_DETAIL + '?' + CONSTANTS.URL_QUERY_KEY_USER_ID + '=' + useLoginUserStore().user.id
      }

      navigateTo(url)
      // ログイン
    } else if (item.title === CONSTANTS.MENU_ITEM_LOGIN.title) {
      useUiEventStore().uiEvent.isLoginDialogShowing = true
    // 設定
    } else if (item.title === CONSTANTS.MENU_ITEM_CONFIG.title) { 
      useUiEventStore().uiEvent.isUserSettingDialogShowing = true
    }
  } catch (error) {
    console.log('onClickMenuItem')  
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
<template >
  <div id="header-profile-icon-container">
    <v-menu>
      <!-- プロフィール画像-->
      <template v-slot:activator="{ props }">
        <!-- ログイン済 -->
        <template v-if="useLoginUserStore().hasLogined()"> 
          <!-- 新着通知なし -->
          <template v-if="useUiEventStore().uiEvent.newNotificationCount === 0">
            <v-img 
              id="header-profile-icon" 
              :src="useLoginUserStore().user.profileImageUrl"
              v-bind="props"
            />
          </template>
          <!-- 通知あり -->
          <template v-else>
            <template v-if="!CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_PC">            
              <v-badge 
                id="notification-badge"
                color="success"
                offset-y="4"
                :content="useUiEventStore().uiEvent.newNotificationCount"
                density="compact"
                >         
              </v-badge> 
            </template>

            <v-img 
              id="header-profile-icon" 
              :src="useLoginUserStore().user.profileImageUrl"
              v-bind="props"
              />
          </template>
        </template>        
        <!-- 未ログイン -->
        <template v-else>          
          <v-img 
          id="header-profile-icon" 
          :src="CONSTANTS.DEFAULT_USER_ICON_PATH"
          v-bind="props"            
          />
        </template>          
      </template>

      <!-- メニュー -->
      <v-list class="">
        <v-list-item
          v-for="(item, i) in getMenuItems"
          :key="i"
          @click="onClickMenuItem(item)"
        >
          <template v-slot:prepend>
            <v-icon :color="item.color" class="ml-2 text-body-1">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="mr-8">
            {{ item.title }}
          </v-list-item-title>

          <template v-slot:append>
            <v-badge
              v-if="item.title === CONSTANTS.MENU_ITEM_NOTIFICATION.title && 0 < useUiEventStore().uiEvent.newNotificationCount"
              color="success"
             :content="useUiEventStore().uiEvent.newNotificationCount"
              inline
            ></v-badge>
          </template>  
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

#header-profile-icon-container {
  position: relative;
}

#notification-badge {
  position: absolute;
  right: 0px;
  opacity: 0.8;
  pointer-events: none; /* 子要素に影響を与えないようにする */  
  z-index: 10;
}

#header-profile-icon {
  top: 8px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  //background-color: #999999;
  margin-left: 1rem;
  opacity: 1; /* 子要素の透明度をリセット */
  pointer-events: auto; /* 子要素のイベントを有効にする */
  cursor: pointer;
}

</style>
