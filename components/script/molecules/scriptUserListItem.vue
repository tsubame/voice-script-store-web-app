<script lang='ts' setup>

//======================================================
//
// userEditFormDialog.vue 
// ユーザ登録用ダイアログ
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

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <v-card id="outer-container" class="my-4 mx-2 px-6 pt-1 pb-4"
    
    >
    <div :class="{ 'px-2': useDisplay().smAndUp.value }">
      <v-list-item class="my-0 px-0 pb-2">      
        <v-list-item-title class="text-body-1">
          {{ props.targetScript.title}} 
        </v-list-item-title>

        <v-list-item-subtitle class="mt-4 pl-0 text-body-2 text-grey-darken-5">
          {{ props.targetScript.minutes }}分　{{ props.targetScript.category }}　{{ props.targetScript.actorCount }}人
        </v-list-item-subtitle>     
      <div id="bottom-info-container" class="mt-4">
        <!-- お気に入り数、コメント数、閲覧数、日付 -->
        <template v-if="props.targetScript.userId == useLoginUserStore().user.id">
          <p v-if="useUserSettingStore().dbSavedUserSetting.showFavCountAndWatchCount"
            class="mt-4 mb-0 text-body-2 chips-container"  
            >
            
            <div class="icons-container text-center">

              <!-- コメント -->
              <template v-if=" props.targetScript.commentCount != 0">
                <v-chip class="text-caption mr-2" color="green-lighten-1" density="compact" >
                  <v-icon color="green-lighten-3" class="comment-icon text-caption mr-1">mdi-comment</v-icon>
                  {{ props.targetScript.commentCount }}
                </v-chip>
              </template>

              <template v-if="CONSTANTS.SHOW_SCRIPT_FAVORITE_COUNT">
                <v-chip class="text-caption mr-2" color="pink-lighten-3" density="compact" >
                  <v-icon color="pink-lighten-2" class="h-icon">mdi-cards-heart</v-icon>
                  {{ props.targetScript.favCount }}
                </v-chip>
              </template>

              <v-chip class="text-caption" color="blue" density="compact" >
                {{ props.targetScript.watchCount }} views
              </v-chip>
            </div>
          </p>      
        </template>

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
      </div>     
        
        <div class="thum-image-container flat px-0 py-0">       
          <v-img :src="props.targetScript.getBgIllustImageUrlWithAppBaseUrl()" height="100"></v-img>
        </div>
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

#outer-container {
  border: solid 1px #cacaca;

  // 影をつける
  box-shadow: 0 2px 1px 0 rgba(0, 0, 0, 0.1);
}

.v-list-item-title {
  padding-right: 100px;  
  font-size: 100%;
  font-weight: bold;
  white-space: normal; /
  word-break: break-word;   
}

.v-list-item-subtitle {
  font-size: 0.8rem;
}

.category-chip {
  position: absolute;
  top: 50px;
  right: 10px;
}

.fav-icon {
  position: absolute;
  top: 14px;
  right: 0px;
  font-size: 16px;
}

.comment-icon {
  top: 1px;
}

#bottom-info-container {
  width: 100%;
  height: 30px;
  right: 100px;
  border: solid 0px #999999;
}

.actor-count-conrainter {
  position: absolute;
  bottom: 4px;
  right: 0px;
  max-width: 100px;
  text-align: right;
  border: solid 0px #999999;
  opacity: 0.8;
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

.thum-image-container {
  position: absolute;
  top: 16px;
  right: 0px;
  width: 80px;
  height: 50px;
  border-radius: 4px;  
  border: solid 0px #dcdcdc;
}

.v-img {
  width: 100%;
  border: solid 0px #999999;
  border-radius: 6px;
  opacity: 0.8;
}
</style>