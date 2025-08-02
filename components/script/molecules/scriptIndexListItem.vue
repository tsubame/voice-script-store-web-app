<script lang='ts' setup>

//======================================================
//
// scriptIndexListItem.vue
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
  <v-card id="card-container" class="my-4 mx-1 px-4 pt-1 pb-0">
    <div :class="{ 'px-4': useDisplay().smAndUp.value }">
      <v-list-item class="my-0 px-0 pb-2">      
        <v-list-item-title
          :class="{
            'not-mobile-title': useDisplay().smAndUp.value,              
          }"
          >
          {{ props.targetScript.title}} 

        </v-list-item-title>

        <p class="mt-3 pl-0 text-grey-darken-2 text-body-2">
          {{ props.targetScript.minutes }}分　{{  props.targetScript.authorName }}
        </p>     

        <div id="bottom-info-container" class="mt-1 mb-4">        

          <!-- タグ -->
          <div id="tags-container" class="pt-1">        
            <!-- R18 -->
            <template v-if="props.targetScript!.isR18Script()">           
              <v-chip class="mr-2" density="comfortable" size="small" :color="CONSTANTS.TAG_COLOR_R18" label>R18</v-chip>                      
            </template>          
            <!-- タグ -->          
            <template v-if="CONSTANTS.SHOW_TAGS_IN_INDEX_FOR_MOBILE && useDisplay().smAndDown.value || CONSTANTS.SHOW_TAGS_IN_INDEX_AT_PC && useDisplay().smAndUp.value">
              <template v-for="(tag, i) in props.targetScript.getTagTxts()" :key="i">
                <v-chip class="mr-2 text-caption opacity-70" color="blue" density="compact" label>{{ tag }}</v-chip>
              </template>
            </template>
          </div>          
          
          <!-- お気に入り -->  
          <script-list-item-fav-icon :targetScript="props.targetScript" />

          <!-- 日付 -->
          <div id="date-container" 
            :class="{
              'text-grey-darken-2': true,
              'text-caption': useDisplay().smAndDown.value,
              'text-body-2': useDisplay().smAndUp.value,                
            }">
            {{ props.targetScript.getPostedAtTxtForScriptDetail() }}
          </div>

          <!-- 人数 -->
          <div class="actor-count-container">
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
        </div>     
        
        <template v-if="CONSTANTS.SHOW_LIST_ITEM_BG_IMAGE_IN_INDEX">
          <div class="thum-image-container flat px-0 py-0">       
            <v-img :src="props.targetScript.getBgIllustImageUrlWithAppBaseUrl()" ></v-img>
          </div>
        </template>
        <template v-else>
          <template v-if="CONSTANTS.USE_V_CHIP_FOR_CATEGORY"> 
            <script-category-v-chip :targetScript="props.targetScript" />    
          </template>  
          <template v-else>
            <script-category-chip :targetScript="props.targetScript" />                
          </template>
        </template>
      
      </v-list-item>       
    </div>    
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

#card-container {
  border: solid 1px #b0b0b0;
  box-shadow: 0px 2px 4px 0 rgba(69, 54, 3, 0.1);    
}

.v-list-item-title {
  padding-right: 100px;  
  font-size: 100%;
  font-weight: bold;
  white-space: normal; // 文字列を折り返し可能にする
  word-break: break-word;   
}

.not-mobile-title {
  font-size: 110% !important;
}


.v-list-item-subtitle {
  font-size: 0.8rem;
}

.category-chip {
  position: absolute;
  top: 50px;
  right: 10px;
}

#bottom-info-container {
  width: 100%;
  height: 30px;
  right: 100px;
  border: solid 0px #999999;
}

#author-container {
  padding-top: 8px;
  padding-left: 500px;
}

.actor-count-container {
  position: absolute;
  bottom: 20px;
  right: 0px;
  max-width: 100px;
  text-align: right;
  border: solid 0px #999999;
  opacity: 0.8;
}

#date-container {
  position: absolute;
  bottom: 24px;
  right: 100px;
  border: solid 0px #999999;
}

#pc-fav-container {
  position: absolute;
  padding-bottom: 2px;
  bottom: 24px;
  right: 200px;
  border: solid 0px #999999;
}

#mobile-fav-container {
  position: absolute;
  padding-bottom: 0px;
  bottom: 22px;
  right: 180px;
  border: solid 0px #999999;
}


.list-avatar {
  width: 20px;
  height: 30px;
  margin: 0 -5px;
  border: solid 0px #666666;
}

.icons-container {
  position: absolute;
  bottom: 6px;
  right: 100px;
  font-size: 110%;
  border: solid 0px #999999;
}

.h-icon {
  margin-right: 4px;
  margin-top: 4px;
  font-size: 90%;
}

#tags-container {
  margin-right: 200px;
  border: solid 0px #999999;
}

.thum-image-container {
  position: absolute;
  top: 16px;
  right: 0px;
  width: 70px;
  height: 50px;
  border-radius: 4px;  
  border: solid 0px #dcdcdc;
}

.v-img {
  width: 100%;
  border-radius: 2px;
  opacity: 0.8;

  // 影をつける
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}



</style>