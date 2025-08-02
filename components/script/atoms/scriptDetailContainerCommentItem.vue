<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerCommentItem.vue コメントアイテム
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import Comment from '@/composables/type/comment'
import User from '@/composables/type/user'
import Notification from '@/composables/type/notification'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useLoginUserStore } from '@/store/loginUserStore';
import { useAccessTokenStore } from '@/store/accessTokenStore';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetComment: Comment
})

//======================================================
// reactive vars
//======================================================

// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});
// 削除ダイアログを表示するか
const _showDeleteDialog = ref(false)
// 編集欄を表示するか
const _showEditTextArea = ref(false)
// 返信欄を表示するか
const _showReplyTextArea = ref(false)
// コメントメッセージ
const _inputCommentMessage = ref<string>('')
// 返信用のコメント・メッセージ
const _inputReplyMessage = ref<string>('')

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    _inputCommentMessage.value = props.targetComment?.message!
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// computed
//======================================================

/**
 * メニューアイテムを返す
 */
const getMenuItems = computed(() => {
  let items = []

  try {
    // 自分のコメントの場合
    if (useLoginUserStore().user.id == props.targetComment?.user.id) {
      // 編集
      items.push(CONSTANTS.MENU_ITEM_COMMENT_EDIT)
      // 削除
      items.push(CONSTANTS.MENU_ITEM_COMMENT_DELETE)
    } else {
      items.push(CONSTANTS.MENU_ITEM_COMMENT_REPLY)
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
const onMenuItemClick = async (title: string) => {
  try {
    _inputCommentMessage.value = props.targetComment?.message!

    // 返信
    if (title == CONSTANTS.MENU_ITEM_COMMENT_REPLY.title) {      
      _showReplyTextArea.value = true
      // 編集      
    } else if (title == CONSTANTS.MENU_ITEM_COMMENT_EDIT.title) {
      _showEditTextArea.value = true
      // 削除
    } else if (title == CONSTANTS.MENU_ITEM_COMMENT_DELETE.title) {
      deleteComment()
    }
  } catch (error) {
    console.error(error)
  }
}


/**
 * イベント 編集完了ボタンクリック
 */
const onEditCompleteButtonClick = async () => {
  try {
    let cm = new Comment()
    cm.message = _inputCommentMessage.value
    cm.id = props.targetComment?.id!
    cm.userId = useLoginUserStore().user.id
    cm.user.id = useLoginUserStore().user.id
    cm.user.profileImageUrl = useLoginUserStore().user.profileImageUrl
    cm.user.name = useLoginUserStore().user.name
    cm.replyTargetCommentId = props.targetComment?.replyTargetCommentId!
    cm.scriptId = props.targetComment?.scriptId!

    // 編集
    let res = await phpApiManager.usePostUpdateComment(cm, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      _showEditTextArea.value = false

      // コメント再取得
      useUiEventStore().uiEvent.hasToReloadScriptComments = true
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 編集キャンセルボタンクリック
 */
const onEditCancelButtonClick = async (cid: number) => {
  try {
    _showEditTextArea.value = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 返信完了ボタンクリック
 */
const onReplyCompleteButtonClick = async (cid: number) => {
  try {
    let cm = new Comment()
    cm.message = CONSTANTS.SCRIPT_COMMENT_REPLY_PREFIX_CHAR + props.targetComment?.user.name + 'さん\n' + _inputReplyMessage.value

    cm.userId = useLoginUserStore().user.id
    cm.user.id = useLoginUserStore().user.id
    cm.user.profileImageUrl = useLoginUserStore().user.profileImageUrl
    cm.user.name = useLoginUserStore().user.name
    cm.scriptId = props.targetComment?.scriptId!

    // 返信なら親コメントを返信対象に
    if (props.targetComment?.replyTargetCommentId === 0) {
      cm.replyTargetCommentId = props.targetComment?.id!
    } else {
      cm.replyTargetCommentId = props.targetComment?.replyTargetCommentId!
    }

    cm.replyTargetUserId = props.targetComment?.user.id!

    // 登録
    let res = await phpApiManager.usePostCreateComment(cm, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      _showEditTextArea.value = false
    }
    _showReplyTextArea.value = false

    // お知らせを登録
    let us = new Notification()
    us.userId = useLoginUserStore().user.id
    us.notifyTargetUserId = cm.replyTargetUserId
    us.commentId = cm.replyTargetCommentId
    us.scriptId = cm.scriptId
    // メッセージをセット
    us.message = CONSTANTS.TOP_PAGE_MSG_COMMENT_FOR_SCRIPT_COMMENT
    us.message = us.message.replace(CONSTANTS.TOP_PAGE_MSG_USER_NAME_KEYWORD, useLoginUserStore().user.name)
    us.message = us.message.replace(CONSTANTS.TOP_PAGE_MSG_SCRIPT_NAME_KEYWORD, useLoginUserStore().user.name)
    us.user = useLoginUserStore().user

    // お知らせ送信
    res = await phpApiManager.usePostCreateNotification(us, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      console.log('お知らせ登録成功')
    }

    // コメント再取得
    useUiEventStore().uiEvent.hasToReloadScriptComments = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 返信キャンセルボタンクリック
 */
const onReplyCancelButtonClick = async (cid: number) => {
  try {
    _showReplyTextArea.value = false
  } catch (error) {
    console.error(error)
  }
}

/**
 * コメント削除実行
 */
const deleteComment = async () => {
  try {
    // 確認ダイアログ
    let res: boolean = await showConfirmDialog('このコメントを削除します。<br />よろしいですか？')
    if (!res) {
      return
    }
    
    // 削除
    await phpApiManager.usePostDeleteComment(props.targetComment!, useLoginUserStore().user, useAccessTokenStore().accessToken)

    // コメント再取得
    useUiEventStore().uiEvent.hasToReloadScriptComments = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント プロフィールアイコンクリック
 */
const onUserProfileClick = () => {
  try {    
    console.log("onUserProfileClick")

    useUiEventStore().uiEvent.profileShowingTargetUserId = props.targetComment!.user.id!
    useUiEventStore().uiEvent.isUserProfileDialogShowing = true
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
  <div 
    :class="{
      'reply': props.targetComment?.replyTargetCommentId !== 0 }">

    <v-list-item class="my-2">
      <!-- 画像表示領域 -->
      <template v-slot:prepend>
        <div 
        @click="onUserProfileClick"
        >
          <img id="user-icon" :src="props.targetComment?.user.profileImageUrl" />
        </div>
      </template>
      <!-- タイトル -->
      <v-list-item-title 
        id="user-name"
        @click="onUserProfileClick"
        class="text-body-2"
        >
        {{ props.targetComment?.user.name }}
        <small></small>
      </v-list-item-title>

      <template v-slot:append>
        <!-- メニューボタン -->
        <v-btn icon="" id="menu-button" variant="outlined" density="compact"
          v-if="!_showEditTextArea && !_showReplyTextArea">
          <v-icon>mdi-dots-vertical</v-icon>
          <!-- メニュー -->
          <v-menu activator="parent">
            <v-list>
              <v-list-item v-for="(item, i) in getMenuItems" :key="i" :value="item" variant="plain" class="px-4"
                :color="item.color" @click="onMenuItemClick(item.title)">
                <template v-slot:prepend>
                  <v-icon :icon="item.icon" :color="item.color"></v-icon>
                </template>
                <span class="mr-4">{{ item.title}}</span>                
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>

      <!-- 本文 -->
      <div id="message" class="text-body-2 text-grey-darken-4">
        <span v-if="!_showEditTextArea"> {{ targetComment?.message }}</span>
        <!-- 編集用入力欄 -->
        <v-textarea v-if="_showEditTextArea" v-model="_inputCommentMessage" rows="2" variant="outlined" auto-grow />
      </div>

      <div id="button-container" class="pb-1 mt-0 text-right">
        <template v-if="useLoginUserStore().user.id == props.targetComment?.user.id">
          <template v-if="_showEditTextArea">
            <v-btn class="bottom-button" color="" @click="onEditCancelButtonClick"><v-icon
                color="">mdi-close</v-icon>キャンセル</v-btn>

            <v-btn class="bottom-button ml-2" color="info" @click="onEditCompleteButtonClick"><v-icon
                color="">mdi-pen</v-icon>編集完了</v-btn>
          </template>
        </template>
      </div>

      <!-- 日付 -->
      <v-list-item-subtitle id="button-container" class="pb-1 mt-0 text-left" v-if="!_showEditTextArea">
        <small id="posted-date" class="mr-4">{{ props.targetComment!.postedAt.toLocaleString() }}</small>
      </v-list-item-subtitle>

      <!-- 返信用コメント欄 -->
      <div class="pb-2 text-right" v-if="_showReplyTextArea">
        <v-textarea class="ml-4 mt-4 mb-0" v-if="_showReplyTextArea" v-model="_inputReplyMessage" rows="2"
          variant="outlined" density="compact" label="返信コメントを入力" />

        <v-btn class="bottom-button " color="" @click="onReplyCancelButtonClick">キャンセル</v-btn>
        <v-btn class="bottom-button ml-1 px-4" color="success" @click="onReplyCompleteButtonClick"><v-icon
            color="">mdi-pen</v-icon>送信</v-btn>
      </div>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>
.v-list-item {
  width: 100%;
  margin: 0 auto;
}

.reply {
  margin-left: 32px;
}

#user-name {
  font-size: small;
  font-weight: bold;
  margin-left: 20px;
  color: #666666;
  cursor: pointer;  
}

#user-icon {
  border-radius: 30px;
  border: 0px solid #ccc;
  box-shadow: 0 0 4px #ddd;
  width: 30px;
  cursor: pointer;
}

#message {
  margin-left: 20px;
  //　改行を許可
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
}

#posted-date {
  margin-left: 20px;
  color: #5d5d5d;
}

#button-container {
  font-size: small;
}

.bottom-button {
  height: 30px;
  width: 100px;
  border: solid 0px #c3c3c3;
  font-size: smaller;
  padding: 0px 4px;
}

#menu-button {
  color: #666666;
  border: solid 1px #b5b5b5;
  font-size: small;
}

.menu-title {
  font-size: small
}

</style>