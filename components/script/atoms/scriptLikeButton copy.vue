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

// props
const props = defineProps({
  targetScript: Script,
})

// emits
const emits = defineEmits(['onLikeButtonClick'])

//======================================================
// reactive vars
//======================================================

// お気に入りされているか
const isLiked = computed(() => {
  return useFavScriptsStore().isFavorited(props.targetScript?.id!)
})

//======================================================
// methods
//======================================================

/**
 * イベント お気に入りボタンクリック
 */
const onLikeButtonClick = () => {
  try {
    console.log("[対象台本ID]" + props.targetScript?.id)
    console.log("[お気に入り状態]" + isLiked.value)

    emits("onLikeButtonClick")
    if (isLiked.value) {
      useFavScriptsStore().removeFavScript(props.targetScript?.id!)

      // 台本をお気に入りから外す
      phpApiManager.usePostDeleteScriptFavorite(props.targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)
    } else {
      useFavScriptsStore().addFavScript(props.targetScript?.id!)

      // 台本をお気に入り
      phpApiManager.usePostCreateScriptFavorite(props.targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)
  
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
    <v-btn flat id="like-button" :class="{
      'liked': isLiked,
      'unliked': !isLiked
    }" @click="onLikeButtonClick" icon="mdi-heart"></v-btn>
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
  position: absolute;
  top: 0px;
  right: 40px;
  width: 30px;
  height: 30px;
  font-size: 12px;
}

.unliked {
  color: #c2c2c2;
  border: solid 1px #d8d8d8;
  background-color: #f5f5f5;
}

.liked {
  background-color: #FFEBEE;
  color: rgb(255, 116, 139);
  border: solid 1px #ffb8b8;
  /** 影をつける */
  text-shadow: 1px 1px 1px #ffb8b8;
}

span {
  position: absolute;
  top: 6px;
  right: 46px;
  font-size: 12px;
  color: #c2c2c2;
}

#share-button {
  position: absolute;
  top: 0px;
  right: 40px;
  width: 30px;
  height: 30px;
  font-size: 12px;
}

#menu-button {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
  font-size: 11px;
}
</style>
