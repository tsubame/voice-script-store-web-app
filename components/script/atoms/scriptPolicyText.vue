<script lang="ts" setup>
//======================================================
//
// scriptPolicyText.vue 台本詳細ページの利用規定
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import Word from "@/composables/type/word"
import * as scriptTextManager from '@/composables/util/scriptTextManager';
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
// methods
//======================================================

/**
 * イベント 利用規定クリック
 */
const onPolicyChipClick = () => {
  try {    
    useUiEventStore().uiEvent.isScriptPolicyDialogShowing = true
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
  <template v-if="props.targetScript!.getReusableColor() === CONSTANTS.SCRIPT_POLICY_WARNING_COLOR">
    <span 
      @click="onPolicyChipClick"
      class="polycy-chip-container">
      <!--<v-chip id="polycy-chip" color="red" class="mr-2 py-3" variant="outlined" density="compact" size="small">利用規定</v-chip>-->               
      <v-chip color="orange-darken-3" class="mr-2 py-3" variant="tonal" density="compact" size="small">利用規定</v-chip>              
        {{ props.targetScript!.reusable }}
    </span>
  </template>
  <template v-else>
    <span
      @click="onPolicyChipClick"
      class="polycy-chip-container"              
    >
      <v-chip 
      color="teal" class="mr-2 py-3" density="compact" size="small">利用規定</v-chip> 
      <!--<v-chip color="info" class="mr-2 py-3" variant="outlined" density="compact" size="small">利用規定</v-chip>  --> 
      {{ props.targetScript!.reusable }}
    </span>
  </template>
</template>
<!--
//======================================================
//
//  CSS
//
//======================================================
-->
<style lang="scss" scoped>
.polycy-chip-container {
  cursor: pointer;
}

#polycy-chip {
  border: solid 1px #b8b8b8 !important;
  //background-color: rgb(255, 252, 245);
  color: rgb(76, 76, 76) !important;
}

</style>