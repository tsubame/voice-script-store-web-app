<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerInner.vue 台本詳細
// 別コンポーネントから呼び出され、台本詳細ページをページ全体に表示
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUserSettingStore } from '@/store/userSettingStore'
import { useUiEventStore } from '@/store/uiEventStore'
import InfiniteLoading from "v3-infinite-loading";
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import * as scriptStore from '@/store/scriptStore'
import * as scriptTextManager from '@/composables/util/scriptTextManager';
import Script from "@/composables/type/script"
import Word from "@/composables/type/word"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetScript: Script,
})

// emits
const emits = defineEmits(['scrollToSavedPosition'])

//======================================================
// vars
//======================================================

// 選択された名前
const _selectedNames = ref(new Array<string>())

//======================================================
// methods
//======================================================

/**
 * イベント セリフクリック
 */
const onClickCharactorItem = (cName: string) => {
  try {
    if (cName == "") {
      return
    }

    console.log(cName)

    // 選択済なら
    if (useUiEventStore().uiEvent.scriptSelectedNames.indexOf(cName) !== -1) {
      // 配列から削除
      useUiEventStore().uiEvent.scriptSelectedNames = useUiEventStore().uiEvent.scriptSelectedNames
        .filter((name) => name !== cName)
    } else {
      // 配列に追加
      useUiEventStore().uiEvent.scriptSelectedNames.push(cName)
    }

    console.log(useUiEventStore().uiEvent.scriptSelectedNames)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 該当キャラのセリフ数を返す
 */
const getWordCount = (charaName: string): number => {
  let n = 0

  try {
    props.targetScript?.words.forEach((w: Word) => {
      if (w.charaName !== "") {
        if (w.isTargetCharaWord(charaName)) {
          n++
        }
      }
    })
  } catch (error) {
    console.error(error)
  }

  return n
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
  <!--<div id="charactors" class="mt-0 pt-4">-->
  <v-row class="my-2 pt-2">
    <v-col cols="12">
         
      <h3 class="green mx-2 text-body-1 font-weight-bold">
        <!--<v-icon class="title-icon mr-2" color="teal-lighten-3">mdi-book-open-page-variant</v-icon>     --> 
        登場人物</h3>
    </v-col>

    <v-col class="mt-2 py-0 pr-0">
      <template  v-for="(c, i ) in props.targetScript?.charactors" :key="i">
        <v-row class="chara-list-item mb-0 mt-0 px-0">
          <v-col cols="12" 
            :class="{
              'pt-4': true,
              'pb-10': true,              
              'pl-5': useDisplay().mobile.value,
              'pl-10': !useDisplay().mobile.value,
              'selected': useUiEventStore().uiEvent.scriptSelectedNames.indexOf(c.name) !== -1
            }"       
                      
            @click="onClickCharactorItem(c.name)"
            >

            <div class="chara-container py-2">
              <div 
                class="chara-name-container px-0"
                >
                
                <template v-if="CONSTANTS.SET_CHARA_COLOR_AS_VUETIFY_COLOR">
                  <span class="chara-name ml-1" 
                  :style="{
                    'background-color': c.getBgColorForView(),
                    'color': c.fontColor,
                    'border': 'solid 1px ' + c.getBorderColorForView(),              
                  }          
                    ">
                    {{ c.name }}
                  </span>
                </template>
                <template v-else>
                  <span class="chara-name ml-1" 
                  :style="{
                    'background-color': c.getBgColorForView(),
                    'color': c.fontColor,
                    'border': CONSTANTS.SCRIPT_BORDER_STYLE_PREFIX + c.getBorderColorForView(),              
                  }          
                    ">
                    {{ c.name }}
                  </span>
                </template>

                <!-- 性別 -->            
                <div
                  :class="{
                    'ml-3': useDisplay().smAndDown.value,
                    'ml-6': !useDisplay().smAndDown.value,                    
                  }"
                  >
                  <div class="chara-sex-icon pt-1">
                    <script-icon-man-min v-if="c.isMan()" />
                    <script-icon-woman-min v-if="c.isWoman()" />
                    <script-icon-etc-min v-if="c.isEtc()" />
                  </div>
                </div>
                <div class="chara-sex-explain mr-3">
                  <span :class="{
                    'text-blue-lighten-1': c.isMan(),
                    'text-pink-lighten-2': c.isWoman(),                    
                    'text-green': c.isEtc(),     
                    }">
                    {{ c.getSexTxtForDetail() }}
                  </span>                   
                </div>                
              </div>

              <!-- セリフ数PC -->
              <template v-if="useDisplay().smAndUp.value">
                <span class="word-count-chip mr-2 ml-2">台詞数 {{ getWordCount(c.name) }}</span>
              </template>

              <div class="text-body-1">
                <div 
                  :class="{
                    'chara-description': true,
                    'pr-8': true,
                    'pl-1': true,
                    'ml-0': useDisplay().mobile.value,                  
                    'ml-3': !useDisplay().mobile.value,
                  }"

                  :style="{
                    'font-size': useUserSettingStore().cookieSavedScriptTextFontSizeRate + '%'
                  }"                     
                  >
                  {{ c.description }}
                </div>
              </div>

              <template v-if="!useDisplay().smAndUp.value">                
                <div class="mobile-word-count-container">
<!--                  <span class="mr-2" color="">（セリフ数：{{ getWordCount(c.name) }}）</span>-->
                  <span class="mobile-word-count-chip mr-2">セリフ数 {{ getWordCount(c.name) }}</span>
                </div>
              </template>
            </div>     
          </v-col>
        </v-row>
        <v-divider />               
      </template>
    </v-col>
  </v-row>

    <v-row>
      <v-spacer></v-spacer>
    </v-row>
  <!--</div>-->
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->

<style lang="scss" scoped>

/*
h3 {
  font-size: 90%;
}*/

h4 {
  font-size: 90%;
}

h5 {
  font-size: 75%;
}

/** キャラクター一覧、本文共通 キャラ名 */
.chara-name {
  display: inline-block;
  //width: 70px;
  //min-width: 70px;
  width: $chara-width; //60px;
  min-width: $chara-width; //60px;  

  margin-left: 0px;
  padding: 2px;
  font-size: small;
  border-radius: 4px;
  text-align: center;
  border: solid 1px #b1b1b1;
  background-color: #f0f0f0;
  opacity: $character-opacity;
}

/** 役一覧 */
#chara-list {
  border-top: solid 0px #CCCCCC;
}

.chara-list-item {
  position: relative;
  //font-size: small;
  border-top: solid 0px #CCCCCC;
}

.chara-list-item .chara-sex {
  display: block;
  width: 60px;
  color: #333333;
  font-size: small;
}

.chara-list-item .chara-name-container {
  display: flex;
  align-items: center;
  height: 100%;
  border: solid 0px #999999;
}

.chara-list-item .chara-description {
  position: relative;
  width: 100%;
  line-height: 180%;
  border: solid 0px #999999;
}

.chara-list-item .word-count {
  color: #6f6f6f;
  font-size: 90%;
  margin-left: 10px;
  //border: solid 0px #77c1ba;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .chara-list-item .word-count {
    position: absolute;
    display: block;
    right: 20px;
    bottom: 12px;
    //text-align: right;
    font-size: small;
  }
}


.word-count-row {
  position: relative;
  height: 30px;
}

.chara-container {
  width: 100%;
  display: flex;
  /* Flexboxを使用 */
  align-items: center;
  border: solid 0px #999999;
}

.chara-container:hover {
  cursor: pointer;
}

.chara-sex-icon {
  display: block;
  border: solid 0px #999999;
  height: fit-content;
}

.chara-sex-explain {
  display: block;
  border: solid 0px #999999;
  height: fit-content;
  width: 30px;
  font-size: small;
}

.chara-sex .sub-explain {
  font-size: 70%;
  color: #999999;
}

.word-count-chip {
  display: inline-block;
  min-width: 90px;
  color: #474747;
  padding: 0px;
  border: solid 1px #d1d1d1;
  background-color: #f9f9f9 !important;
  border-radius: 24px;
  text-align: center;
  font-size: 80%;
}

.mobile-word-count-container {
  position: absolute;
  display: block;
  right: 32px;
  bottom: 18px;
  //text-align: right;
  font-size: small;
}

.mobile-word-count-chip {
  display: inline-block;
  min-width: 80px;
  color: #454545;
  padding: 2px;
  border: solid 1px #BBBBBB;
  //background-color: #f9f9f9 !important;
  border-radius: 4px;
  text-align: center;
  font-size: 80%;
}


/** 透明度を上げる */
.has-opacity {
  opacity: 1;
}

/* 選択されたキャラ */
.selected {
  background-color: #f0f8fc;
}
</style>
