<script lang="ts" setup>
//======================================================
//
// scriptDetailWord.vue 
// 台本詳細ページのセリフ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import * as CONSTANTS  from '@/composables/etc/constants'
import Word from "@/composables/type/word"
import * as scriptTextManager from '@/composables/util/scriptTextManager';
import { useUserSettingStore } from '@/store/userSettingStore'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetWord: Word,
  showByVertical: Boolean
})

//======================================================
// vars
//======================================================



</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <!-- キャラ名が全角スペースならスタイル無しでキャラ名出力 -->
  <span v-show="props.targetWord?.charaName == CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT"
    class=" chara-name empty-chara-name"> {{
      props.targetWord?.charaName }}
  </span>

  <!-- キャラ名がブランク、あるいは全角スペースの時以外-->
  <span
    v-show="props.targetWord?.charaName != '' && props.targetWord?.charaName !== CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT"
    :class="{
      'vertical-chara-name': props.showByVertical,
      'horizontal-chara-name': !props.showByVertical,
    }" :style="{
      'background-color': props.targetWord?.charaNameBgColor,
      'color': props.targetWord?.charaNameFontColor,
      'border': CONSTANTS.SCRIPT_BORDER_STYLE_PREFIX + props.targetWord?.charaNameBorderColor, 
    }
      "> {{ props.targetWord?.charaName }}
  </span>
  <p :class="{
    'horizontal-word': !props.showByVertical,
    'vertical-word': props.showByVertical,    
    }" >
    <!-- ト書きなら"ーー"を付与 -->
    <span 
    v-show="props.targetWord?.charaName == '' && props.targetWord?.text.trim() !== ''"
    :style="{
        'font-size': useUserSettingStore().cookieSavedScriptTextFontSizeRate + '%'
    }"
    >
      {{ CONSTANTS.SCRIPT_NARRATION_PREFIX_TXT }}
    </span>

    <!-- ルビを付与したテキストを出力 -->
    <template v-if="props.targetWord?.hasRubyTxt()">
      <span 
      v-html="scriptTextManager.useAddRubyTagToTxt(props.targetWord!.text)" 
      class="ruby-txt"
      :style="{
        'font-size': useUserSettingStore().cookieSavedScriptTextFontSizeRate + '%'
      }"
      />
    </template>

    <!-- ルビなしのテキストを出力 -->
    <template v-if="!props.targetWord?.hasRubyTxt()">
      <span
      :style="{
        'font-size': useUserSettingStore().cookieSavedScriptTextFontSizeRate + '%'
      }"
      >{{ props.targetWord!.text }}</span>
    </template>
  </p>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>
.empty-chara-name {
  display: inline-block;
  width: 70px;
  min-width: 70px;
  margin-left: 4px;
  padding: 2px;
  font-size: small;
  border-radius: 4px;
  text-align: center;
  border: solid 0px #b1b1b1;
  background-color: transparent;
}

.word-text {
  display: block;
  //font-size: 90%;
  border: solid 0px #999999;
  /** 改行を有効化 */
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
}

/* キャラ名 */
.vertical-chara-name {
  display: block;
  height: fit-content;
  margin: 0;
  padding: 4px 2px;
  border-radius: 4px;
  min-height: 60px;
  writing-mode: vertical-rl;
  width: 25px;
  font-size: small;
  border: solid 1px #999999;
  background-color: #f0f0f0;
}

.horizontal-chara-name {
  position: relative;
  display: block;
  left: 0px;
  min-width: 80px;
  //width: fit-content;
  //width: $chara-width; //60px;
  width: fit-content;  
  //min-width: $chara-width; //60px;    
  margin-top: 8px;
  margin-bottom: 12px;
  margin-left: 0px;
  padding: 2px 2px;
  border-radius: 4px;
  text-align: center;
  font-size: small;
  border: solid 1px #999999;
  background-color: #f0f0f0;
}

.empty-chara-name {
  display: inline-block;
  width: 70px;
  min-width: 70px;
  margin-left: 4px;
  padding: 2px;
  font-size: small;
  border-radius: 4px;
  text-align: center;
  border: solid 0px #b1b1b1;
  background-color: transparent;
}

p {
  margin: 4px 12px;
  cursor: pointer;
  /** 改行を有効化 */
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
}

.horizontal-word {
  position: relative;
  left: 0px;
  margin: 20px 4px 20px !important;
  //font-size: 90%;
  border: solid 0px #999999;
}

.vertical-word {
  padding-bottom: 20px;
}

/* ルビありの行 */
.ruby-txt {
  line-height: 180%;
}

/** 透明度を上げる */
.has-opacity {
  opacity: 0.8;
}
</style>