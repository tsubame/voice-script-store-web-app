<script lang="ts" setup>

//======================================================
// 
// scriptFileUploadButton.vue
// ファイルアップロード用ボタン
//
//======================================================

import { reactive, onMounted, ref } from 'vue';
import * as CONSTANTS from '@/composables/etc/constants'
import { useScriptStore } from '@/store/scriptStore'

//======================================================
// props、emits
//======================================================

const emits = defineEmits(['onFileSelect'])

//======================================================
// vars
//======================================================

// 選択中か
const _isSelecting = ref<boolean>(false)
// ドラッグ中か
const _isDragged = ref<boolean>(false)
// 選択されたファイル
const _selectedFile = ref<File | null>(null)
// ファイルアップロードボタン
const _uploader = ref<HTMLInputElement>()

//======================================================
// methods
//======================================================

/**
 * イベント ボタンクリック
 * ・ファイル選択ダイアログを開く
 */
const openFileSelect = () => {
  try {
    _isSelecting.value = true
    window.addEventListener('focus', () => {
      _isSelecting.value = false
    }, { once: true })

    _uploader.value?.click()
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント ファイル選択状態変更
 * 確定時にEmit
 */
const onFileSelectChange = (e: Event) => {
  try {
    const target = e.target as HTMLInputElement
    const files = target.files
    const file = files![0]

    // 拡張子が.txt以外ならエラー
    if (!file.name.endsWith(SCRIPT_FORM_ACCEPT_EXTENSION)) {
      alert("選択可能なファイルは拡張子が" + SCRIPT_FORM_ACCEPT_EXTENSION + "のファイルのみです。")

      return
    }

    _selectedFile.value = file
    useScriptStore().uploadSelectedFileName = file.name
    console.log(file.name)

    emits("onFileSelect", file)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント ドラッグアンドドロップD&D時にEmit
 */
const onFileDropped = (e: DragEvent) => {
  try {
    _isDragged.value = false
    if (!e) {
      return
    } else if (!e.dataTransfer) {
      return
    } else if (e.dataTransfer.files.length === 0) {
      return
    }

    const file = e.dataTransfer.files[0]

    // 拡張子がaccept以外ならエラー
    if (!file.name.endsWith(SCRIPT_FORM_ACCEPT_EXTENSION)) {
      alert("選択可能なファイルは拡張子が" + SCRIPT_FORM_ACCEPT_EXTENSION + "のファイルのみです。")

      return
    }

    _selectedFile.value = file
    useScriptStore().uploadSelectedFileName = file.name
    console.log(file.name)

    emits("onFileSelect", file)
  } catch (error) {
    console.error(error)
    
  }
  
}

</script>
<!--
//======================================================
//
//  HTML
//
//======================================================  
-->
<template>
  <div id="container" class="px-0 py-0" @dragover.prevent="_isDragged = true" @dragleave.prevent="_isDragged = false"
    @drop.prevent="onFileDropped" depressed @click="openFileSelect">
    <p>
      <v-btn id="select-button" color="success" rounded>
        <template v-slot:prepend><v-icon color="succes">mdi-paperclip</v-icon></template>
        台本ファイルを選択
      </v-btn>
    </p>
    <!-- ファイルアップロード時 -->
    <p v-show="useScriptStore().uploadSelectedFileName !== ''" id="selected-file-name" class="ml-4 text-grey-darken-2">
      <v-icon color="grey">mdi-text-box-outline</v-icon>
      {{ useScriptStore().uploadSelectedFileName }}
    </p>
    <input ref="_uploader" class="d-none" type="file" :accept="SCRIPT_FORM_ACCEPT_EXTENSION" @change="onFileSelectChange">
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
#container {
  display: flex;
  width: fit-content;
  min-height: 40px;
  border: dotted 0px #999999;
  align-items: center;
}

#select-button {
  height: 40px;
}

#selected-file-name {
  font-size: small;
  padding: 4px;
  border: solid 0px #d7d7d7;
}
</style>
