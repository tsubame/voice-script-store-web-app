<script lang="ts" setup>
//======================================================
//
// userDetail.vue ユーザページ
//
//======================================================

import { reactive, onMounted, nextTick, watch, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import SearchCondition from '@/composables/type/searchCondition'

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({
  middleware: ["login-checker"]
})

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

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <div id="container" class="px-0">
    <v-card id="card-container" class="pb-12 mt-0 mb-12">
      <header id="header"></header>

      <h5 class="mt-6 px-4 mb-0">
        <v-icon class="mr-2 ml-2 mb-1" color="success">mdi-pen</v-icon>台本検索
        <v-divider class="mt-2" />
      </h5>

      <v-card-text>
        <v-container class="pl-6 pr-6">
            <v-row class="my-4">
              <v-col cols="1">
                <v-icon color="green-lighten-3" class="row-icon">mdi-book-open-page-variant</v-icon>
              </v-col>
              <v-col cols="11" class="row-col">
                <v-select 
                  label="カテゴリ" 
                  :class="{ 'inputted': _formVals.targetCategory != '' }"
                  v-model="_formVals.targetCategory" 
                  :items="CONSTANTS.SEARCH_FORM_VALS_CATEGORIES"
                  variant="outlined"
                  density="compact"
                  hide-details
                  />
              </v-col>
            </v-row>
            <v-row class="my-4">
              <v-col cols="1">
                <v-icon color="blue-lighten-3" class="row-icon">mdi-human-male</v-icon>
              </v-col>
              <v-col cols="11" class="row-col">
                <v-select 
                label="男性演者" 
                  :class="{ 'inputted': _formVals.targetManCount != '' }"                
                v-model="_formVals.targetManCount" 
                :items="CONSTANTS.SEARCH_FORM_VALS_MAN_COUNTS"
                variant="outlined"
                density="compact"
                hide-details
                />
              </v-col>
            </v-row>
            <v-row class="my-4">
              <v-col cols="1">
                <v-icon color="pink-lighten-3" class="row-icon">mdi-human-female</v-icon>
              </v-col>
              <v-col cols="11" class="row-col">
                <v-select 
                label="女性演者" 
                :class="{ 'inputted': _formVals.targetWomanCount != '' }"                     
                v-model="_formVals.targetWomanCount"
                :items="CONSTANTS.SEARCH_FORM_VALS_WOMAN_COUNTS"
                variant="outlined"
                density="compact"
                hide-details
                />                
              </v-col>
            </v-row>
            <v-row class="my-4">
              <v-col cols="1">
                <v-icon color="orange-lighten-3" class="row-icon">mdi-clock-time-four-outline</v-icon>
              </v-col>
              <v-col cols="7" class="row-col minutes">
                <v-select 
                label="時間" 
                :class="{ 'inputted': _formVals.targetBaseMinutesTxt != '' }"                     
                v-model="_formVals.targetBaseMinutesTxt" 
                :items="CONSTANTS.SEARCH_FORM_VALS_MINUTES"
                variant="outlined"              
                density="compact"
                hide-details
                />                           
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="4" class="row-col aboveBellow">
                <v-select 
                  label="以上、以下" 
                  :class="{ 'inputted': _formVals.targetAboveBelow != '' }"                      
                  v-model="_formVals.targetAboveBelow"
                  :items="CONSTANTS.SEARCH_FORM_VALS_ABOVE_BELOW"
                  variant="outlined"                
                  density="compact"
                  hide-details
                />             
              </v-col>
            </v-row>
            <v-row class="my-4">
              <v-col cols="1">
                <v-icon color="teal-lighten-4" class="row-icon">mdi-account-circle</v-icon>
              </v-col>
              <!-- 作者名 -->
              <v-col cols="11" class="row-col">
                <v-combobox 
                v-model="_formVals.targetAuthorName" 
                :class="{ 'inputted': _formVals.targetAuthorName != '' }"                       
                label="作者" 
                :items="useScriptStore().authorNames"
                variant="outlined"                
                density="compact"
                hide-details
                />    
              </v-col>
            </v-row>

            <!-- 検索ワード -->
            <v-row class="mt-4">
              <v-col cols="1">
                <v-icon color="grey" class="row-icon">mdi-text-search</v-icon>
              </v-col>
              <v-col cols="11" class="row-col">
                <!-- テキストボックス -->
                <v-text-field 
                label="検索ワード" 
                :class="{ 'inputted': _formVals.targetSearchWord != '' }"                
                v-model="_formVals.targetSearchWord" 
                placeholder="検索ワードを入力"
                variant="outlined"                
                density="compact"
                hide-details
                />    
              </v-col>
            </v-row>

            <!-- 本文検索 -->
            <v-row class="mt-1" justify="end">
              <v-spacer></v-spacer>
              <v-col cols="8" class="py-0 d-flex flex-row justify-end">                  
                <v-checkbox 
                  v-model="_formVals.includeScriptBody"
                  label="本文も含めて検索" 
                  color="success"
                  :disabled="_formVals.targetSearchWord == ''"
                  hide-details                  
                  />
              </v-col>   
            </v-row>

            <v-row justify="center" class="mt-4">
              <v-spacer></v-spacer>
              <!-- 検索ボタン -->
              <v-btn id="search-button" color="success" prepend-icon="mdi-magnify" elevation="2">
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
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

#header {
  height: 100px;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  //background-image: url('./img/bg/fantasy-m.jpg');
  background-image: url('./img/bg/bluesky-glassland-m.jpg');  
}

#container {
  margin: auto;
  //height: 100%;
  max-width: $content-max-width;
}

.v-card {
  height: 10000px;
}

.row-col {
  padding: 0;
  border: solid 0px #999999;
}

.row-icon {
  position: relative;
  left: -20px;
  border: solid 0px #999999;
  text-align: left;
}

.v-select {
  background-color: #f0f3f6;
}

.v-text-field {
  background-color: #f0f3f6;
}

.inputted {
  background-color: #FFFFFF !important;
}

.actorManCount {
  padding-right: 4px;
  font-size: 10%;
}

.actorWomanCount {
  padding-left: 4px;
}

.minutes {
  padding-right: 4px;
}

.aboveBellow {
  padding-left: 4px;
}

#search-button {
  width: 100%;
  max-width: 300px;
  height: 60px;
  margin: 0.5em 2em 2em;
  vertical-align: middle;
  color: #FFFFFF;
  font-size: large;
  font-weight: bold;
}

</style>
