<script lang="ts" setup>
//======================================================
//
// commonHeader.vue ヘッダ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import Script from '@/composables/type/script'

//======================================================
// vars
//======================================================

// 左メニューを表示するか
const _showLeftNavigation = ref(true)

//======================================================
// computed
//======================================================

/**
 * ヘッダを表示するか
 * 
 * @return 
 */
const hasToShowHeader = computed(() => {
  try {
    // 台本全画面ダイアログ表示中なら非表示
    if (useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      return false
    }

    // モバイル環境にて、台本視聴中なら非表示
    console.log('閲覧中の台本')
    console.log(useScriptStore().targetScript.id)

    if (CONSTANTS.HIDE_HEADER_ON_SCRIPT_DETAIL_FOR_MOBILE) {
      if (useScriptStore().targetScript.id != 0) {
        return false
      }
    }
  } catch (error) {
    console.error(error)
  }

  return true
})

//======================================================
// methods
//======================================================

/**
 * トップページ表示中かを返す
 * 
 * @returns {boolean} トップページ表示中か
 */
const isInTopPage = (): boolean => {
  try {
    if (useRoute().fullPath.indexOf(CONSTANTS.URL_QUERY_KEY_SCRIPT_ID) === -1) {
      return true
    }
  } catch (error) {
    console.error(error)
  }

  return false
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
  <header 
    id="header-container" 
    :class="{ sticky: isInTopPage() }"
    v-show="hasToShowHeader">      
    <v-container id="layout-container" class="px-0 my-0">
      <div class="header-inner">
        <!-- ロゴ -->
        <common-header-logo-container />

        <!-- ヘッダナビゲーション -->
        <template v-if="!useDisplay().mobile.value">
          <common-header-pc-navigation />
        </template>

        <div id="header-right-area" class="pr-3">
          <!-- 検索ボックス --> 
          <template v-if="CONSTANTS.SHOW_SEARCH_ICON_TO_HEADER">
            <common-header-search-text-box />
          </template>

          <!-- 通知アイコン -->
          <template v-if="CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_MOBILE">
            <common-header-notification-icon />
          </template>

          <!-- プロフィールアイコン -->
          <template v-if="CONSTANTS.SHOW_USER_ICON_TO_HEADER">
            <common-header-profile-icon />
          </template>

          <!-- モバイル用メニュー -->
          <template v-if="useDisplay().mobile.value">
            <div id="mobile-menu-container"> 
              <!-- 通知なし -->
              <template v-if="useUiEventStore().uiEvent.newNotificationCount === 0">
                <v-btn
                  id="mobile-menu-button"
                  @click="useUiEventStore().uiEvent.isLeftNavigationShowing = true"
                  class="text-h6"
                  variant="text" color="grey">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <!-- 通知あり -->
              <template v-else>
                <v-badge
                  id="header-mobile-notification-badge"
                  @click="useUiEventStore().uiEvent.isLeftNavigationShowing = true"
                  color="success"
                  offset-y="10"
                  offset-x="12"
                  :content="useUiEventStore().uiEvent.newNotificationCount"
                  density="compact"
                  >
                  <v-btn
                    id="mobile-menu-button"
                    @click="useUiEventStore().uiEvent.isLeftNavigationShowing = true"
                    class="text-h6"
                    variant="text" color="grey">
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                </v-badge>
              </template>
            </div>           
          </template>          
        </div>  
      </div>
    </v-container>
  </header>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

// ヘッダーコンテナ
#header-container {
  display: flex;
  top: 0px; 

  // iOS対応 
  height: calc(env(safe-area-inset-top) + 60px); 
  // iOS対応
  padding-top: calc(env(safe-area-inset-top) + 0px); 

  margin-bottom: 0px;

	box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
  font-family: "DM Sans", sans-serif;
  background-color: white; 
	line-height: 1.5;
  z-index: 10;
}

#layout-container {
  position: relative;  
  max-width: $header-max-width;
}

// 固定したい場合のみコメントアウト解除
.sticky {
  //position: sticky;
}

.header-inner {  
  // iOS対応 
  height: calc(env(safe-area-inset-top) + 60px);   
	top: 0px;

	display: flex;
	align-items: center;
	justify-content: space-between;
  border: solid 0px #999999;
}

#mobile-menu-container {
  height: 40px;  
  margin-top: -6px;
  border: solid 0px #999999;
}

#mobile-menu-button {
  height: 50px;
  margin-top: 2px;
  margin-left: -18px;
  border: solid 0px #999999;
}

// ヘッダ右側のエリア
#header-right-area {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 10px;
  right: -10px;
  max-width: 300px;
  border: solid 0px #999999;
}

</style>
