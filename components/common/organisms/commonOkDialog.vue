<script lang='ts' setup>

//======================================================
// 
// commonOkDialog.vue
//
//======================================================

import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import * as ViewRouter from 'vue-router'
import * as CONSTANTS from '@/composables/etc/constants'
import * as firebaseManager from '@/composables/util/firebaseManager'
import * as phpApiManager from '@/composables/util/phpApiManager';

//======================================================
// methods
//======================================================

/**
 * ダイアログの閉じるボタン、OKボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.okDialogExplainMessage = ''
    useUiEventStore().uiEvent.okDialogMessage = ''
    useUiEventStore().uiEvent.isOkDialogShowing = false    
  } catch (error) {
    console.error(error)
  }
}

</script>
<!--
//======================================================
//
// template
//
//======================================================
-->
<template>
  <div id='outer-container'>
    <v-dialog v-model='useUiEventStore().uiEvent.isOkDialogShowing'>
      <div id='inner-container'>
        <v-card class='pt-2 pb-8'>
          <!-- エラー時のアイコン -->
          <template v-if="useUiEventStore().uiEvent.okDialogMessage.indexOf(CONSTANTS.OK_DIALOG_SHOW_ERROR_ICON_KEYWORD) !== -1">
            <v-card-title class='headline text-body-1'>
              <span class="text-error">エラー</span>
            </v-card-title>
          </template>

          <v-card-text class='py-2'>
            <v-row class='mt-4'>
              <!-- メインのテキスト -->
              <v-col cols='12'>
                <!-- エラー時 -->
                <template v-if="useUiEventStore().uiEvent.okDialogMessage.indexOf(CONSTANTS.OK_DIALOG_SHOW_ERROR_ICON_KEYWORD) !== -1">
                  <v-alert
                    class="mt-2 mx-0"
                    color="error"
                    icon="$error"
                    variant="outlined"
                  >{{ useUiEventStore().uiEvent.okDialogMessage }}
                  </v-alert>   
                </template>
                <template v-else>
                  <span v-html="useUiEventStore().uiEvent.okDialogMessage"></span>
                </template>
              </v-col>

              <!-- 補足説明 -->
              <template v-if="useUiEventStore().uiEvent.okDialogExplainMessage !== ''">
                <v-col cols='12'>
                  <span class="text-error" v-html="useUiEventStore().uiEvent.okDialogExplainMessage"></span>
                </v-col>  
              </template>            
              <v-col cols='12'>
                <!-- OKボタン -->
                <v-btn class='ok-button' color="teal" @click="onClickDialogCloseButton">
                  <template v-slot:prepend>
                  </template>
                  OK
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
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
#outer-container {
  position: fixed;
  top: 0px;  
  margin-top: -10000px;
  text-align: center;
  z-index: 10;
  border: solid 10px #999999;
}

.v-dialog {
  max-width: 600px;
}

#inner-container {
  padding: 8px;
  max-height: 80lvh;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  z-index: 10;
  opacity: 0.95;
}

.v-card {
  overflow-y: scroll;
}

.v-icon {
  top: -2px;
}

.ok-button {
  margin-top: 20px;
  width: 200px;
  height: 50px;
}

</style>