<script lang="ts" setup>
//======================================================
//
// commonBackButton.vue 左上の戻るボタン
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'

//======================================================
// methods
//======================================================

/**
 * イベント 検索ボックスクリック
 */
const onSearchTextBoxClick = () => {
  console.log('onSearchTextBoxClick')
  useUiEventStore().uiEvent.isSearchDialogShowing = true
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
    <div id="search-button-container">
      <v-btn 
      id="search-btn"
      class="mr-0 text-h6" 
      icon="mdi-magnify"  
      color="grey" 
      variant="text" 
      rounded
      @click="onSearchTextBoxClick"
      ></v-btn>
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

// 検索ボックス
#search-text-box-container {
  position: relative;
  z-index: 10;  
}

#search-text-box-icon {
  position: absolute;
  top: 5px;
  left: 8px;
}

#search-text-box {
  border: solid 1px #999999;
  border-radius: 6px;
  height: 34px;
  padding-left: 36px;
}

#search-button-container {
  top: -8px;
  margin-top: -4px;  
  right: 50px;
}

#search-btn {
  width: 60px;
  border: solid 0px #999999;
}

</style>
