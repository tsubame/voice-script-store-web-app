<script lang='ts' setup>

//======================================================
//
// scriptListItemFavIcon.vue
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import * as CONSTANTS from '@/composables/etc/constants'
import { useLoginUserStore } from '@/store/loginUserStore'
import { useAccessTokenStore } from '@/store/accessTokenStore'
import { useUserSettingStore } from '@/store/userSettingStore'
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
// computed
//======================================================

// お気に入りされているか
const isLiked = computed(() => {
  return useFavScriptsStore().isFavorited(props.targetScript?.id!)
})

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
  <div 
    id="container" 
    >
    <div id="inner-container"
      >
      <div 
        :class="{ 'is-mobile': useDisplay().smAndDown.value }"> 
        <!-- お気に入り済 -->
        <template v-if="isLiked">            
          <!-- 星 -->
          <template v-if="CONSTANTS.USE_STAR_FOR_FAVORITE_ICON">
            <v-icon class="h-icon text-h6" color="amber-lighten-2">mdi-star</v-icon> 
          </template>
          <template v-else>
            <v-icon class="h-icon text-body-1" color="pink-lighten-4">mdi-heart</v-icon> 
          </template>     
          
          <!-- カウント -->
          <template v-if="CONSTANTS.SHOW_SCRIPT_FAVORITE_COUNT">
            <span class="text-caption text-amber-darken-1">{{ props.targetScript.favCount }}</span>
          </template>
        </template>

        <!-- 未お気に入り -->
        <template v-else>
        </template>  
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
<style lang='scss' scoped>

#container {
  position: absolute;
  bottom: 24px;
  right: 180px;
  min-width: 24px;
  height: 24px;
  border: solid 0px #999999;
}

#inner-container {
  position: relative;
}

.is-mobile {
  position: absolute;
  top: 5px;
}
</style>