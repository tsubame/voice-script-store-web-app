<script lang="ts" setup>
//======================================================
//
// scriptLikeButton.vue 台本お気に入りボタン
//
//======================================================

import { computed, ref } from "vue";
import * as favScriptsStore from '@/store/favScriptsStore'
import * as loginUserStore from '@/store/loginUserStore'
import * as CONSTANTS from '@/composables/etc/constants'
import Script from "@/composables/type/script"
import * as phpApiManager from '@/composables/util/phpApiManager';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
}>()

//======================================================
// computed
//======================================================

// お気に入りされているかを返す
const isLiked = computed(() => {
  return useFavScriptsStore().isFavorited(useScriptStore().targetScript?.id!)
})

//======================================================
// vars
//======================================================

// お気に入りした際のツールチップ表示
const _showLikeButtonTooltip = ref(false)

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(() => {
  try {
    //_favCount.value = props.targetScript?.favCount!
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント お気に入りボタンクリック
 */
const onLikeButtonClick = () => {
  try {
    console.log("[対象台本ID]" + useScriptStore().targetScript?.id)
    console.log("[お気に入り状態]" + isLiked.value)

    if (isLiked.value) {
      useFavScriptsStore().removeFavScript(useScriptStore().targetScript?.id!)

      // 台本をお気に入りから外す
      phpApiManager.usePostDeleteScriptFavorite(useScriptStore().targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)
      // 台本のお気に入り数をマイナス
      useScriptStore().targetScript!.favCount--      
    } else {
      _showLikeButtonTooltip.value = true    

      // 1秒後に非表示
      setTimeout(() => {
        _showLikeButtonTooltip.value = false
      }, 800)

      useFavScriptsStore().addFavScript(useScriptStore().targetScript?.id!)
      // 台本をお気に入り
      phpApiManager.usePostCreateScriptFavorite(useScriptStore().targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)
        // 台本のお気に入り数をプラス
      useScriptStore().targetScript!.favCount++
    }
    console.log("[like button clicked] " + isLiked.value)
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
  <!-- 台本お気に入りボタン。お気に入り数込 -->
  <template v-if="CONSTANTS.SHOW_SCRIPT_FAVORITE_COUNT">
    <v-btn variant="outlined" id="like-button-with-fav-count" :class="{
      'liked': isLiked,
      'unliked': !isLiked
    }" @click="onLikeButtonClick" rounded>
        <v-icon class="text-h6">mdi-star</v-icon>
      <span :class="{'liked-with-fav-count': isLiked, 'ml-1': true}">{{ useScriptStore().targetScript?.favCount }}</span>
    </v-btn>
  </template>
  
  <!-- 台本お気に入りボタン -->
  <template v-else>
    <v-tooltip
      v-model="_showLikeButtonTooltip"     
      location="top" 
    >   
      <template v-slot:activator="{ props }">          
        <v-btn flat id="like-button-with-no-fav-count" 
          :class="{
            'liked': isLiked,
            'unliked': !isLiked
          }" @click="onLikeButtonClick" icon="mdi-star">
          <v-icon class="text-h6">mdi-star</v-icon>  
        </v-btn>    
      </template>
      ⭐ 台本がお気に入りされました。        
    </v-tooltip>
  </template>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>
#like-button-with-fav-count {
  position: absolute;
  top: 12px;
  right: 2px;
  //width: 50px;
  height: 30px;
  font-size: 80%;
  //border-radius: 20px;
}

#like-button-with-no-fav-count {
  position: absolute;
  top: 10px;
  right: 0px;
  width: 50px;
  height: 30px;
  font-size: 10px;
  border-radius: 15px;
}

#like-button-for-right-menu {
  margin-right: 8px;
  font-size: 10px;
  //border-radius: 20px;
  opacity: 0.8;
}

.unliked {
  color: #c2c2c2;
  border: solid 1px #c2c2c2;
  background-color: #f5f5f5;
}

.unliked-for-right-menu {
  color: #c2c2c2;
  border: solid 1px #d8d8d8;
  background-color: transparent;
}

.liked {
  background-color: #fffdf0;
  color: #FFC107;
  border: solid 1px #ffbf00;
  /** 影をつける */
  text-shadow: 1px 1px 1px #f5cc1a;
}

.liked-with-fav-count {
  color: #FFA000;
}

.liked-for-right-menu {
  background-color: #FFEBEE;
  color: rgb(255, 116, 139);
  //border: solid 1px #ffb8b8;
  /** 影をつける */
  //text-shadow: 1px 1px 1px #ffb8b8;
}

</style>
