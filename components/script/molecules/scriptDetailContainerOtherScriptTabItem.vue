<script lang="ts" setup>
//======================================================
//
// scriptDetailContainerOtherScriptTabItem.vue 
// 作者の他の台本タブアイテム
//
//======================================================

import InfiniteLoading from "v3-infinite-loading";
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useUiEventStore } from '@/store/uiEventStore';
import Script from "@/composables/type/script"
import Comment from '@/composables/type/comment';
import User from '@/composables/type/user';
import Notification from '@/composables/type/notification';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  authorUser: User,
  scripts: Array<Script>,
})

//======================================================
// vars
//======================================================

// 台本一覧
const _showScripts = ref<Array<Script>>(new Array<Script>())

// 台本を読み込むボタンが押されたか
const _isLoadButtonClicked = ref(false)

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    // 台本ロード
    if (props.scripts !== undefined) {
      loadScripts()
    }
  } catch (error) {
    console.error(error)
  }
})

/**
 * 台本を1ページ分ロード
 */
function loadScripts() {
  try {
    const sIndex = _showScripts.value.length
    const eIndex = sIndex + (CONSTANTS.SCRIPTS_LOAD_COUNT)

    // 台本がなければ終了
    if (props.scripts === undefined) {
      return
    }
    if (props.scripts.length === 0) {
      return
    }

    for (let i = sIndex; i < eIndex; i++) {
      if (props.scripts[i] !== undefined) {
        _showScripts.value.push(props.scripts[i])
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * inifinityLoading用設定
 * 
 * @param $state 
 */
const load = async ($state: any) => {
  console.log('script loading...');
  try {
    // 1ページ分ローディング
    loadScripts()
  } catch (error) {
    $state.error();
  }
};

//======================================================
// methods
//======================================================

/**
 * イベント 台本アイテムクリック
 * ・リンクのデフォルト動作をキャンセル
 * ・閲覧中の台本IDをセット
 * 
 * @param script
 * @returns
 */
const onScriptItemClick = async(event: any, script: Script) => {
  try {
    if (event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button === 1)) {
      return;
    }

    // リンクのデフォルト動作をキャンセル
    event.preventDefault();

    // リンクが存在していればリンク先へ
    if (script.scriptUrl !== '' && script.scriptUrl !== null) {
      // リンクのデフォルト動作をキャンセル
      event.preventDefault();
      // リンク先に新しいタブで遷移
      window.open(script.scriptUrl, '_blank')

      return
    }
    // 該当台本取得
    useScriptStore().watchingScriptId = script.id
  } catch (error) {
    console.error(error)
  }
}

//======================================================
// watch
//======================================================

/**
 * watch useScriptStore().targetScript.id
 * ・台本IDが変わった場合、_isLoadButtonClickedをfalseに
 */
watch(() => useScriptStore().targetScript.id, (newValue, oldValue) => {
  try {
    _isLoadButtonClicked.value = false
  } catch (error) {
    console.error(error)
  }
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
  <div id="outer-container" class="mt-4 px-2">  
    <v-row justify="center" id="inner-container">
      <v-col cols="12" class="text-left mt-12 px-0">

        <h3 class="blue mt-12 mx-0 mb-10 px-4 text-body-1 font-weight-bold">
          <v-icon class="h-icon mr-2" color="blue-lighten-3">mdi-book-open-page-variant</v-icon>{{ props.authorUser!.name }}さんの他の台本一覧
        </h3>           

        <!-- 最大3件の台本を表示 -->
        <template v-if="!_isLoadButtonClicked">
          <v-list class="px-2 pb-12">
            <template v-for="(script, index) in _showScripts" :key="index">
              <template v-if="index < CONSTANTS.SCRIPT_DETAIL_AUTHOR_OTHER_SCRIPTS_MAX_COUNT">
                <div class="my-4">
                  <script-same-author-list-item
                      :href="script.getScriptLink()"              
                      @click="(event: any) => onScriptItemClick(event, script)"
                    :targetScript="script" />
                </div>
              </template>
            </template>

            <!-- 4件以上ある場合 -->
            <template v-if="CONSTANTS.SCRIPT_DETAIL_AUTHOR_OTHER_SCRIPTS_MAX_COUNT < _showScripts.length">
              <p class="text-right">
                <v-btn
                  class="mt-4"
                  variant="text"
                  color="grey-darken-2"
                  @click="_isLoadButtonClicked = true"
                  rounded
                >
                  <v-icon class="mr-2">mdi-menu-down</v-icon>残り{{ props.scripts!.length - CONSTANTS.SCRIPT_DETAIL_AUTHOR_OTHER_SCRIPTS_MAX_COUNT }}件を表示
                </v-btn>
              </p>
            </template>
          </v-list>   
        </template>   
        <!-- 全件の台本を表示 -->
        <template v-if="_isLoadButtonClicked">
          <v-list class="px-2">
            <template v-for="(script, index) in _showScripts" :key="index">
              <div class="my-4">
                <script-same-author-list-item
                    :href="script.getScriptLink()"              
                    @click="(event: any) => onScriptItemClick(event, script)"
                  :targetScript="script" />
              </div>
            </template>
          </v-list>

          <InfiniteLoading @infinite="load" />        
        </template>        
      </v-col>
    </v-row>
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
#outer-container {
  width: 100%;
  margin: auto;
  //background-color: transparent;
  background-color: $bg-orange-color;
}

#inner-container {
  width: 100%;
  margin: auto;
  background-color: $bg-orange-color;
}

.v-list {
  background-color: $bg-orange-color;
}

</style>
