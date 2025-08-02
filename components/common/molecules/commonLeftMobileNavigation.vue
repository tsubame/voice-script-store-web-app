<script lang="ts" setup>
//======================================================
//
// commonLeftNavigation.vue レフトナビゲーション
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import { useLoginUserStore } from '@/store/loginUserStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import Script from '@/composables/type/script'

//======================================================
// methods
//======================================================

/**
 * イベント メニューアイテムクリック
 * ・トップページならstoreの台本クリア
 * ・台本編集中を解除
 * 
 * @param {CONSTANTS.MenuItem} item - クリックされたメニューアイテム
 */
const onMenuItemClick = (item: CONSTANTS.MenuItem) => {
  try {
    console.log('onTabItemClick', item)

    // トップページなら閲覧中の台本クリア
    if (item.title === CONSTANTS.NAVI_MENU_ITEM_TOP.title) {
      useScriptStore().targetScript = new Script()
      useScriptStore().watchingScriptId = 0
      useScriptStore().isScriptPostingOrEditting = false
      // 台本投稿フォームなら編集中の台本IDクリア
    } else if (item.title == CONSTANTS.NAVI_MENU_ITEM_SCRIPT_EDIT_FORM.title) {
      useScriptStore().edittingScriptId = 0
      useScriptStore().targetScript.id
    }

    // トップページ以外なら検索バーに表示するテキストをクリア
    if (item.title !== CONSTANTS.NAVI_MENU_ITEM_TOP.title) {
      useUiEventStore().uiEvent.searchBarText = ''
    }

    useUiEventStore().uiEvent.isLeftNavigationShowing = false

    navigateTo(item.link)    
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント ログインアイテムクリック
 */
const onLoginMenuClick = () => {
  try {
    console.log('onLoginItemClick')

    // ログインダイアログ表示
    useUiEventStore().uiEvent.isLoginDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 設定アイテムクリック
 */
const onConfigItemClick = () => {
  try {
    useUiEventStore().uiEvent.isUserSettingDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 新着通知アイテムクリック
 */
const onNotificationItemClick = () => {
  try {
    useUiEventStore().uiEvent.isNotificationDialogShowing = true

    // 通知閲覧日時を更新
    if (useLoginUserStore().hasLogined()) {
      phpApiManager.usePostUpdateUserNotifyPageWatchDate(useLoginUserStore().user, useAccessTokenStore().accessToken)
      // 未読件数をセット
      useUiEventStore().uiEvent.newNotificationCount =0
    }
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
<template >
  <v-navigation-drawer
    id="left-navigation"
    v-model="useUiEventStore().uiEvent.isLeftNavigationShowing"
    location="left"
    :touchless="!useUiEventStore().uiEvent.isLeftNavigationShowing"
    temporary
  >
    <v-list class="mt-8 ml-4" density="compact" nav>
      <template v-for="(item, i) in CONSTANTS.NAVI_LINK_ITEMS" :key="i">
        <v-list-item 
          class="py-2"
          @click="onMenuItemClick(item)"
          >
            <template v-slot:prepend>
              <v-icon class="text-h6" :color="item.color">{{  item.icon }}</v-icon>
            </template>

            <v-list-item-title class="font-weight-normal">                            
              {{ item.title }}
            </v-list-item-title> 
          </v-list-item>
      </template>

      <v-divider class="mt-4 mb-4" />

        <!-- ログイン済みなら設定、新着通知 -->
        <template v-if="useLoginUserStore().hasLogined()">
          <!-- ヘッダに通知アイコンを表示しない場合 -->
          <template v-if="!CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_MOBILE">
            <v-list-item 
              class="py-2"
              @click="onNotificationItemClick"
              >
              <template v-slot:prepend>
                <v-icon class="text-h6" :color="CONSTANTS.MENU_ITEM_NOTIFICATION.color">{{ CONSTANTS.MENU_ITEM_NOTIFICATION.icon }}</v-icon>
              </template>

              <v-list-item-title>                            
                {{ CONSTANTS.MENU_ITEM_NOTIFICATION.title }}
              </v-list-item-title> 

              <!-- 通知バッジ -->
              <template v-slot:append>
                <v-badge
                  v-if="0 < useUiEventStore().uiEvent.newNotificationCount"
                  class="mr-6"
                  color="success"
                  :content="useUiEventStore().uiEvent.newNotificationCount"
                  inline
                ></v-badge>
              </template>    

            </v-list-item>
          </template> 

          <v-list-item 
            class="py-2"          
            @click="onConfigItemClick"
            >
            <template v-slot:prepend>
              <v-icon class="text-h6" :color="CONSTANTS.MENU_ITEM_CONFIG.color">{{ CONSTANTS.MENU_ITEM_CONFIG.icon }}</v-icon>
            </template>

            <v-list-item-title>                            
              {{ CONSTANTS.MENU_ITEM_CONFIG.title }}
            </v-list-item-title>           
          </v-list-item>          
        </template>
        <template v-else>
          <v-list-item 
            @click="onLoginMenuClick"
            >
              <template v-slot:prepend>
                <v-icon class="text-h6" color="grey-darken-1">mdi-login</v-icon>
              </template>

              <v-list-item-title>                            
                ログイン
              </v-list-item-title>        
            </v-list-item>
            
        </template>
    </v-list>
  </v-navigation-drawer>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

#left-navigation {
  font-family: "DM Sans", sans-serif;
  z-index: 9;
}

.v-list {
  padding-top: calc(env(safe-area-inset-top) + 0px); 
}

.v-list-item-title {
  line-height: 36px;
  font-size: 110%;
}

#close-button {
  position: fixed;
  right: 0px;
  top: 10px;
  z-index: 10 !important;
}

</style>
