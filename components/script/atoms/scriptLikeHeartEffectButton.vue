<script lang="ts" setup>
//======================================================
//
// scriptLikeHeartEffectButton.vue 台本お気に入りボタン
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

// お気に入りアニメ画像を非表示にするか
const _isLikeAnimationButtonHidden = ref(true)

// お気に入りツールチップを表示するか
const _showLikeButtonTooltip = ref(false)

// ボタンが押されたタイムスタンプ
const _clickedTimestamps = ref<any[]>([])

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

    // アニメーション
    if (!isLiked.value) {
      _isLikeAnimationButtonHidden.value = false
      // 1秒後に非表示に
      setTimeout(() => {
        _isLikeAnimationButtonHidden.value = true
      }, 2000)
    }

    // ボタン連打チェック
    if (checkButtonManyClicked()) {
      alert(CONSTANTS.ERROR_MSG_FAVORITE_BUTTON_MANY_CLICK)

      return
    }    

    if (isLiked.value) {
      useFavScriptsStore().removeFavScript(useScriptStore().targetScript?.id!)

      // 台本をお気に入りから外す
      phpApiManager.usePostDeleteScriptFavorite(useScriptStore().targetScript?.id!, useLoginUserStore().user, useAccessTokenStore().accessToken)
      // 台本のお気に入り数をマイナス
      useScriptStore().targetScript!.favCount--      
    } else {

      // ツールチップを表示
      //_showLikeButtonTooltip.value = true
      useUiEventStore().uiEvent.isBottomNotificationShowing = true
      useUiEventStore().uiEvent.bottomNotificationMessage = "⭐ 台本がお気に入りされました。"

      // 1秒後に非表示
      setTimeout(() => {
        _showLikeButtonTooltip.value = false
        useUiEventStore().uiEvent.isBottomNotificationShowing = false
      }, 1500)

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

/**
 * ボタン連打チェック
 * 
 * @returns {boolean} ボタンが連打されたか
 */
const checkButtonManyClicked = (): boolean => {
  try {
    const now = Date.now();
    _clickedTimestamps.value.push(now);

    // 過去10秒間のタイムスタンプをフィルタリング
    _clickedTimestamps.value = _clickedTimestamps.value.filter(timestamp => now - timestamp <= 10000);

    if (CONSTANTS.FAVORITE_BUTTON_CLICK_LIMIT < _clickedTimestamps.value.length) {
      return true
    }
  } catch (error) {
    console.error(error)
  }

  return false
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
    <template v-if="isLiked">

    </template>
      <span class="ml-0">
        <v-btn flat id="like-button-with-no-fav-count"                     
          :class="{
            'liked': isLiked,
            'unliked': !isLiked            
          }" 
          @click="onLikeButtonClick"
          icon="mdi-heart"
          ><v-icon class="text-h6">mdi-heart</v-icon>
          <v-fade-transition>            
            <div :class="{
              'heart': true,
              'is-active': isLiked,
              'is-hidden': _isLikeAnimationButtonHidden,
            }"></div>
          </v-fade-transition>  
      </v-btn>   
    </span>   
  </template>

  <v-fade-transition>
    <div id="tooltip" class="text-body-2" v-if="_showLikeButtonTooltip">
      ⭐ 台本がお気に入りされました。
    </div>
  </v-fade-transition>  
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
  top: 4px;
  right: 2px;
  width: 40px;
  height: 40px;
  font-size: 16px;
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
  opacity: 0.8;
  /** 影をつける */
  //text-shadow: 1px 1px 1px #ffb8b8;
}


.heart {
  position: absolute;
  width: 100px;
  height: 100px;
  //background: url("/web-app/img/icon/heart-animation.png") no-repeat;
  background: url("/web-app/img/icon/heart-animation-with-no-heart.png") no-repeat;  
  background-position: 0 0;
  scale: 1;
  cursor: pointer;
  transition: background-position 1s steps(28);
  transition-duration: 0s;
  
  &.is-active {
    transition-duration: 1s;
    background-position: -2800px 0;
  }

  &.is-liked {
    background-position: -2800px 0;
  }  

  &.is-not-liked {
    opacity: 0;
  }    
}

#tooltip {
  position: absolute;
  right: 0px;
  top: 100px;
  width: fit-content;
  min-width: 250px;
  padding: 10px 10px;

  border-radius: 4px;
  color: white;
  background-color: rgb(0, 0, 0, 0.4);
  z-index: 10;
}

</style>
