<script lang="ts" setup>
//======================================================
//
// scriptHeaderMenuButton..vue 台本詳細のメニューボタン
//
//======================================================

import { computed, ref } from "vue";
import * as CONSTANTS from '@/composables/etc/constants'
import * as favScriptsStore from '@/store/favScriptsStore'
import * as loginUserStore from '@/store/loginUserStore'
import * as phpApiManager from '@/composables/util/phpApiManager';
import Script from "@/composables/type/script"
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { SCRIPT_DETAIL_MENU_ITEM_COMMENT } from '../../../composables/etc/constants';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  outlined: boolean,
}>()

// emits
const emits = defineEmits(['onLikeButtonClick'])

//======================================================
// vars
//======================================================

// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// computed
//======================================================

/**
 * メニューアイテムを返す
 */
const getMenuItems = computed(() => {
  let items = [] as Array<any>
      
  try {
    // フルスクリーン時なら
    if (useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_CHANGE_BG_IMAGE)
    }

    // フルスクリーン時以外なら
    if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      // 縦書き表示
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_SHOW_BY_VERTICAL)
    }

    // 作者のプロフィールを表示
    items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_AUTHOR_PROFILE)

    // フルスクリーン時以外なら
    if (!useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      // 台本コメント
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_COMMENT)
    }

    // 自分の台本以外なら
    if (useScriptStore().targetScript?.userId !== useLoginUserStore().user.id) {

      /*
      // 該当ユーザをフォロー中なら
      if (useFollowUsersStore().isFollowing(useScriptStore().targetScript?.userId)) {
        items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_UN_FOLLOW)
      } else {
        items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_FOLLOW)
      }

      // 該当ユーザをミュート中なら
      if (useMuteUsersStore().isMuting(useScriptStore().targetScript?.userId)) {
        items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_UN_MUTE)
      } else {
        items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_MUTE)
      }*/


      // 違反報告
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_REPORT)
    // 自分の台本なら
    } else { 
      // 編集
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_EDIT)
    }

    // フルスクリーン時なら
    if (useUiEventStore().uiEvent.isScriptFullScreenDialogShowing) {
      // 戻る
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_BACK_TO_DETAIL)
    }
  } catch (error) {
    console.error(error)
  }

  return items
})

//======================================================
// methods
//======================================================

/**
 * イベント メニューアイテムクリック
 */
const onMenuItemClick = async(item: any) => {
  try {
    console.log("[メニューアイテムクリック]" + item.title)
    switch (item.title) {
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_EDIT.title:
        onEditButtonClick()

        break
      // 縦書き表示
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_SHOW_BY_VERTICAL.title:
        onShowByVerticalButtonClick()

        break
      // 作者のプロフィール
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_AUTHOR_PROFILE.title:
        onShowProfileButtonClick() 

        break        
      // 台本コメント
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_COMMENT.title:
        onMoveToCommentButtonClick() 

        break              
      // フォロー
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_FOLLOW.title:
        onFollowButtonClick()

        break
      // フォロー解除
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_UN_FOLLOW.title:
        onUnFollowButtonClick()

        break        
      // ミュート
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_MUTE.title:
        onMuteButtonClick()

        break
      // ミュート解除
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_UN_MUTE.title:
        onUnMuteButtonClick()

        break        
      // 背景変更
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_CHANGE_BG_IMAGE.title:
        onChangeBgImageButtonClick()

        break               
      // 違反報告
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_REPORT.title:
        //　確認ダイアログ表示
        let res = await showConfirmDialog(CONSTANTS.CONFIRM_MSG_REPORT)
        if (!res) {
          return
        }

        useUiEventStore().uiEvent.reportTargetScript = useScriptStore().targetScript
        useUiEventStore().uiEvent.reportTargetUser = useScriptStore().targetScript.authorUser
        useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false

        navigateTo(CONSTANTS.PAGE_NAME_REPORT_EDIT_FORM)

        break
      // 戻る
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_BACK_TO_DETAIL.title:
        useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false

        break
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * 縦書き表示
 */
const onShowByVerticalButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * 作者のプロフィール
 */
const onShowProfileButtonClick = () => {
  try {
    useUiEventStore().uiEvent.profileShowingTargetUserId = useScriptStore().targetScript.authorUser.id
    useUiEventStore().uiEvent.isUserProfileDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * 台本コメント
 */
const onMoveToCommentButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isScriptCommentButtonClicked = true

    // 0.5秒後にオフに
    setTimeout(() => {
      useUiEventStore().uiEvent.isScriptCommentButtonClicked = false
    }, 500)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 台本編集
 */
const onEditButtonClick = () => {
  try {
    console.log("編集")
    useUiEventStore().uiEvent.isScriptFullScreenDialogShowing = false
    useScriptStore().edittingScriptId = useScriptStore().targetScript.id
    navigateTo(CONSTANTS.PAGE_NAME_SCRIPT_EDIT_FORM)
  } catch (error) {
    console.error(error)
  }
}

/**
 * フォローボタンクリック
 */
const onFollowButtonClick = async () => {
  try {
    // ログインしていない場合、ログインダイアログ表示
    if (!useLoginUserStore().hasLogined()) { 
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }

    let res = await phpApiManager.usePostCreateFollow(useScriptStore().targetScript.authorUser.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res === false) {
      console.error("フォローに失敗しました")

      return
    }

    useFollowUsersStore().addFollow(useScriptStore().targetScript.authorUser.id)

    useUiEventStore().uiEvent.okDialogMessage = useScriptStore().targetScript.authorUser.name + "さんをフォローしました。"
    useUiEventStore().uiEvent.isOkDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * フォロー解除ボタンクリック
 * 
 */
const onUnFollowButtonClick = async () => {
  try {
    let res = await phpApiManager.usePostDeleteFollow(useScriptStore().targetScript.authorUser.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res === false) {
      console.error("フォロー解除に失敗しました")

      return
    }

    useFollowUsersStore().removeFollow(useScriptStore().targetScript.authorUser.id)

    useUiEventStore().uiEvent.okDialogMessage = useScriptStore().targetScript.authorUser.name + "さんのフォローを解除しました。"
    useUiEventStore().uiEvent.isOkDialogShowing = true    
  } catch (error) {
    console.error(error)
  }
}


/**
 * イベント ミュートボタンクリック
 */
const onMuteButtonClick = async () => {
  try {
    // ログインしていない場合、ログインダイアログ表示
    if (!useLoginUserStore().hasLogined()) { 
      useUiEventStore().uiEvent.isLoginDialogShowing = true

      return
    }
        
    // 確認ダイアログ
    let res: boolean = await showConfirmDialog('作者をミュートします。よろしいですか？ <br /><br />※このユーザの台本は一覧に表示されなくなります。')
    if (!res) {
      return
    }

    // ミュート
    res = await phpApiManager.usePostCreateMute(useScriptStore().targetScript.authorUser.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (!res) {
      console.log("ミュートに失敗しました")

      return
    }

    // ミュート中のユーザを追加
    useMuteUsersStore().addMute(useScriptStore().targetScript.authorUser.id)
  } catch (error) {
    console.error(error)
  }
}

/**
 * ミュート解除ボタンクリック
 */
const onUnMuteButtonClick = async () => {
  try {
    // 確認ダイアログ
    let res: boolean = await showConfirmDialog('作者のミュートを解除します。よろしいですか？')
    if (!res) {
      return
    }

    // ミュート解除
    res = await phpApiManager.usePostDeleteMute(useScriptStore().targetScript.authorUser.id, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (!res) {
      console.log("ミュートに失敗しました")

      return
    }

    // ミュート中のユーザを削除
    useMuteUsersStore().removeMute(useScriptStore().targetScript.authorUser.id)
  } catch (error) {
    console.error(error)
  }
}


/**
 * 背景変更
 */
const onChangeBgImageButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isScriptFullScreenBgImageSelectDialogShowing = true
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
  <!-- メニューボタン -->
  <v-btn 
    id="menu-button" 
    class="ml-4 text-grey-darken-2"   
    density="comfortable"
    variant="elevated"      
    icon="mdi-dots-horizontal"    
    >
    <v-icon>mdi-dots-horizontal</v-icon>
    <v-menu activator="parent">
      <v-list>
        <template v-for="(item, i) in getMenuItems" :key="i" :value="item">
          <v-list-item class="px-4" @click="onMenuItemClick(item)">
            <template v-slot:prepend>
              <v-icon :icon="item.preIcon" :color="item.color"></v-icon>
            </template>
            <v-list-item-title v-text="item.title" class="menu-title pr-4" />
          </v-list-item>
        </template>
      </v-list>
    </v-menu>
  </v-btn> 
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

#menu-button {
  //color: #454545;
  opacity: 0.6;
}
</style>
