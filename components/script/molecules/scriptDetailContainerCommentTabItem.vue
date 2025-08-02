<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerCommentTabItem.vue 
// コメントタブアイテム
//
//======================================================

import InfiniteLoading from "v3-infinite-loading";
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useUiEventStore } from '@/store/uiEventStore';
import { useLoginUserStore } from '@/store/loginUserStore'
import Script from "@/composables/type/script"
import Comment from '@/composables/type/comment';
import Notification from '@/composables/type/notification';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetScript: Script,
})

//======================================================
// vars
//======================================================

// コメント入力用メッセージ
const _inputCommentMessage = ref('')
// 対象台本
const _targetScript = ref<Script>(new Script())
// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    _targetScript.value = props.targetScript!

    // コメントソート
    _targetScript.value.sortComments()    
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント コメント投稿ボタンクリック
 */
const onPostNewCommentButtonClick = async () => {
  try {
    let cm = new Comment()
    cm.message = _inputCommentMessage.value
    cm.userId = useLoginUserStore().user.id
    cm.user.id = useLoginUserStore().user.id
    cm.user.profileImageUrl = useLoginUserStore().user.profileImageUrl
    cm.user.name = useLoginUserStore().user.name
    cm.scriptId = props.targetScript!.id

    // 空なら終了
    if (cm.message.trim() === "") {
      alert('コメントが入力されていません。')

      return
    }

    // 確認ダイアログ
    let res: boolean = await showConfirmDialog('この台本に対するコメントを投稿します。よろしいですか？')
    if (!res) {
      return
    }

    // 登録
    res = await phpApiManager.usePostCreateComment(cm, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      // コメント再セット
      resetTargetScriptComments()
    }

    // クリア
    _inputCommentMessage.value = ""

    // 自分の台本なら通知を送信しない
    if (props.targetScript!.userId === useLoginUserStore().user.id) {
      return
    }

    // お知らせを登録
    let us = new Notification()
    us.userId = useLoginUserStore().user.id
    us.notifyTargetUserId = props.targetScript!.userId
    us.scriptId = props.targetScript!.id
    us.isCommentNotification = true
    us.message = CONSTANTS.TOP_PAGE_MSG_COMMENT_FOR_SCRIPT_COMMENT
    us.message = us.message.replace(CONSTANTS.TOP_PAGE_MSG_SCRIPT_NAME_KEYWORD, props.targetScript!.title)
    us.user = useLoginUserStore().user

    await phpApiManager.usePostCreateNotification(us, useLoginUserStore().user, useAccessTokenStore().accessToken)
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch コメント再取得
 */
watch(() => useUiEventStore().uiEvent.hasToReloadScriptComments, async (newVal) => {
  try {
    if (useUiEventStore().uiEvent.hasToReloadScriptComments) {
      // コメント再セット
      await resetTargetScriptComments()
      useUiEventStore().uiEvent.hasToReloadScriptComments = false
    }
  } catch (error) {
    console.error(error)
  }
})

/**
 * コメントデータを再取得
 */
const resetTargetScriptComments = async () => {
  try {
    let res = await phpApiManager.useGetReadCommentsByScriptId(_targetScript.value.id)
    if (res) {
      _targetScript.value!.comments = res
      // コメントソート
      _targetScript.value.sortComments()

      console.log(_targetScript.value.comments)
    }
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
  <v-row justify="center" id="container">
    <!-- コメント一覧 -->
    <v-col cols="12" class="text-left px-0">

      <v-card-title class="mt-0">
        <h3 class="green mt-4 px-0 mb-2">
          <v-icon class="mr-2 ml-2 mb-1" color="teal-lighten-3">mdi-pencil</v-icon>台本へのコメント
        </h3>   
      </v-card-title>

      <v-card-text
        id="comment-item-container"
        :class="{'px-8': useDisplay().smAndUp.value }"
        >
        <v-list class="mt-4">
          <template v-for="(cm, index) in _targetScript.comments" :key="index">
            <script-detail-container-comment-item :targetComment="cm" />
          </template>
        </v-list>
      </v-card-text>
    </v-col>

    <!-- 入力欄。ログインの際に表示 -->
    <template v-if="useLoginUserStore().hasLogined()">
      <v-col cols="12" id="input-container" class="text-center mt-6 pt-6 pb-6 px-8 mx-12">
        <!--<h5 class="mb-2 text-left">コメント投稿</h5>-->
        <v-textarea  v-model="_inputCommentMessage" 
          rows="5"
          placeholder="コメントを入力（例：お借りしました！）"
          density="compact"
          variant="outlined"
          hide-details
          />

        <v-row justify="end">
          <v-col cols="6" class="text-right mt-4">
            <v-btn  @click="onPostNewCommentButtonClick" color="teal" variant="outlined" rounded>        
              投稿</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </template>
    <template v-else>
      <v-col cols="12" class="text-center mt-0 pb-12 px-12 mx-12 text-body-2">
        ※コメントするにはログインが必要です。
      </v-col>
      <v-col cols="12" class="text-center mt-0 pb-12 px-12 mx-12 text-body-2">
        <common-login-button />
      </v-col>      
    </template>
  </v-row>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->

<style lang="scss" scoped>
#container {
  //max-width: 800px;
  margin: auto;
}

#input-container {
  max-width: 800px;
  margin: auto; 
}

.v-textarea {
  background-color: #F4F7FA;
}

#comment-item-container {
  margin: auto;
}
</style>
