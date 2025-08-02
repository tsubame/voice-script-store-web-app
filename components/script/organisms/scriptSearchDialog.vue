<script lang="ts" setup>
//======================================================
//
// scriptSearchDialog.vue 台本検索用ダイアログ
//
//======================================================

import { reactive, onMounted, nextTick, watch, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import SearchCondition from '@/composables/type/searchCondition'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  authorNames: Array<String>,
})

// emits
const emits = defineEmits(
  ["clickSearchButton"]
)

//======================================================
// vars
//======================================================

// フォームの値
const _formVals = reactive({
  // カテゴリ
  targetCategory: "",
  // 演者人数
  targetActorCount: "",
  // 男性人数
  targetManCount: "",
  // 女性人数
  targetWomanCount: "",
  // 時間
  targetBaseMinutesTxt: "",
  // 以上、以下
  targetAboveBelow: "",
  // 作者
  targetAuthorName: "",
  // 検索ワード
  targetSearchWord: "",
  // 本文も含めて検索するか
  includeScriptBody: false,
})

// 検索条件
let _searchCondition = new SearchCondition()

//======================================================
// onMounted
//======================================================

/**
 * イベント onMounted
 */
onMounted(async () => {
  try {
    //console.log("[onMounted] ScriptSearchDialog")
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * 検索ボタンクリック
 *   ・検索条件をセット
 *   ・台本検索実行
 */
const onSearchButtonClick = async() => {
  try {
    console.log("[検索条件]")
    _searchCondition = new SearchCondition()
    _searchCondition.category = _formVals.targetCategory
    if (_searchCondition.category == CONSTANTS.CATEGORY_ALL) {
      _searchCondition.category = ""
    }

    // 男性人数、女性人数をセット
    _searchCondition.actorCount = getCountFromTxt(_formVals.targetActorCount)
    _searchCondition.actorManCount = getCountFromTxt(_formVals.targetManCount)
    _searchCondition.actorWomanCount = getCountFromTxt(_formVals.targetWomanCount)

    // 男女比率から人数をセット
    if (_searchCondition.actorCount == 0) {
      _searchCondition.actorCount = _searchCondition.actorManCount + _searchCondition.actorWomanCount
    }

    // 時間をセット
    setSearchConditionMinutesVals()
    _searchCondition.authorName = _formVals.targetAuthorName
    _searchCondition.searchWord = _formVals.targetSearchWord
    console.log(_searchCondition)

    // 本文も含めて検索するかをセット
    if (_formVals.targetSearchWord !== '' && _formVals.includeScriptBody) {
      _searchCondition.includeScriptBody = true
    }

    // storeの台本情報をクリア
    useScriptStore().clearScriptVals()

    useScriptStore().searchCondition = _searchCondition

    // 検索バーのテキストをセット
    useUiEventStore().uiEvent.searchBarText = _searchCondition.getSearchBarText()

    // ローディングアイコンを表示
    useUiEventStore().uiEvent.isScriptLoadingIconShowing = true
    
    // トップページに遷移
    useUiEventStore().uiEvent.headerTabIndex = 0
    navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS + "?" + CONSTANTS.URL_QUERY_KEY_SEARCH + "=" + CONSTANTS.URL_QUERY_VAL_TRUE)

    useUiEventStore().uiEvent.isSearchButtonClicked = true    
    useUiEventStore().uiEvent.isSearchDialogShowing = false    
  } catch (error) {
    console.error(error);
  }
}

/**
 * "1人"の文字列を1に変換して返す
 * 
 * @returns {number}
 */
function getCountFromTxt(txt: string): number {
  try {
    if (txt == "") {
      return 0
    }

    // 正規表現で数字を取り出す
    const regex = new RegExp('[0-9]+')
    const result = txt.match(regex)
    if (result == null) {
      return 0
    }

    return parseInt(result[0])
  } catch (error) {
    console.error(error)
  }

  return 0
}

/**
 * 検索条件の時間をセット
 */
function setSearchConditionMinutesVals() {
  let results: number[] = []

  try {
    _searchCondition.maxMinutes = 0
    _searchCondition.minMinutes = 0

    // 未選択なら終了
    if (_formVals.targetBaseMinutesTxt == "") {
      _searchCondition.minutesVals = results

      return
    }

    // 基準の分数をセット
    const mTxt: string = _formVals.targetBaseMinutesTxt
    const regex = new RegExp('^[0-9]+')
    const rmTxt = mTxt.match(regex)
    const targetBaseMin = parseInt(rmTxt![0])
    // 検索条件に基準の時間をセット
    _searchCondition.targetBaseMinutes = targetBaseMin
    // 最大、最小時間の値をセット
    _searchCondition.maxMinutes = targetBaseMin
    _searchCondition.minMinutes = targetBaseMin

    // 以上、以下がない場合、そのままセット
    if (_formVals.targetAboveBelow == "") {
      return
    }

    // 以上、以下をセット
    _searchCondition.targetBaseMinutesAboveBelow = _formVals.targetAboveBelow

    // 以上の場合
    if (_formVals.targetAboveBelow == CONSTANTS.ABOVE_BELOW_ABOVE) {
      _searchCondition.maxMinutes = 9999
    }
    // 以下の場合
    if (_formVals.targetAboveBelow == CONSTANTS.ABOVE_BELOW_BELOW) {
      _searchCondition.minMinutes = 0
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * OKボタンクリック
 *   ・emit実行
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isSearchDialogShowing = false        
  } catch (error) {
    console.error(error);
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
  <v-dialog 
    v-model="useUiEventStore().uiEvent.isSearchDialogShowing" 
    :fullscreen="useDisplay().smAndDown.value" 
    max-width="750px">
    <div id='outer-container'>
      <v-card id="inner-container">
        <!-- タイトル -->
        <v-card-title id="title" class="mb-2 text-left px-2">
          <v-icon color="teal" class="title-icon text-h5">mdi-magnify</v-icon>         
          <span class="title-text text-body-2 font-weight-bold">台本検索</span>

          <!-- 閉じるボタン -->
          <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="text-left px-3">
          <v-container class="pl-6 pr-6">
            <v-row class="my-2">
              <v-col cols="12" class="row-col ">
                <h5 class="mb-2">カテゴリ</h5>

                <!-- PC -->
                <template v-if="true">
                  <v-select 
                    class="bg-white"         
                    v-model="_formVals.targetCategory" 
                    :items="CONSTANTS.SEARCH_FORM_VALS_CATEGORIES"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                </template>
                <!-- モバイル-->
                <template v-else>
                  <select
                    v-model="_formVals.targetCategory" 
                    >
                    <template v-for="val in CONSTANTS.SEARCH_FORM_VALS_CATEGORIES">
                      <option :value="val">{{ val }}</option>
                    </template>
                  </select>
                </template>
              </v-col>
            </v-row>

            <!-- 演者比率 -->
            <v-row class="my-2">
              <v-col cols="6" class="row-col">
                <h5 class="mb-2">演者比率</h5>                

                <!-- PC -->
                <template v-if="true">
                  <v-select 
                    class="bg-white"                     
                    v-model="_formVals.targetManCount" 
                    :items="CONSTANTS.SEARCH_FORM_VALS_MAN_COUNTS"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    >
                    <template v-slot:prepend-inner>
                      <v-icon color="blue-lighten-1 text-h6 mr-2 pt-1">mdi-gender-male</v-icon>
                    </template>
                  </v-select>
                </template>
                <!-- モバイル-->
                <template v-else>
                  <div class="man-woman-select-container">
                    <select
                      v-model="_formVals.targetManCount" 
                      class="pl-10"
                      >
                      <template v-for="val in CONSTANTS.SEARCH_FORM_VALS_MAN_COUNTS">
                        <option :value="val">{{ val }}</option>
                      </template>
                    </select>
                    <v-icon class="actor-icon" color="blue-lighten-1">mdi-gender-male</v-icon>
                  </div>
                </template>
              </v-col>

              <v-col cols="6" class="row-col">
                <h5 class="mb-2">　</h5>   
              
                <!-- PC -->
                <template v-if="true">                  
                    <v-select 
                      class="bg-white"                         
                      v-model="_formVals.targetWomanCount"
                      :items="CONSTANTS.SEARCH_FORM_VALS_WOMAN_COUNTS"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    >
                    <template v-slot:prepend-inner>
                      <v-icon color="red-lighten-2 text-h6 mr-2 pt-1">mdi-gender-female</v-icon>
                    </template>
                  </v-select>  
                </template>
                <!-- モバイル-->
                <template v-else>
                  <div class="man-woman-select-container">
                    <select
                      v-model="_formVals.targetWomanCount" 
                      class="pl-10"                      
                      >
                      <template v-for="val in CONSTANTS.SEARCH_FORM_VALS_WOMAN_COUNTS">
                        <option :value="val">{{ val }}</option>
                      </template>
                    </select>
                    <v-icon class="actor-icon" color="red-lighten-2">mdi-gender-female</v-icon>
                  </div>
                </template>              
              </v-col>
            </v-row>

            <!-- 時間 -->
            <v-row class="my-2">
              <v-col cols="8" class="row-col minutes">
                <h5 class="mb-2">時間</h5>                     

                <!-- PC -->
                <template v-if="true">
                  <v-select 
                    class="bg-white"                      
                    v-model="_formVals.targetBaseMinutesTxt" 
                    :items="CONSTANTS.SEARCH_FORM_VALS_MINUTES"
                    variant="outlined"              
                    density="comfortable"
                    hide-details
                    />
                </template>
                <!-- モバイル-->
                <template v-else>
                  <select
                    v-model="_formVals.targetBaseMinutesTxt" 
                    >
                    <template v-for="val in CONSTANTS.SEARCH_FORM_VALS_MINUTES">
                      <option :value="val">{{ val }}</option>
                    </template>
                  </select>
                </template>

              </v-col>
              <v-col cols="4" class="row-col aboveBellow">
                <h5 class="mb-2">　</h5>                     
                <v-select 
                  label="以上、以下" 
                  class="bg-white"                           
                  v-model="_formVals.targetAboveBelow"
                  :items="CONSTANTS.SEARCH_FORM_VALS_ABOVE_BELOW"
                  variant="outlined"                
                  density="comfortable"
                  hide-details
                />             
              </v-col>
            </v-row>
            <v-row class="my-2">
              <!-- 作者名 -->
              <v-col cols="12" class="row-col">
                <h5 class="mb-2">作者</h5>                  
                
                <!-- PCはコンボボックス -->
                <template v-if="!useDisplay().mobile.value">
                  <v-combobox 
                    v-model="_formVals.targetAuthorName" 
                    class="bg-white"                 
                    :items="useScriptStore().authorNames"
                    variant="outlined"                
                    density="comfortable"
                    hide-details
                    >
                  </v-combobox>
                </template>
                <!-- モバイルはSelect -->
                <template v-else>
                  <select
                    id="author-name-select"
                      v-model="_formVals.targetAuthorName" 
                      >
                      <template v-for="val in useScriptStore().authorNames">
                        <option :value="val">{{ val }}</option>
                      </template>
                    </select>                  
                </template>

              </v-col>
            </v-row>

            <!-- 検索ワード -->
            <v-row class="mt-2">
              <v-col cols="12" class="row-col">
                <h5 class="mb-2">検索ワード</h5>    

                <!-- PC -->
                <template v-if="true">
                  <!-- テキストボックス -->
                  <v-text-field 
                    class="bg-white"         
                    v-model="_formVals.targetSearchWord" 
                    @keyup.enter="onSearchButtonClick"
                    placeholder="検索ワードを入力"
                    variant="outlined"                
                    density="comfortable"
                    hide-details
                    />
                </template>
                <!-- モバイルはSelect -->
                <template v-else>
                  <input 
                    v-model="_formVals.targetSearchWord" 
                    @keyup.enter="onSearchButtonClick"
                    placeholder="検索ワードを入力"
                    />              
                </template>                  

              </v-col>
            </v-row>

            <!-- 本文検索 -->
            <v-row class="mt-4" justify="end">
              <v-spacer></v-spacer>
              <v-col cols="8" class="text-right py-0 d-flex flex-row justify-end text-caption">                  
                <v-checkbox 
                  v-model="_formVals.includeScriptBody"
                  label="本文も含めて検索" 
                  
                  color="success"
                  density="comfortable"                  
                  hide-details                  
                  />
              </v-col>   
            </v-row>

            <v-row justify="center" class="mt-6 mb-8 px-2">
              <v-spacer></v-spacer>
              <!-- 検索ボタン -->
              <v-btn id="search-button" 
                color="teal" 
                prepend-icon="mdi-magnify" 
                elevation="2" 
                @click="onSearchButtonClick"
                >
                <template v-slot:prepend>
                  <v-icon></v-icon>
                </template>
                検索
              </v-btn>
              <v-spacer></v-spacer>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </div>    
  </v-dialog>

</template>

<!--
//======================================================
//
// SCSS
// 
//======================================================
-->
<style lang="scss" scoped>

#outer-container {
  height: 100%;

  padding: 0px;

  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow-y: auto;
  z-index: 10;
  opacity: 1;
}

#inner-container {
  position: relative;  
  height: 100%;
  // iOS対応
  padding-top: calc(env(safe-area-inset-top) + 4px); 

  background-color: $bg-orange-color;
  overflow-y: auto;  
}

#title {
  position: relative;
  width: 90%;
  height: 50px;
  margin: auto;
  border-bottom: solid 1px #CCCCCC;
  //border: solid 1px #999999;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  //top: calc(env(safe-area-inset-top) + 10px);   
  top: -0px;
  right: -10px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.title-icon {
  top: -2px;
}

.title-text {
  position: absolute;
  top: 15px;
  left: 36px;
  border: solid 0px #999999;
  font-size: small;
}

.v-card-text {
  max-width: 550px;
  margin: auto;
}

.row-col {
  padding: 4px 10px;
  border: solid 0px #999999;
}

.row-icon {
  position: relative;
  left: -20px;
  border: solid 0px #999999;
  text-align: left;
}

h5 {
  font-size: 100%;
}

.select-container {
  position: relative;
  display: inline-block;
  width: 150px; /* 必要に応じて調整 */
}

select {
  width: 100%;
  padding-left: 20px;
  padding-right: 30px; 
  appearance: none; 
  background: white $select-arrow-icon-url no-repeat right 10px center;
  border: 1px solid #8e8e8e;
  border-radius: 4px; 
  height: 50px;
  font-size: 120%;
  cursor: pointer;
}
input {
  width: 100%;
  height: 50px;
  padding-left: 20px;
  padding-right: 30px; 
  appearance: none; 
  background: white;
  border: 1px solid #8e8e8e;
  border-radius: 4px; 
  font-size: 120%;  
  cursor: pointer
}

#author-name-select {
  color: black;
}

.man-woman-select-container {
  position: relative;
}

.actor-icon {
  position: absolute;
  top: 14px;
  left: 10px;
  border: solid 0px #999999;
}


.actorManCount {
  padding-right: 4px;
  font-size: 10%;
}

#search-button {
  width: 100%;
  max-width: 400px;
  height: 60px;
  vertical-align: middle;
  color: #FFFFFF;
  font-size: large;
  font-weight: bold;
}


</style>