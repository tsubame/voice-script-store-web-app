<script lang="ts" setup>
//======================================================
//
// userMuteButton.vue ミュートボタン
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
// vars
//======================================================

// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// methods
//======================================================

/**
 * イベント ミュートボタンクリック
 */
const onMuteButtonClick = async (event: any) => {
  try {
    // クリックイベントを親要素に伝播させない    
    event.stopPropagation();

    // ログインしていない場合、ログインダイアログ表示
    if (!useLoginUserStore().hasLogined()) { 
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }
        
    // 確認ダイアログ
    let res: boolean = await showConfirmDialog("このユーザをミュートします。よろしいですか？ <br /><br />※このユーザの台本は一覧に表示されなくなります。")
    if (!res) {
      return
    }

    // ミュート
    res = await phpApiManager.usePostCreateMute(props.targetUser!.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (!res) {
      console.log("ミュートに失敗しました")

      return
    }

    // ミュート中のユーザを追加
    useMuteUsersStore().addMute(props.targetUser!.id)

    // ツールチップを表示
    useUiEventStore().uiEvent.isBottomNotificationShowing = true
    useUiEventStore().uiEvent.bottomNotificationMessage = props.targetUser!.name + "さんをミュートしました。"

    // 1秒後に非表示
    setTimeout(() => {
      useUiEventStore().uiEvent.isBottomNotificationShowing = false
    }, 1500)        
  } catch (error) {
    console.error(error)
  }
}

/**
 * ミュート解除ボタンクリック
 */
const onUnMuteButtonClick = async (event: any) => {
  try {
    // クリックイベントを親要素に伝播させない    
    event.stopPropagation();

    // 確認ダイアログ
    let res: boolean = await showConfirmDialog("このユーザをミュートを解除します。よろしいですか？")
    if (!res) {
      return
    }

    // ミュート解除
    res = await phpApiManager.usePostDeleteMute(props.targetUser!.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (!res) {
      console.log("ミュートに失敗しました")

      return
    }

    // ミュート中のユーザを削除
    useMuteUsersStore().removeMute(props.targetUser!.id)
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
  <!-- ミュートボタン -->
  <template v-if="!useMuteUsersStore().isMuting(props.targetUser!.id)">
    <v-btn @click="onMuteButtonClick"
      id="mute-button" 
      :class="{ 'small-button': props.isSmallSize, 'large-button': !props.isSmallSize }"  
      color="warning"
      rounded
      >            
      ミュート</v-btn>    
  </template>

  <!-- ミュート解除ボタン -->  
  <template v-if="useMuteUsersStore().isMuting(props.targetUser!.id)">
    <v-btn @click="onUnMuteButtonClick"
      id="un-mute-button"
      :class="{ 'small-button': props.isSmallSize, 'large-button': !props.isSmallSize }"  
      color="grey"
      rounded
      >
      <v-icon>mdi-check</v-icon>
      ミュート中
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
