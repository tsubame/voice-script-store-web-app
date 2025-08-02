<script lang="ts" setup>
//======================================================
//
// scriptLikeButton.vue 台本お気に入りボタン
//
//======================================================

import { computed, ref } from "vue";
import * as favScriptsStore from '@/store/favScriptsStore'
import * as loginUserStore from '@/store/loginUserStore'
import Script from "@/composables/type/script"
import * as phpApiManager from '@/composables/util/phpApiManager';

//======================================================
// props、emits
//======================================================

// emits
const emits = defineEmits(['onLikeButtonClick'])

//======================================================
// reactive vars
//======================================================

// お気に入りされているか
const isLiked = computed(() => {
  return useFavScriptsStore().isFavorited(useScriptStore().targetScript?.id!)
})

//======================================================
// methods
//======================================================

/**
 * イベント お気に入りボタンクリック
 */
const onLikeButtonClick = async() => {
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
      await phpApiManager.usePostDeleteScriptFavorite(useScriptStore().targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)

      // 台本のお気に入り数をマイナス
      useScriptStore().targetScript!.favCount--      
    } else {
      useFavScriptsStore().addFavScript(useScriptStore().targetScript?.id!)

      // 台本をお気に入り
      await phpApiManager.usePostCreateScriptFavorite(useScriptStore().targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)  

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
  <!-- 台本お気に入りボタン -->
  <v-btn id="like-button" :class="{
    'liked': isLiked,
    'unliked': !isLiked
  }" @click="onLikeButtonClick" icon="mdi-heart"
  density="comfortable"
  ></v-btn>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>
#like-button {
  top: 0px;
  font-size: 12px;
}

.unliked {
  color: #c2c2c2;
  opacity: 0.7;  
  //border: solid 1px #d8d8d8;
  //background-color: #f5f5f5;
}

.liked {
  background-color: #FFEBEE;
  color: rgb(255, 116, 139);
  opacity: 0.8;
  //border: solid 1px #ffb8b8;
  /** 影をつける */
  //text-shadow: 1px 1px 1px #ffb8b8;
}
</style>
