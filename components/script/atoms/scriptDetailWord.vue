<script lang="ts" setup>
//======================================================
//
// scriptDetailWord.vue 台本詳細ページのセリフ
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import Word from "@/composables/type/word"
import * as scriptTextManager from '@/composables/util/scriptTextManager';
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetWord: Word
})

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
  <template v-if="props.targetWord?.charaName == CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT">
    <span class="empty-chara-name"> 
      {{ props.targetWord?.charaName }} 
    </span>
  </template>
  <!-- キャラ名が空欄ならスタイル無しでキャラ名出力 -->
  <template v-if="props.targetWord?.charaName == ''">
    <span class="empty-chara-name"> 
      &nbsp;
    </span>
  </template>  

  <!-- キャラ名が空でなければキャラ名出力 -->
  <template v-if="props.targetWord?.charaName != '' && props.targetWord?.charaName !== CONSTANTS.SCRIPT_EMPTY_CHARACTER_NAME_TXT">
    <span
      :class="{
        'chara-name': true,
        'is-not-mobile': useDisplay().smAndUp.value,
        'small-font-size': CONSTANTS.CHARA_NAME_FONT_SIZE_SMALL_THRESHOLD <= props.targetWord!.charaName.length,
      }"
      :style="{
        'background-color': props.targetWord?.charaNameBgColor,
        'color': props.targetWord?.charaNameFontColor,
        'border': CONSTANTS.SCRIPT_BORDER_STYLE_PREFIX + props.targetWord?.charaNameBorderColor,
      }"> {{ props.targetWord?.charaName }} 
    </span>
  </template>

  <!-- セリフ -->
  <span class="word-text mx-4">  
    <!-- キャラ名が空、かつセリフが空でなければダッシュ付与 -->
    <template v-if="props.targetWord?.charaName == '' && props.targetWord.text !== ''">
      <span class="text-grey-darken-2"
      >
      {{ CONSTANTS.SCRIPT_DETAIL_NARRATION_PREFIX_TXT }}
      </span>
    </template>
    
    <!-- ルビを付与したテキストを出力 -->
    <template v-if="props.targetWord?.hasRubyTxt()">
      <span v-html="scriptTextManager.useAddRubyTagToTxt(props.targetWord!.text)" class="ruby-txt"
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
      >
        {{ props.targetWord!.text }}
      </span>
    </template>
  </span>
</template>
<!--
//======================================================
//
//  CSS
//
//======================================================
-->
<style lang="scss" scoped>
/** キャラクター一覧、本文共通 キャラ名 */
.chara-name {
  display: inline-block;
  //width: 70px;
  //min-width: 70px;
  width: $chara-width; //60px;
  min-width: $chara-width; //60px;  
  margin-left: 4px;
  padding: 2px;
  //padding: 6px 2px;  
  font-size: 80%;
  border-radius: 4px;
  text-align: center;
  border: solid 1px #b1b1b1;
  background-color: #f0f0f0;

  opacity: $character-opacity;
}

.small-font-size {
  //font-size: 50% !important;
}

.is-not-mobile {
  margin-left: 20px;
  margin-right: 20px;  
}

.empty-chara-name {
  display: inline-block;
  width: $chara-width; //60px;
  min-width: $chara-width; //60px;  
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
  font-size: 100%;
  width: 100%;
  border: solid 0px #999999;
  margin-top: 20px;
  margin-bottom: 20px;  
  //line-height: 180%;
  /** 改行を有効化 */
  white-space: pre-line;
  text-indent: 0;
  word-wrap: break-word;
  border: solid 0px #999999;
}

/* ルビありの行 */
.ruby-txt {
  line-height: 180%;
}

/** 透明度を上げる */
.has-opacity {
  //opacity: 0.8;
}
</style>