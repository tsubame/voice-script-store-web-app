<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerDescription.vue 
// 台本説明
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUserSettingStore } from '@/store/userSettingStore'
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

//======================================================
// vars
//======================================================

// 説明文を全文表示するか
const showAllDescription = ref(false)

//======================================================
// methods
//======================================================

/**
 * イベント 詳細表示閉じる、開くボタンクリック
 */
const onClickDescriptionOpenCloseButton = () => {
  try {
    showAllDescription.value = !showAllDescription.value
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
  <div id="description" class="mt-0 mb-0 px-2 pt-4 pb-2">
    <h3 class="green text-body-1 font-weight-bold">
      台本説明
    </h3>
    <div  
      :class="{
        'text-body-1': true
        }">
      <div 
        :class="{
          'mt-6': true,
          'px-3': useDisplay().smAndDown.value,
          'px-5': !useDisplay().smAndDown.value,        
        }"
        :style="{
          'font-size': useUserSettingStore().cookieSavedScriptTextFontSizeRate + '%'
        }"      
        > 
        <!--　全文 -->
        <template v-if="showAllDescription">    
          <p v-if="showAllDescription"
          >
            {{ props.targetScript?.description }}
          </p>
        </template>  

        <!-- 短縮形 -->
        <template v-if="!showAllDescription">
          <p        
          >
            {{ props.targetScript?.getShortDescription() }}
          </p>
        </template>

        <p 
          class="text-right mt-4"       
          >
          &nbsp;

          <v-btn v-if="props.targetScript!.checkHasToShowDescriptionOpenCloseButton()" 
            id="description-close-open-button"
            @click="onClickDescriptionOpenCloseButton" 
            color="grey"
            variant="text"
            density="comfortable"
            rounded>
            <template v-if="showAllDescription">
              <v-icon class="text-h5" color="">mdi-menu-up</v-icon><span class="text-grey-darken-4 text-body-2 mr-2">閉じる</span>
            </template>
            <template v-else>
              <v-icon class="text-h5">mdi-menu-down</v-icon><span class="text-grey-darken-4 text-body-2 mr-2">全て表示</span>
            </template>
          </v-btn>
        </p>
      </div>
    </div>   
  </div>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>
/** 台本詳細説明文 */
#description p {
  //font-size: small;
  white-space: pre-line;
  line-height: 180%;
}

/** 詳細 閉じる、開くボタン */
#description-close-open-button {
  width: 90px;
  //border: solid 1px #b6b6b6;
}

.title-icon {
  top: -2px;
}
</style>
