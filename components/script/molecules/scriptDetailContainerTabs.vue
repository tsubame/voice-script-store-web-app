<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerTabs.vue 
// 台本詳細のタブ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import InfiniteLoading from "v3-infinite-loading";
import * as CONSTANTS from '@/composables/etc/constants'
import Script from "@/composables/type/script"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetScript: Script,
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
  <v-tabs class="mb-0 mt-0" v-model="useUiEventStore().uiEvent.scriptDetailTabIndex" bg-color="" color="" align-tabs="center">
    <!-- 本文 -->
    <v-tab  
      :class="{
        'equal-width-tab': useDisplay().smAndDown.value,
        'not-equal-width-tab': !useDisplay().smAndDown.value,
      }" 
      color="grey-darken-4"
      slider-color="grey-darken-2"
      :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY">本文</v-tab>

    <!-- 編集中でなければ表示 -->
    <template v-if="!useScriptStore().isScriptPostingOrEditting">              
      <!-- コメント -->
      <v-tab 
        :class="{
          'equal-width-tab': useDisplay().smAndDown.value,
          'not-equal-width-tab': !useDisplay().smAndDown.value
        }" 
        color="grey-darken-4"
        slider-color="grey-darken-2"                  
        :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_COMMENT">コメント
        <template v-if="props.targetScript!.commentCount != 0">
          <v-chip class="text-caption ml-2 comment-chip" color="green" density="compact" size="small" label>
            {{ props.targetScript!.commentCount }}
          </v-chip>
        </template>
      </v-tab>
      <!-- 作者の他作品 -->
      <v-tab  
        :class="{
          'equal-width-tab': useDisplay().smAndDown.value,
          'not-equal-width-tab': !useDisplay().smAndDown.value
        }"  
        color="grey-darken-4"
        slider-color="grey-darken-2"                  
        :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT">作者の他作品</v-tab>

    </template> 
  </v-tabs>  
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

.not-equal-width-tab  {
  width: 140px;
}

.equal-width-tab {
  flex: 1 1 0; 
  text-align: center; 
}

</style>
