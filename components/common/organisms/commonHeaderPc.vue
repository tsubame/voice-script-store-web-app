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
  <!-- 上メニュー時 -->
  <template v-if="!CONSTANTS.USE_LEFT_NAVIGATION_AT_PC">
    <header 
      id="header-container" 
      :class="{ sticky: isInTopPage() }"
      v-if="!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing">      
      <v-container id="layout-container" class="my-0 py-0">
        <div class="header-inner">
          <!-- ロゴ -->
          <common-header-logo-container />

          <!-- ヘッダナビゲーション -->
          <div id="header-bottom-container">         
            <common-header-pc-navigation />
          </div>

          <div id="header-right-area" class="pr-4">
            <!-- 検索ボックス -->
            <template v-if="CONSTANTS.SHOW_SEARCH_ICON_TO_HEADER">
              <common-header-search-text-box />
            </template>
            
            <!-- 通知アイコン -->
            <template v-if="CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_PC">
              <common-header-notification-icon />
            </template>

            <!-- プロフィールアイコン -->
            <common-header-profile-icon />
          </div>  
        </div>
      </v-container>
    </header>
  </template>

  <!-- 左メニュー時 -->
  <template v-else>
    <v-app-bar 
      id="app-bar-container" 
      fixed="false"
      absolute
      :class="{ sticky: isInTopPage() }"
      v-if="!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing">      
      <v-container id="layout-container" class="my-0 py-0">
        <div class="header-inner">
          <!-- ロゴ -->
          <common-header-logo-container />

          <div id="header-right-area" class="pr-4">
            <!-- 検索ボックス -->
            <template v-if="CONSTANTS.SHOW_SEARCH_ICON_TO_HEADER">
              <common-header-search-text-box />
            </template>
            
            <!-- 通知アイコン -->
            <template v-if="CONSTANTS.SHOW_NOTIFICATION_ICON_TO_HEADER_AT_PC">
              <common-header-notification-icon />
            </template>

            <!-- プロフィールアイコン -->
            <common-header-profile-icon />
          </div>  
        </div>
      </v-container>
    </v-app-bar>    
  </template>  
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
  top: calc(var(--header-height-difference) * -1); 
	height: var(--header-container-height);
	box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
  font-family: "DM Sans", sans-serif;
  background-color: white; 
	line-height: 1.5;

  z-index: 10;
}

// ヘッダーコンテナ
#app-bar-container {
  display: flex;
  top: calc(var(--header-height-difference) * -1); 
	height: var(--header-inner-height);
	box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
  font-family: "DM Sans", sans-serif;
  background-color: white; 
	line-height: 1.5;

  z-index: 10;
}

#layout-container {
  max-width: $header-top-max-width;
  position: relative;  
}

#header-bottom-container {
  width: 100%;
  max-width: $header-bottom-max-width;
  margin: auto;
}

.sticky {
  position: sticky;
}

.header-inner {  
	height: var(--header-inner-height);
	top: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

// ヘッダ右側のエリア
#header-right-area {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 8px;
  right: 0;
  width: 300px;
}

</style>
