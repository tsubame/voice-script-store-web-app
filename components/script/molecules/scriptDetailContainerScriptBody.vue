<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerScriptBody.vue 台本詳細の本文
//
//======================================================

// vue
import { reactive, onMounted, computed, watch, ref } from 'vue';
// 定数
import * as CONSTANTS from '@/composables/etc/constants'
// 台本
import Word from "@/composables/type/word"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  words: Array<Word>,
})

// emits
const emits = defineEmits(['onClickWordItem'])

//======================================================
// methods
//======================================================

/**
 * イベント セリフクリック
 */
const onClickWordItem = (cName: string) => {
  try {
    emits('onClickWordItem', cName)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント コピー時
 * ・コピーをキャンセル
 */
const onCopyEvent = (e: ClipboardEvent) => {
  try {
    e.preventDefault()
    alert('台本の本文はコピーできません。')    
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
  <div id="script-body" class="mt-4 px-0 pb-0 text-black">
    <div v-for="( wd, i ) in props.words   " :key="i" @click="onClickWordItem(wd.charaName)" :class="{
      'selected': useUiEventStore().uiEvent.scriptSelectedNames.indexOf(wd.charaName) !== -1,
      'v-list-item--active': false,
      'word': true,
      'not-border': props.words!.length - 1 === i && wd.text === '',
      'px-4': !useDisplay().mobile.value,
      }"

    @copy="onCopyEvent"
    >      
      <script-detail-word :targetWord="wd" />
    </div>
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
/** 台本本文 */
#script-body {
  padding: 0px 0px;
  border: solid 0px #999999;
}

.word {
  display: flex;
  /* Flexboxを使用 */
  align-items: center;
  /* 縦位置を中央揃え */
  min-height: 70px;

  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: solid 1px #DDDDDD;
}

.word:hover {
  cursor: pointer;
}

.not-border {
  border: solid 0px #999999;
}

/* 選択されたセリフ */
.selected {
  background-color: #f0f8fc;
  /*#f3f9fd; /* 縦書き:"#efefef" */
}
</style>
