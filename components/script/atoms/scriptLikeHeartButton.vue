<script lang="ts" setup>
//======================================================
//
// scriptLikeButton.vue 台本お気に入りボタン
//
//======================================================

import { computed, ref } from "vue";
import * as phpApiManager from '@/composables/util/phpApiManager';
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// props、emits
//======================================================


//======================================================
// vars
//======================================================

// お気に入りした際のツールチップ表示
const _showLikeButtonTooltip = ref(false)

//======================================================
// computed
//======================================================

// お気に入りされているかを返す
const isLiked = computed(() => {
  return useFavScriptsStore().isFavorited(useScriptStore().targetScript?.id!)
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(() => {
  try {
    //_favCount.value = _props.targetScript?.favCount!
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

    //　未ログインなら
    if (!useLoginUserStore().hasLogined()) { 
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }

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
      }, 1000)

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
        <v-icon>mdi-heart</v-icon>
      <span class="ml-1">{{ useScriptStore().targetScript?.favCount }}</span>
    </v-btn>
  </template>
  
  <!-- 台本お気に入りボタン -->
  <template v-else>
    <v-tooltip
      v-model="_showLikeButtonTooltip"     
      location="bottom" 
    >   
      <template v-slot:activator="{ props }">    
        <span class="ml-0">
          <v-btn flat id="like-button-with-no-fav-count"                     
            :class="{
            'liked': isLiked,
            'unliked': !isLiked
          }" @click="onLikeButtonClick" icon="mdi-heart"></v-btn>   
        </span>   
      </template>
      台本がお気に入りされました。
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
  font-size: 12px;
  //border-radius: 20px;
}

#like-button-with-no-fav-count {
  position: absolute;
  top: 12px;
  right: 2px;
  width: 30px;
  height: 30px;
  font-size: 10px;
  //border-radius: 20px;
}

#like-button-for-right-menu {
  margin-right: 8px;
  font-size: 10px;
  //border-radius: 20px;
  opacity: 0.8;
}

.unliked {
  color: #c2c2c2;
  border: solid 1px #d8d8d8;
  background-color: #f5f5f5;
}

.unliked-for-right-menu {
  color: #c2c2c2;
  border: solid 1px #d8d8d8;
  background-color: transparent;
}

.liked {
  background-color: #FFEBEE;
  color: rgb(255, 116, 139);
  border: solid 1px #ffb8b8;
  /** 影をつける */
  //text-shadow: 1px 1px 1px #ffb8b8;
}

.liked-for-right-menu {
  background-color: #FFEBEE;
  color: rgb(255, 116, 139);
  //border: solid 1px #ffb8b8;
  /** 影をつける */
  //text-shadow: 1px 1px 1px #ffb8b8;
}

</style>
