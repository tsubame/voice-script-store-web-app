<script lang="ts" setup>

//======================================================
//
// userTagSelectDialog.vue タグ選択用ダイアログ
//
//======================================================

import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// props、emits
//======================================================

const props = defineProps<{
  selctedTags: string[]
}>()

const emits = defineEmits(
  ['onTagSelectDialogCloseButtonClick']
)

//======================================================
// vars
//======================================================

// 選択されたタグ
const _selectedTagTxts = ref<string[]>([])

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    console.log(props.selctedTags)

    // カンマで分割
    if (props.selctedTags !== undefined) {
      _selectedTagTxts.value = props.selctedTags
    }
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * リストのアイテムクリック
 * 
 * @param {CONSTANTS.ScriptTagItem} tagItem
 */
const onListItemClick = (tagItem: CONSTANTS.ScriptTagItem) => {
  try {
    if (_selectedTagTxts.value.includes(tagItem.text)) {
      _selectedTagTxts.value = _selectedTagTxts.value.filter((txt) => txt !== tagItem.text)
    } else {
      _selectedTagTxts.value.push(tagItem.text)
    }

    console.log(_selectedTagTxts.value)    
  } catch (error) {
    console.error(error);
  }
}

/**
 * OKボタンクリック
 *   ・ダイアログを閉じる
 */
const onOKButtonClick = () => {
  try {
    // 8個以上選択されている場合はNG
    if (CONSTANTS.SCRIPT_POST_FORM_TAG_MAX_SELECT_COUNT < _selectedTagTxts.value.length) {
      alert('選択できるタグは最大' + CONSTANTS.SCRIPT_POST_FORM_TAG_MAX_SELECT_COUNT + '個までです。')

      return
    }

    // 文字列配列を作成
    let tags = new Array<string>()
    // 定数のタグの順番に並べる
    CONSTANTS.SCRIPT_TAG_ITEMS.forEach((tagItem: CONSTANTS.ScriptTagItem) => {
      if (_selectedTagTxts.value.includes(tagItem.text)) {
        tags.push(tagItem.text)
      }
    })

    emits('onTagSelectDialogCloseButtonClick', tags)
    useUiEventStore().uiEvent.isSelectScriptTagDialogShowing = false    
  } catch (error) {
    console.error(error);
  }
}

/**
 * 閉じるボタンクリック
 *   ・ダイアログを閉じる
 */
const onCloseButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isSelectScriptTagDialogShowing = false
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
    v-model="useUiEventStore().uiEvent.isSelectScriptTagDialogShowing" 
    :fullscreen="useDisplay().mobile.value"
    max-width="850px">
    <div id='outer-container'>
      <!-- 閉じるボタン -->
      <v-btn id='close-button-mobile' icon='mdi-close' variant="text" @click='onCloseButtonClick' />

      <v-card id="inner-container" class="px-4 pb-4">
        <!-- タイトル -->
        <v-card-title id="title-container" class="mt-2 mb-4 px-2 text-left">
          <span class="title-icon text-body-2 mr-2">
            <v-icon color="teal-lighten-2">mdi-tag</v-icon>
          </span>
          <span class="text-subtitle-2 font-weight-bold">タグの選択</span>
        </v-card-title>
        <v-card-text id="scroll-container" class="mt-0 px-1 text-left">      
          <div id="explain-container" class="mb-8">
            <p class="mx-0 text-left pl-2">
              <small class="text-caption mt-2">台本に設定したいタグを選択して下さい。（最大{{ CONSTANTS.SCRIPT_POST_FORM_TAG_MAX_SELECT_COUNT }}個まで選択可）</small>  
            </p>           
          </div>

          <template v-for="(tagCategory, ti) in CONSTANTS.SCRIPT_TAG_CATEGORIES" :key="ti">  
            <v-row>
              <v-col class="tags-category-items-container">   
                <!-- カテゴリ名 モバイル-->
                <template v-if="useDisplay().smAndDown.value">
                  <div class="tags-category-mobile text-caption text-grey-darken-4 ml-2">
                    {{ tagCategory }}
                  </div>
                </template>
                <template v-else>
                  <div class="tags-category text-body-1 text-grey-darken-4">
                    {{ tagCategory }}
                  </div>   
                </template>
                <div :class="{ 'tags-container-mobile': useDisplay().smAndDown.value, 'tags-container': useDisplay().smAndUp.value}">
                  <v-row no-gutters>
                  <template v-for="(tag, index) in CONSTANTS.SCRIPT_TAG_ITEMS" :key="index">              
                    <template v-if="tag.subCategory === tagCategory">
                      <v-col cols="4" sm="4" md="3" class="tag-container px-1">        
                        <v-chip           
                        :class="{ 'is-selected': _selectedTagTxts.includes(tag.text), 'text-center': true }" 
                          :color="_selectedTagTxts.includes(tag.text)  ? 'blue-darken-4' : 'grey-darken-4'"
                        @click="onListItemClick(tag)"
                        variant="outlined"
                        label
                        >
                          {{ tag.text }}
                        </v-chip>
                        
                      </v-col>
                    </template>        
                  </template>
                  </v-row>
                </div>
              </v-col>
            </v-row>  
            <v-divider class="my-2"></v-divider>
          </template>
        </v-card-text>

        <v-card-actions id="action-container" class="mt-0 mb-4 px-1  py-0">
          <v-spacer></v-spacer>
          <v-btn id="ok-button" variant="elevated" color="teal" @click="onOKButtonClick">
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>      
      </v-card>
    </div>
  </v-dialog>
</template>

<style lang="scss" scoped>

$dialog-header-height: 50px;
$dialog-footer-height: 80px;

#outer-container {
  padding: 0px;
  height: 100%;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 10;
  opacity: 0.95;
  overflow-y: auto;
}

#inner-container {
  position: relative;  
  height: 100%;
  // iOS対応
  padding-top: calc(env(safe-area-inset-top) + 0px); 

  background-color: $bg-grey-color;
  overflow-y: auto;  
}

#title-container {
  width: 98%;
  height: $dialog-header-height;
  margin: 0 auto;
  border-bottom: solid 1px #CCCCCC;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 8px);   
  right: 0px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.v-card-text {
  max-height: calc(100dvh - $dialog-header-height - $dialog-footer-height - 50px);
  overflow-y: auto;
  overflow-x: hidden;
  border: solid 0px #999999;
}

small {
  font-size: small;
}

.tags-category-items-container {
  position: relative;
} 

.tags-category {
  position: absolute;
  top: 20px;
  left: 70px;
} 

.tags-category-mobile {
  margin-left: 0px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin: 4px auto;
  margin-left: 200px;
  max-width: 600px;
  border: solid 0px #999999;
}

.tags-container-mobile {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 600px;
  border: solid 0px #999999;
}

.tag-container {
  position: relative;
  width: 100%;
  height: fit-content;
  padding: 0px;
  border: solid 0px #999999;
}

.v-chip {
  position: relative;
  width: 140px;
  margin: 4px 0px 4px 0px;
  padding: 20px 0px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px transparent;  
  opacity: 1;  
  border: solid 1px #999999;
  background-color: white;
  font-size: 110% !important;  
}

@media (max-width:389px) {
  .v-chip {
    font-size: 100%;
  }
}

/*
.chip {
    margin: 4px 0px 4px 0px;
  height: 50px;
  line-height: 40px;
}*/

.is-selected {
  font-weight:bolder;
  opacity: 1;
  text-shadow: #999999;
  border: solid 1px #1565C0 !important;
  background-color: #d8efff;
  font-size: 110% !important; 
}

#action-container {
  height: $dialog-footer-height;
}

#ok-button {
  width: 100%;
  max-width: 400px;
  height: 60px;
  font-size: 120%;

  margin-top: 20px;
}

</style>