<script lang="ts" setup>
//======================================================
//
// commonHeaderLogoCongainer.vue ヘッダロゴ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import Script from '@/composables/type/script'

//======================================================
// methods
//======================================================

/**
 * イベント ロゴクリック
 * ・トップページに遷移
 * ・scriptStore、uiEventStoreの台本クリア
 * ・選択タブを0に
 */
const onHeaderLogoClick = () => {
  try {
    console.log('onLogoClick') 
    navigateTo('/')         
    useUiEventStore().uiEvent.headerTabIndex = 0
    useScriptStore().watchingScriptId = 0
    useScriptStore().targetScript = new Script()
    useScriptStore().isScriptPostingOrEditting = false
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
  <div id="header-logo-container"
    :class="{ 'is-mobile': useDisplay().mobile.value }"
    @click="onHeaderLogoClick"
    >    

    <div 
      id="header-logo-container-img-container"
      >
      <v-img src="/img/logo/fox.png" width="30" />
    </div>
    <h1 class="text-black"
    >声劇台本置き場 
      <template v-if="!useDisplay().mobile.value">
      <span 
        class="explain ml-1">- 誰でも投稿できる台本サイト</span>
      </template>
    </h1>
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

#header-logo-container {
  display: flex;
	position: absolute;
  cursor: pointer;  
  top: 10px;
  left: 16px;
  font-size: 90%;
  border: solid 0px #999999;
}

.is-mobile {
  margin-top: 4px !important;
  margin-left: 4px !important;
}

#header-logo-container-img-container {
  margin: auto;
}

#header-logo-container h1 {
  padding-top: 6px;
  padding-left: 8px;  
  font-weight: normal;
  font-size: 100%;
}

.explain {
  font-size: 60%;
  color: rgb(89, 89, 89);
}

</style>
