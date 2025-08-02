<script lang="ts" setup>
//======================================================
//
// userFollowButton.vue フォローボタン
//
//======================================================

import * as phpApiManager from '@/composables/util/phpApiManager'
import User from "@/composables/type/user"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetUser: User
  isSmallSize: boolean
}>()

//======================================================
// methods
//======================================================

/**
 * フォローボタンクリック
 * 
 * @param event
 */
const onFollowButtonClick = async (event: any) => {
  try {
    // クリックイベントを親要素に伝播させない    
    event.stopPropagation();

    // ログインしていない場合、ログインダイアログ表示
    if (!useLoginUserStore().hasLogined()) { 
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }

    let res = await phpApiManager.usePostCreateFollow(props.targetUser!.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res === false) {
      console.error("フォローに失敗しました")

      return
    }

    useFollowUsersStore().addFollow(props.targetUser!.id)

    // ツールチップを表示
    useUiEventStore().uiEvent.isBottomNotificationShowing = true
    useUiEventStore().uiEvent.bottomNotificationMessage = "⭐ " + props.targetUser!.name + "さんをフォローしました。"

    // 1秒後に非表示
    setTimeout(() => {
      useUiEventStore().uiEvent.isBottomNotificationShowing = false
    }, 1500)    
  } catch (error) {
    console.error(error)
  }
}

/**
 * フォロー解除ボタンクリック
 * 
 * @param event
 */
const onUnFollowButtonClick = async (event: any) => {
  try {
    // クリックイベントを親要素に伝播させない
    event.stopPropagation();

    let res = await phpApiManager.usePostDeleteFollow(props.targetUser!.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res === false) {
      console.error("フォロー解除に失敗しました")

      return
    }

    useFollowUsersStore().removeFollow(props.targetUser!.id)
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
  <!-- フォローボタン -->
  <template v-if="!useFollowUsersStore().isFollowing(props.targetUser!.id)">
    <v-btn @click="onFollowButtonClick"
      :class="{ 'small-button': props.isSmallSize, 'large-button': !props.isSmallSize }"  
      color="success"
      rounded
      >         
      フォロー</v-btn>    
  </template>

  <!-- フォロー解除ボタン -->  
  <template v-if="useFollowUsersStore().isFollowing(props.targetUser!.id)">
    <v-btn @click="onUnFollowButtonClick"
      :class="{ 'small-button': props.isSmallSize, 'large-button': !props.isSmallSize }"  
      color="grey"
      rounded
      >
      <v-icon>mdi-check</v-icon>
      フォロー中
    </v-btn>
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

.large-button {
  width: 120px;
  font-size: 100%;
  font-weight: bold;  
}

.small-button {
  width: 100px;
  font-size: 100%;
}
</style>
