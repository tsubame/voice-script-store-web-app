<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerBasicInfo.vue 
// 台本概要
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue';
import { useDisplay } from 'vuetify'
import InfiniteLoading from "v3-infinite-loading";
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import * as scriptStore from '@/store/scriptStore'
import { useScriptStore } from '@/store/scriptStore'
import { useUserSettingStore } from '@/store/userSettingStore'
import * as scriptTextManger from '@/composables/util/scriptTextManager'
import Script from "@/composables/type/script"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  targetScript: Script,
})

//======================================================
// reactive vars
//======================================================

// 状態管理用 台本 store
const _scriptStore = scriptStore.useScriptStore()

// 状態管理用 ログインユーザ store
const _loginUserStore = loginUserStore.useLoginUserStore()

// ローディング状態管理用
const { $loading } = useNuxtApp()

// router
const _route = useRoute()

// モバイルデバイス判別用
const _display = useDisplay()

// 説明文を全文表示するか
const showAllDescription = ref(false)

// 説明文を開く、閉じるボタンのテキスト
const descriptionOpenCloseButtonText = computed(() => {
  return showAllDescription.value ? CONSTANTS.SCRIPT_DETAIL_CLOSE_DESCRIPTION_BTN_TXT : CONSTANTS.SCRIPT_DETAIL_OPEN_DESCRIPTION_BTN_TXT
})

//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(async () => {
  try {

  } catch (error) {
    console.error(error)
  }
})


//======================================================
// methods
//======================================================

/**
 * イベント プロフィールアイコンクリック
 */
const onAuthorProfileClick = () => {
  try {    
    console.log("onAuthorProfileClick")

    useUiEventStore().uiEvent.profileShowingTargetUserId = props.targetScript?.authorUser.id!
    useUiEventStore().uiEvent.isUserProfileDialogShowing = true
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント タグクリック
 * ・検索実行
 * 
 * @param tagTxt タグテキスト
 */
const onClickTagChip = (tagTxt: string) => {
  try {
    console.log("onClickTagChip")
    useScriptStore().clearSearchCondition()
    useScriptStore().searchCondition.tag = tagTxt
    const url = CONSTANTS.PAGE_NAME_SCRIPTS + "?" + CONSTANTS.URL_QUERY_KEY_SEARCH + "=" + CONSTANTS.URL_QUERY_VAL_TRUE
    // トップページに遷移
    navigateTo(url)
    useScriptStore().clearScriptVals()    
    useUiEventStore().uiEvent.searchBarText = tagTxt
    useUiEventStore().uiEvent.isSearchButtonClicked = true
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
  <!-- 概要-->
  <div id="basic-info" class="pt-2" >
    <div 
      :class="{
        'px-4': useDisplay().smAndDown.value,
        'px-5': !useDisplay().smAndDown.value,        
      }">
      
      <!-- タイトル -->
      <v-row class="mt-1 mb-0">
        <v-col class="mt-0 pt-0 pb-0 px-1">     
          <h3 class="title-container">
            『{{ props.targetScript?.title }}』        
            <!-- お気に入りボタン-->
            <div id="like-menu-buttons-container">
              <template v-if="!useScriptStore().isScriptPostingOrEditting">
                <template v-if="!CONSTANTS.USE_STAR_FOR_FAVORITE_ICON">
                  <script-like-heart-effect-button />                   
                </template>
                <template v-else>
                  <script-like-star-effect-button />
                </template>
              </template>
            </div>            
          </h3>
        </v-col> 
      </v-row>

      <div
        :class="{
          'px-1': true  
        }"
        >
        <!-- 作者プロフィール -->
        <v-row class="mt-1 mb-0">
          <v-col>
            <p id="author-profile-contianer">
              <div id="profile-image-container">
                <v-img id="progile-image" :src="props.targetScript?.authorUser.profileImageUrl" class="mr-3"
                  @click="onAuthorProfileClick"
                />
              </div>
              <span id="author-user-name"
                class="text-body-2 ml-3"
                @click="onAuthorProfileClick"
                >{{ props.targetScript?.authorUser.name }}</span>
            </p>
          </v-col>
        </v-row>

        <!-- 人数、時間 -->
        <v-row class="mt-1">
          <v-col class="pt-0 text-body-2">
            <p>
              <span class="mr-2">          
                {{ props.targetScript?.minutes }}分<span v-if="props.targetScript?.minutes == CONSTANTS.SCRIPT_MAX_MINUTES">{{CONSTANTS.SCRIPT_MAX_MINUTES_ADD_TXT }}</span>         
              </span>
            </p>
            <p class="mt-1">
              <span class="mr-4">
                {{ useScriptStore().targetScript.category }}
              </span>
            </p>
            <p class="mt-1">
              <span class="mr-4">
                {{ props.targetScript?.actorCount }}人用台本 
                <span class="ml-2"
                v-if="props.targetScript?.hasDualRole">兼役有</span>
              </span>
            </p>
          </v-col>
        </v-row>

        <!-- 利用規定 -->
        <v-row class="mt-4">
          <v-col class="pt-0 px-2">
            <p class="text-body-2">
              <script-policy-text :targetScript="props.targetScript" />
            </p>
          </v-col>
        </v-row>

        <!-- タグ -->
        <v-row class="mt-4 mb-0 py-0 text-right">
          <v-col>             
            <!-- R18 -->
            <template v-if="props.targetScript!.isR18Script()">
              <v-chip class="mr-2 mb-2" density="comfortable" size="small" :color="CONSTANTS.TAG_COLOR_R18" label>R18</v-chip>        
            </template>
          
            <!-- その他タグ -->
            <template 
              v-for="tag in props.targetScript!.getTagTxts()">
              <v-chip 
                class="mr-2 mb-2" 
                @click="onClickTagChip(tag)"
                color="blue"
                density="comfortable" size="small"    
                label             
                >{{ tag }}
              </v-chip>
            </template>
          </v-col>
        </v-row>         

        <!-- 日付、view数。編集中でなければ表示 -->
        <v-row class="my-0">
          <v-col class="pt-2 mr-1">          
            <template v-if="!useScriptStore().isScriptPostingOrEditting">          
              <p class="text-right text-caption text-grey-darken-4">
                <template v-if="useUserSettingStore().dbSavedUserSetting.showFavCountAndWatchCount">
                  <span class="ml-2">
                    <!--<v-icon class="mr-1 h-icon text-grey-lighten-1 text-body-2">mdi-account</v-icon>-->
                    {{ props.targetScript!.watchCount }} views</span>
                </template>

                <span class="ml-4">
                  {{ props.targetScript!.getPostedAtTxtForScriptDetail() }}</span>        
              </p>      
            </template>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- 詳細 -->
    <script-detail-container-description :targetScript="props.targetScript" />
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
#basic-info {
  position: relative;
}

.title-container {
  margin-right: 70px;
}

#basic-info p {
  padding: 2px 0;
  //font-size: small;
  white-space: pre-line;
}

#author-profile-contianer {
  display: flex;
  border: solid 0px #999999;
}

#profile-image-container {  
  width: 25px;
  height: 25px;
  margin-top: 2px;
  border-radius: 50%;
  border: solid 0px #bebebe;
  cursor: pointer;
}

#progile-image {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
}

#author-user-name {
  margin-top: 6px;
  margin-left: 8px;
  cursor: pointer;
}

#like-menu-buttons-container {
  position: absolute;
  top: 2px;
  right: 10px;
  width: 80px;
  border: solid 0px #999999;
}

.tag-chip {
  //font-size: 65% !important;
  font-size: 70% !important;
}


h3 {
  font-size: 130%;
}

h4 {
  font-size: 100%;
}

h5 {
  font-size: 75%;
}

/** 台本詳細説明 */
#description {
  padding: 0px 8px;
  //background-color: #EEEEEE;
}

.textLength {
  color: #737373;
  font-size: x-small;
}

#posted-date {
  font-size: 85% !important;
}

/** 台本詳細説明文 */
#description p {
  //font-size: small;
  white-space: pre-line;
  line-height: 180%;
}

/** 詳細 閉じる、開くボタン */
#description-close-open-button {
  width: 90px;
  //border: solid 1px #b6b6b6;
}
</style>
