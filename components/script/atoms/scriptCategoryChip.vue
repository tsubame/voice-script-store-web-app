<script lang='ts' setup>

//======================================================
//
// scriptCategoryChip.vue.
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
  <span
    class="mr-2 category-chip-right" 
    :style="{
      'border': 'solid 1px ' + props.targetScript.getCategoryItem().colorCodeItem?.borderColor,
      'color': props.targetScript.getCategoryItem().colorCodeItem?.fontColor,
      'background-color': props.targetScript.getCategoryItem().colorCodeItem?.bgColor
    }"

    density="comfortable" size="small"
    label
    >
    {{ props.targetScript.category }}
  </span>
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
  font-size: 70%;
  border-radius: 10px;
}

.category-chip-right {
  position: absolute;  
  display: block;
  min-width: 60px;
  padding: 2px 8px; 
  top: 16px; 
  right: -10px;    
  text-align: center; 
  font-size: 70%;
  border-radius: 10px;
}

</style>