<script lang="ts" setup>
//======================================================
//
// userMyPageMenuButton.vue マイページのメニューボタン
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as  CONSTANTS from '@/composables/etc/constants'
import * as loginManager from '@/composables/util/loginManager'
import User from '@/composables/type/user'
import { useConfirmDialog } from '@/composables/util/dialogManager'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetUser: User
}>()

//======================================================
// vars
//======================================================

// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// computed
//======================================================

/**
 * メニューアイテムを切り替え
 * ・自分のページの場合・・・マイページ用のメニュー
 * ・他人のページの場合・・・他人のページ用のメニュー
 * 
 * @returns
 */
const getMenuItems = computed((): CONSTANTS.MenuItem[] => {
  if (props.targetUser.id == useLoginUserStore().user.id) {
    return CONSTANTS.MY_PAGE_MENU_ITEMS
  } else {
    return CONSTANTS.OTHER_USER_PAGE_MENU_ITEMS
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント メニューアイテムクリック
 */
const onClickMenuItem = async(item: CONSTANTS.MenuItem) => {
  try {
    //　台本紐づけ
    if (item.title == CONSTANTS.MENU_ITEM_LINK_SCRIPT.title) {
      useUiEventStore().uiEvent.isUserScriptLinkDialogShowing = true
      // ログアウト
    } else if (item.title == CONSTANTS.MENU_ITEM_LOG_OUT.title) {
      loginManager.useLogOut()

      useUiEventStore().uiEvent.bottomNotificationMessage = "ログアウトしました。"
      useUiEventStore().uiEvent.isBottomNotificationShowing = true
      // 2秒後に非表示
      setTimeout(() => {
        useUiEventStore().uiEvent.isBottomNotificationShowing = false
      }, 2000)

      // 違反報告
    } else if (item.title == CONSTANTS.MENU_ITEM_REPORT.title) {
      //　確認ダイアログ表示
      let res = await showConfirmDialog(CONSTANTS.CONFIRM_MSG_REPORT)
      if (!res) {
        return
      }

      useUiEventStore().uiEvent.reportTargetUser = props.targetUser

      navigateTo(CONSTANTS.PAGE_NAME_REPORT_EDIT_FORM)
      // フォロー一覧
    } else if (item.title == CONSTANTS.MENU_ITEM_FOLLOW.title) {
      navigateTo(CONSTANTS.PAGE_NAME_FOLLOWS)
      // ミュート一覧
    } else if (item.title == CONSTANTS.MENU_ITEM_MUTE.title) {
      navigateTo(CONSTANTS.PAGE_NAME_MUTES)
    // プロフィール編集
    } else if (item.title == CONSTANTS.MENU_ITEM_EDIT_PROFILE.title) {
      navigateTo(CONSTANTS.PAGE_NAME_USER_EDIT_FORM)        
    // 設定
    } else if (item.title === CONSTANTS.MENU_ITEM_CONFIG.title) { 
      useUiEventStore().uiEvent.isUserSettingDialogShowing = true
    // Xで共有
    } else if (item.title === CONSTANTS.MENU_ITEM_USER_SHARE.title) {
      onClickShareUser()
    }    
  } catch (error) {
    console.log('onClickMenuItem')  
  }
}

/**
 * 台本一覧をXで共有
 */
const onClickShareUser = () => {
  try {
    console.log("Xで共有")
    let txt = props.targetUser.name + "さんの台本一覧 - 声劇台本置き場\n"
    // ユーザのURLをセット
    let userUrl = CONSTANTS.USER_SHARE_BASE_URL
    userUrl += props.targetUser.id
    
    let xUrl = 'https://x.com/intent/tweet?url=' + userUrl + '&text=' + txt
    
    window.open(xUrl, '_blank')    
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
<template >
  <v-menu>
    <!-- ボタン -->
    <template v-slot:activator="{ props }">
      <v-btn class="mr-2 text-grey-darken-2" 
        icon="mdi-dots-vertical"
        v-bind="props"
        variant="outlined" density="comfortable" />        
    </template>

    <!-- メニュー -->
    <v-list class="pr-8">
      <v-list-item
        v-for="(item, i) in getMenuItems"
        :key="i"
        @click="onClickMenuItem(item)"
      >
        <template v-slot:prepend>
          <v-icon class="ml-1 text-body-1">{{ item.icon }}</v-icon>
        </template>
        <v-list-item-title>
          {{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>


</style>
