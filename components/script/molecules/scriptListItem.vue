<script lang='ts' setup>

//======================================================
//
// scriptListItem.vue 
// 台本アイテム
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
  <v-card :class="{
    'mobile-card': useDisplay().smAndDown.value,
    'not-mobile-card': useDisplay().smAndUp.value,    
  }"
    >
    <v-list-item class="my-0 px-0">      
      <v-list-item-title id="title">
        {{ props.targetScript.title}} 
        <template v-if="useFavScriptsStore().isFavorited(props.targetScript.id!)">          
        <span class="ml-1">⭐</span>
        </template>
        <!-- R18なら -->
        <template v-if="props.targetScript.isR18Script()">
          <v-chip 
            class="ml-2 mb-1" 
            :color="CONSTANTS.TAG_COLOR_R18"
            density="compact" size="small"  
            label     
            >     
            {{ CONSTANTS.TAG_VAL_R18 }}
          </v-chip>
        </template>        
      </v-list-item-title>
      <p class="mt-2 pl-0 text-grey-darken-4 text-caption">
        {{ props.targetScript.minutes }}分　{{ props.targetScript.authorName }}
      </p>       
      <p class="mt-4 mb-0">
        <!-- カテゴリチップ -->
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
      </p>      
      <!-- 日付 -->
      <div id="date-conrainter">
        {{ props.targetScript.getPostedAtTxtForScriptDetail() }}
      </div>

      <!-- 人数 -->
      <div class="actor-count-conrainter">
        <template v-for="i in props.targetScript.actorManCount" :key="i">
          <span class="list-avatar"><script-icon-man /></span>
        </template>
        <template v-for="i in props.targetScript.actorWomanCount" :key="i">
          <span class="list-avatar woman">
            <script-icon-woman />
          </span>
        </template>
        <template v-for="i in props.targetScript.actorEtcCount" :key="i">
          <span class="list-avatar">
            <script-icon-etc />
          </span>
        </template>
      </div>                  
    </v-list-item>           
  </v-card>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang='scss' scoped>

.v-card {
  margin: 16px 4px auto;
  background-color: $script-item-bg-color;
  border-radius: 4px;
}
.mobile-card {
  padding: 2px 20px 4px;
}
.not-mobile-card {
  padding: 4px 32px;
}

.v-list-item-title {
  max-height: 50px;
  min-height: 26px;
  padding-right: 110px;  
  font-size: 95%; //90%;
  font-weight: bold;
  white-space: normal; // 文字列を折り返し可能にする
  word-break: break-word;   
}

.v-list-item-subtitle {
  font-size: 90%;
}

.category-chip-right {
  position: absolute;  
  display: inline-block;
  min-width: 85px;
  padding: 2px 4px; 
  top: 16px; 
  right: -10px;    
  margin-left: 240px;
  text-align: center; 
  font-size: 70%;
  border-radius: 12px;
}

.category-chip-bottom {
  position: absolute;  
  display: inline-block;
  min-width: 80px;
  padding: 4px 12px; 
  bottom: 12px; 
  right: 70px;    
  text-align: center; 
  font-size: 70%;
  border-radius: 12px;
}


.fav-icon {
  position: absolute;
  top: 14px;
  right: 0px;
  font-size: 16px;
}


#thum-image-container {
  position: absolute;
  top: 16px;
  right: 0px;
  padding: 4px;
  border-radius: 4px;  
  opacity: 0.8;
  border: solid 0px #999999;
}

#thum-image{
  border-radius: 4px;  
}

.actor-count-conrainter {
  position: absolute;
  bottom: 8px;
  right: 0px;
  max-width: 70px;
  text-align: right;
  border: solid 0px #999999;
  opacity: 0.9;
}

.list-avatar {
  width: 20px;
  height: 30px;
  margin: 0 -4px;
  border: solid 0px #666666;
}

#date-conrainter {
  position: absolute;
  bottom: 12px;
  right: 80px;
  font-size: 80%;
  opacity: 0.4;// 0.4;
  border: solid 0px #999999;
}

</style>