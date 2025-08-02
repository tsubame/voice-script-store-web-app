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
})

// emits
const emits = defineEmits(['onLikeButtonClick'])

//======================================================
// vars
//======================================================

// お気に入り数
//const _favCount = ref(0)

//======================================================
// computed
//======================================================

// お気に入りされているかを返す
const isLiked = ref(false)

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
    isLiked.value = !isLiked.value
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
    <!-- 台本お気に入りボタン。お気に入り数込 
    <template v-if="useUserSettingStore().dbSavedUserSetting.showFavCountAndWatchCount">
      <v-btn variant="outlined" id="like-button-with-fav-count" :class="{
        'liked': true,
      }" @click="onLikeButtonClick" rounded>
          <v-icon>mdi-heart</v-icon>
        <span class="ml-1">{{ props.targetScript?.favCount }}</span>
      </v-btn>
    </template>
  -->
    
    <!-- 台本お気に入りボタン -->
    <v-btn flat id="like-button-with-no-fav-count" 
      @click="onLikeButtonClick"
      :class="{ 'liked': isLiked, 'unliked': !isLiked }" icon="mdi-heart"></v-btn>    
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
  //position: absolute;
  top: 12px;
  right: 2px;
  //width: 50px;
  height: 30px;
  font-size: 12px;
  //border-radius: 20px;
}

#like-button-with-no-fav-count {
  //position: absolute;
  top: 12px;
  right: 2px;
  width: 30px;
  height: 30px;
  font-size: 10px;
  //border-radius: 20px;
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

</style>
