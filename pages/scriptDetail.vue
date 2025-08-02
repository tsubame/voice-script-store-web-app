<script lang='ts' setup>

//======================================================
//
// scriptDetail.vue 
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import * as CONSTANTS from '@/composables/etc/constants'
import { useLoginUserStore } from '@/store/loginUserStore'
import { useScriptStore } from '@/store/scriptStore'
import { useAccessTokenStore } from '@/store/accessTokenStore'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as loginManager from '@/composables/util/loginManager'
import * as scriptTextManager from '@/composables/util/scriptTextManager'
import User from '@/composables/type/user'
import Script from '@/composables/type/script'

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({
  middleware: ["login-checker"]
})

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({})

// emit
const emits = defineEmits()

//======================================================
// computed
//======================================================

// 説明文を開く、閉じるボタンのテキスト
const descriptionOpenCloseButtonText = computed(() => {
  return _showAllDescription.value ? CONSTANTS.SCRIPT_DETAIL_CLOSE_DESCRIPTION_BTN_TXT : CONSTANTS.SCRIPT_DETAIL_OPEN_DESCRIPTION_BTN_TXT
})

//======================================================
// vars
//======================================================  

// 対象台本
const _targetScript = ref<Script>(new Script())

// 説明文を全文表示するか
const _showAllDescription = ref(false)

// タブインデックス
const _selectedTabIndex = ref(0)

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {
    console.log('scriptDetail onMounted')

    // 台本が空ならセット
    if (_targetScript.value.id == 0) {
      // URLクエリパラメータのsidの値を取得
      const sid = Number(useRoute().query.sid)
      if (sid !== 0) {
        // 対象台本を取得
        useScriptStore().targetScript = await phpApiManager.useGetReadScript(sid)

        _targetScript.value = useScriptStore().targetScript
      }
    }
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 詳細表示閉じる、開くボタンクリック
 */
const onClickDescriptionOpenCloseButton = () => {
  try {
    _showAllDescription.value = !_showAllDescription.value
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
  <div id="script-detail-container">
    <div id="header" class="my-0"
    :style="{ backgroundImage: `url('${_targetScript.getBgIllustImageUrlWithAppBaseUrl()}')` }"
    >
    </div>
    <v-card class="px-6 py-6">
      <v-row>
        <v-col id="titles-container">
          <h3 id="title">
            『{{ useScriptStore().targetScript.title }}』
          </h3>

          <div id="fav-button-container">
            <script-like-button-sample />   
          </div>               
        </v-col>
      </v-row>

      <v-row class="my-0 pt-5">
        <v-col cols="12" class="my-0 py-0">
          <div id="profile-container" class="d-flex">
            <div id="profile-icon-container">
              <template v-if="_targetScript.authorUser.profileImageUrl != ''">
                <v-img id="profile-icon" :src="_targetScript.authorUser.profileImageUrl" />
              </template>
              <template v-else>
                <v-img id="profile-icon" :src="useRuntimeConfig().public.APP_BASE_URL + CONSTANTS.DEFAULT_USER_ICON_PATH" />
              </template>
            </div>
            <span id="profile-name" class="text-body-2 ml-2">tanaka</span>
          </div>
        </v-col>        
      </v-row>
      <v-row>
        <v-col class="mt-0 pt-0">
          <p class="text-body-2">
            <span>
              {{ _targetScript.actorCount }}人用台本
              <template v-if="_targetScript.hasDualRole">
                （兼役あり）
              </template>
            </span>
            <span class="ml-2">
               {{ _targetScript.minutes }}分
            </span>
          </p>
        </v-col>
      </v-row>      

      <!-- タグ -->
      <v-row class="my-0 py-0">
        <v-col>     
          <!-- カテゴリ -->
          <v-chip 
            class="mr-2 tag-chip" 
            color="orange-darken-4"
            density="comfortable" size="small" 
             >{{ useScriptStore().targetScript.category }}
          </v-chip>
          
          <!-- R18 -->
          <template v-if="_targetScript.isR18Script()">
            <v-chip class="mr-1" density="comfortable" size="small" color="red">R18</v-chip>        
          </template>

          <!-- その他タグ -->
          <v-chip 
            class="mr-2 tag-chip" 
            color="blue"
            density="comfortable" size="small" 
            >吸血鬼
          </v-chip>
        </v-col>
      </v-row>      

      <v-row class="my-0">
        <v-col>          
          <p class="text-right text-caption text-grey">
            <span class="ml-2"><v-icon class="mr-1 h-icon text-grey-lighten-1 text-body-2">mdi-account</v-icon>{{ _targetScript.watchCount }} views</span>
            
            <span class="ml-4"><v-icon class="mr-1 h-icon text-grey-lighten-1 text-body-2">mdi-pencil</v-icon>{{ _targetScript.getPostedAtTxtForScriptDetail() }}</span>        
          </p>      
          <v-divider class="mt-6"></v-divider>    
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" class="my-0 py-0">               
          <h5><v-icon class="h-icon" color="teal-lighten-3">mdi-script</v-icon>利用規約</h5>  
          <p class="mt-4 mb-6 text-body-2">{{ _targetScript.reusable }}</p>    
          <v-divider />    
        </v-col>
      </v-row>

      <v-row class="mb-0">
        <v-col cols="12" class="my-0 py-2">               
          <h5><v-icon class="h-icon" color="teal-lighten-3">mdi-script</v-icon>説明</h5>  
        </v-col>
        <v-col cols="12" id="description-container" class="mt-2 py-0 text-body-2">
          <p v-if="_showAllDescription">
            {{ _targetScript?.description }}
          </p>

          <p v-if="!_showAllDescription">
            {{ _targetScript?.getShortDescription() }}
          </p>

          <p class="text-right mt-2">
            &nbsp;

            <v-btn v-if="_targetScript?.checkHasToShowDescriptionOpenCloseButton()" 
              id="description-close-open-button"
              class="text-caption"
              @click="onClickDescriptionOpenCloseButton" flat rounded>
              {{ descriptionOpenCloseButtonText }}
            </v-btn>
          </p>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mt-8 mb-8 px-6 pb-0">
      <v-row class="my-2">
        <v-col cols="12" class="mt-2 mb-4">
          <h4><v-icon class="h-icon" color="teal-lighten-3">mdi-account</v-icon>登場人物</h4>
        </v-col>
        <v-col cols="12" class="px-0 py-0 mx-0">
          <v-row v-for="(c, i) in _targetScript?.charactors" :key="i" class="chara-list-item mb-0 mt-0">
             <v-divider />
            <v-col cols="12" class="ml-1 chara-container">

              <div class="chara-sex-icon text-caption pt-1 pl-0">
                <script-icon-man v-if="c.isMan()" />
                <script-icon-woman v-if="c.isWoman()" />
                <script-icon-etc v-if="c.isEtc()" />
              </div>

              <div class="chara-sex-explain">{{ c.getSexTxtForDetail() }}</div>

              <div class="chara-name-container px-2">
                <span :class="{ 'chara-name': true }" 
                  :style="{
                    'background-color': c.bgColor,
                    'color': c.fontColor,
                    'border': CONSTANTS.SCRIPT_BORDER_STYLE_PREFIX + scriptTextManager.getRgbaAndAddOpacityWhenBrightColor(c.borderColor, 0.3)
                  }         
                  ">
                  {{ c.name }}
                </span>


              </div>
              <div class="chara-description pr-4 pl-4">
                {{ c.description }}
                <span class="word-count mr-4" color="">（セリフ数：{{ _targetScript.getTargetCharaWordCount(c.name) }}）</span>

              </div>
            </v-col>

          </v-row>
        </v-col>        
      </v-row>
    </v-card>

    <v-row>
      <v-col class="text-right">
        <v-btn color="success" rounded>台本を縦書きで表示</v-btn>
      </v-col>
    </v-row>

    <v-card class="mb-10 mt-12 px-0 pb-10">
      <!-- タブ見出し -->
      <v-card class="mb-10">
        <v-tabs class="mb-0 mt-0" v-model="_selectedTabIndex" bg-color="" color="" align-tabs="center">
          <v-tab  
            :class="{ 'equal-width-tab': useDisplay().mobile.value, 'not-equal-width-tab': !useDisplay().mobile.value }" 
            :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY">本文</v-tab>

          <template v-if="!useScriptStore().isScriptPostingOrEditting">              
            <v-tab 
              :class="{ 'equal-width-tab': useDisplay().mobile.value, 'not-equal-width-tab': !useDisplay().mobile.value }" 
              :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_COMMENT">コメント
              <template v-if="_targetScript.commentCount != 0">
                <v-chip class="text-caption ml-2 comment-chip" color="green" density="compact" size="small" >
                  <!-- <v-icon color="green-lighten-3" class="h-icon">mdi-comment</v-icon> --> 
                  {{ _targetScript.commentCount }}
                </v-chip>
              </template>
            </v-tab>
            <v-tab  
              :class="{ 'equal-width-tab': useDisplay().mobile.value, 'not-equal-width-tab': !useDisplay().mobile.value }" 
              :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT">作者の他作品</v-tab>
          </template> 
        </v-tabs>
      </v-card>
    
      <!-- タブ要素 -->
      <v-window v-model="_selectedTabIndex" :touch="false">
        <!-- 本文 -->
        <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY" :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_BODY">
          <script-detail-container-script-body-sample :words="_targetScript?.words"
            @onClickWordItem="onClickWordItem" />
        </v-window-item>

        <!-- 編集中でなければ表示 -->
        <template v-if="!useScriptStore().isScriptPostingOrEditting">
          <!-- コメント -->
          <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_COMMENT"  :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_SCRIPT_COMMENT">
            <script-detail-container-comment-tab-item :targetScript="_targetScript" />
          </v-window-item>

          <!-- 作者の他作品 -->
          <v-window-item :key="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT" :value="CONSTANTS.SCRIPT_DETAIL_TAB_INDEX_OTHER_SCRIPT">

          </v-window-item>
        </template>
      </v-window>    
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
<style lang='scss' scoped>

#script-detail-container {
  max-width: $content-max-width;
  margin: 0 auto;
}

#header {
  height: 120px;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  //background-image: url("./img/bg/love-m.jpg");
  /** 半透明の黒に */
  background-color: white;
  //background-color: rgba(0, 0, 0, 0.5);
}

h4 {
  font-size: 85%;
}

h5 {
  font-size: 75%;
}

.h-icon {
  top: -1px;
  margin-right: 4px;
  font-size: 100%;  
}

.v-card {
  //border: solid 1px #d7d7d7;
}

#titles-container {
  position: relative;
  border: solid 0px #999999;
}

#title {
  margin-right: 40px;
}

#fav-button-container {
  position: absolute;
  top: 0px;
  right: 4px;
}

#profile-container {
  position: relative;
  height: 30px;
}

#profile-icon {
  //position: absolute;  
  top: 0px;
  left: 0px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

#profile-name {
  //position: absolute;
  line-height: 24px;
}

.tag-chip {
  font-size: 65% !important;
}

#description-container {
 // 改行を反映
  white-space: pre-wrap; 
}

/** キャラクター一覧、本文共通 キャラ名 */
.chara-name {
  display: inline-block;
  width: 70px;
  min-width: 70px;
  margin-left: 4px;
  padding: 2px;
  font-size: small;
  border-radius: 4px;
  text-align: center;
  border: solid 0px #999999;
  background-color: #f0f0f0;
}

/** 役一覧 */
#chara-list {
  border-top: solid 0px #CCCCCC;
}

.chara-list-item {
  font-size: small;
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
    display: block;
    margin-left: 0px;
    margin-top: 8px;
    text-align: right;
  }
}

.word-count-row {
  position: relative;
  height: 30px;
}

.word-count-chip {
  position: absolute;
  right: 0px;
  font-size: 50%;
  height: 20px;
  border: solid 1px #c5c5c5;
  border-radius: 0px;
}

.chara-container {
  display: flex;
  /* Flexboxを使用 */
  align-items: center;
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
  width: 40px;
  font-size: 90%;
}

.chara-sex .sub-explain {
  font-size: 70%;
  color: #999999;
}

.not-equal-width-tab  {
  width: 140px;
}

.equal-width-tab {
  flex: 1 1 0; /* 各タブを均等に広げる */
  text-align: center; /* テキストを中央揃え */
}

.h-icon {
  top: 1px;
  margin-right: 4px;
  font-size: 80%;
}

.comment-chip {
  font-size: 70% !important;
}


</style>