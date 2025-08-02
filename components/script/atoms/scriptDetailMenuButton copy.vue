<script lang="ts" setup>
//======================================================
//
// scriptDetailMenuButton.vue 台本詳細のメニューボタン
//
//======================================================

import { computed, ref } from "vue";
import * as CONSTANTS from '@/composables/etc/constants'
import * as favScriptsStore from '@/store/favScriptsStore'
import * as loginUserStore from '@/store/loginUserStore'
import * as phpApiManager from '@/composables/util/phpApiManager';
import Script from "@/composables/type/script"
import { useConfirmDialog } from '@/composables/util/dialogManager'

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
    //items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_SHARE)

    // 自分の台本以外なら
    if (useScriptStore().targetScript?.userId !== useLoginUserStore().user.id) {

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
      }

      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_REPORT)
    // 自分の台本なら
    } else { 
      items.push(CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_EDIT)
    }
  } catch (error) {
    console.error(error)
  }

  return items
})

//======================================================
// methods
//======================================================

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
      // Xで共有
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_SHARE.title:
        onShareButtonClick()

        break
      // 編集
      case CONSTANTS.SCRIPT_DETAIL_MENU_ITEM_EDIT.title:
        onEditButtonClick()

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
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Xで共有
 */
const onShareButtonClick = () => {
  try {
    /*
    console.log("Xで共有")
    let txt = encodeURIComponent(useScriptStore().targetScript?.getShareText()) // テキストをURLエンコード
 
    let fullUrl = window.location.href
    //let shareUrl = fullUrl.replace(/^https?:\/\//, '') // https:// または http:// を除去

    let xUrl = 'https://x.com/intent/tweet?url=' + fullUrl + '&text=' + txt
    
    window.open(xUrl, '_blank')
    */
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
    :class="{
      'mr-4': true,
      'half-transparent': props.outlined,
      'text-grey-darken-2': true
    }"
    icon="mdi-dots-horizontal"    
    :variant="props.outlined ? 'flat' : 'elevated'"
    density="comfortable"
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
  width: 50px;
  height: 30px;
  border: solid 1px #a1a1a1;
  border-radius: 16px;
  font-size: 70%;
}

.half-transparent {
 // opacity: 0.5 !important;
}

</style>
