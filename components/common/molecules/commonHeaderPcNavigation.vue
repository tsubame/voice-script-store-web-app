<script lang="ts" setup>
//======================================================
//
// commonHeaderNavigation.vue ヘッダのナビゲーション
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import Script from '@/composables/type/script'

//======================================================
// methods
//======================================================

/**
 * イベント タブクリック
 * ・トップページならstoreの台本クリア
 * ・台本編集中を解除
 */
const onTabItemClick = (item: CONSTANTS.MenuItem) => {
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
    }

    // トップページ以外なら検索バーに表示するテキストをクリア
    if (item.title !== CONSTANTS.NAVI_MENU_ITEM_TOP.title) {
      useUiEventStore().uiEvent.searchBarText = ''
    }

    navigateTo(item.link)    
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
  <div id="navi-container">
    <v-tabs
      v-model="useUiEventStore().uiEvent.headerTabIndex"
      color="grey-darken-4"
      class="text-h5"
      centered
    >
      <template v-for="(item, i) in CONSTANTS.NAVI_LINK_ITEMS" :key="i"> 
        <v-tab
          :slider-color="item.color"
          :class="{ 'font-weight-bold': useUiEventStore().uiEvent.headerTabIndex === i , 'mr-2': true, 'text-body-1': true}"
          @click="onTabItemClick(item)"    
        ><v-icon :color="useUiEventStore().uiEvent.headerTabIndex === i ? item.color : 'transparent'" class="ml-4 mr-2">{{ item.icon }}</v-icon>
          <span class="pr-4 text-black">{{ item.title }}</span>
        </v-tab>
      </template>
    </v-tabs>
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

#navi-container {
  position: relative;
  top: 45px; 
  overflow-x: auto;
}

.header-navigation {
  height: 40px;
  overflow-x: auto;
	display: flex;
	flex-wrap: nowrap;
}

.header-navigation a {
	display: block;
  height: 30px;  
	color: inherit;  
	text-decoration: none;
	margin-left: 1.75rem;
	position: relative;
	font-weight: 500;  
  border: solid 0px #999999;
}

.header-navigation a:hover:after {
	transform: scalex(1);
}

.header-navigation a:after {
	transition: 0.25s ease;
	content: "";
	display: block;
	width: 100%;
	height: 2px;
	background-color: currentcolor;
	transform: scalex(0);
	position: absolute;
	bottom: -2px;
	left: 0;
}

.v-tab {
  width: 120px;
}

</style>
