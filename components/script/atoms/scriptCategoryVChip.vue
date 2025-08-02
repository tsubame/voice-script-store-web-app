<script lang='ts' setup>

//======================================================
//
// scriptCategoryVChip.vue
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import * as CONSTANTS from '@/composables/etc/constants'
import { useLoginUserStore } from '@/store/loginUserStore'
import { useAccessTokenStore } from '@/store/accessTokenStore'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as loginManager from '@/composables/util/loginManager'
import User from '@/composables/type/user'
import Script from '@/composables/type/script'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetScript: Script
}>()

// emit
const emits = defineEmits()


//======================================================
// vars
//======================================================  

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <div id="container">
    <template v-if="useDisplay().smAndUp.value">
      <v-chip 
        id="not-mobile-chip"
        :color="props.targetScript.getCategoryTagColor()">{{ props.targetScript.category }}</v-chip>
    </template>
    <template v-else>
      <v-chip 
        id="mobile-chip"
        density="comfortable" 
        :color="props.targetScript.getCategoryTagColor()">{{ props.targetScript.category }}</v-chip>

    </template>
  </div>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang='scss' scoped>

#container {
  position: absolute;  
  display: block;
  min-width: 60px;
  padding: 2px 8px; 
  top: 16px; 
  right: -10px;    
  text-align: center; 
  border-radius: 10px;
}

#mobile-chip {
  font-size: 12px !important;
}

.mobile {
  font-size: 10% !important;
}

</style>