<script lang='ts' setup>

//======================================================
// 
// scriptShareDialog.vue
//
//======================================================

import { reactive, onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import * as ViewRouter from 'vue-router'
import * as CONSTANTS from '@/composables/etc/constants'
import * as firebaseManager from '@/composables/util/firebaseManager'
import * as phpApiManager from '@/composables/util/phpApiManager';
import { useLoginUserStore } from '@/store/loginUserStore';
import { useUiEventStore } from '@/store/uiEventStore';
import * as preferenceManager from '@/composables/util/preferenceManager';
import * as loginManager from '@/composables/util/loginManager';
import User from '@/composables/type/user';
import GoogleUser from '@/composables/type/googleUser';
import TwitterUser from '@/composables/type/twitterUser';

//======================================================
// vars
//======================================================

// tooltip表示
const _showCopiedTooltip = ref(false)

//======================================================
// onMounted
//======================================================

/**
 * onMounted
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
 * イベント Xで共有ボタンクリック
 */
const onXShareButtonClick = () => {
  try {    
    console.log("[Xで共有]")
    // 自分の台本かを判別
    let isMyScript = false
    if (useLoginUserStore().hasLogined()) {
      if (useScriptStore().targetScript.userId == useLoginUserStore().user.id) {
        isMyScript = true
      }
    }

    // 台本URLをセット
    let scriptUrl = CONSTANTS.SCRIPT_SHARE_BASE_URL
    if (useScriptStore().targetScript.id !== 0) {
      scriptUrl += useScriptStore().targetScript.id
    }

    // テキストをURLエンコード
    let txt = encodeURIComponent(useScriptStore().targetScript?.getXShareText(isMyScript)) // テキストをURLエンコード
    let xUrl = CONSTANTS.X_BASE_URL + scriptUrl + '&text=' + txt
    
    window.open(xUrl, '_blank')
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 台本情報、URLをコピーボタンクリック
 */
const onClickCopyButton = async () => {
  try {
    _showCopiedTooltip.value = true;

    // 1秒後に非表示
    setTimeout(() => {
      _showCopiedTooltip.value = false;
    }, 1000);

    // URLをセット
    let url = CONSTANTS.SCRIPT_SHARE_BASE_URL
    if (useScriptStore().targetScript.id !== 0) {
      url += useScriptStore().targetScript.id
    }

    // 自分の台本かを判別
    let isMyScript = false
    if (useLoginUserStore().hasLogined()) {
      if (useScriptStore().targetScript.userId == useLoginUserStore().user.id) {
        isMyScript = true
      }
    }

    // テキストをセット
    let text = useScriptStore().targetScript.getShareText(isMyScript) + `${url}`;

    // コピー
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const isIos = navigator.userAgent.match(/ipad|iphone/i);
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      if (isIos) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textarea.setSelectionRange(0, 999999);
      } else {
        textarea.select();
      }
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!result) {
        throw new Error('コピーに失敗しました');
      }
    }
  } catch (error) {
    console.error('コピーエラー:', error);
  }
}

/**
 * イベント 閉じるボタンクリック
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isScriptShareDialogShowing = false    
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
  <v-dialog v-model='useUiEventStore().uiEvent.isScriptShareDialogShowing'>
    <div id='inner-container'>
      <!-- 閉じるボタン -->
      <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      
      <v-card class='pt-0 pb-4'>  
        <v-card-title class="text-center">
          <h5 class="mt-1">台本共有</h5>
        </v-card-title>          
        <v-card-text class='mx-8'>
          <v-row class='mt-8 text-center'>
            <v-col cols='12' class="d-flex justify-center">
              <v-btn
                @click="onXShareButtonClick"
                class="card-button mr-4" variant="outlined" >
                <p class="button-image"><v-img :src="CONSTANTS.IMAGE_X_ICON_PATH" width="30" /></p>
                <p class="caption-s-line">Xにポスト</p>            
              </v-btn>
              <v-btn class="card-button" variant="outlined"
              @click="onClickCopyButton"
              >
                <p class="button-image"><v-icon color="teal-lighten-2" class="text-h4">mdi-content-copy</v-icon></p>
                <p class="caption-w-line">台本情報、<br />URLをコピー</p>            
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <!--
              <v-alert
                class="mt-4 mx-0 px-0 text-left "
                color="teal"
                variant="text"
              >配信アプリで台本を使用する際は<br /><strong>「台本情報・URLをコピー」</strong>でコピーされた文章を配信先に貼って下さい。</v-alert>         
            -->

              <v-tooltip
                v-model="_showCopiedTooltip"  
                location="bottom" 
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      id="dummy-button"
                      class="bg-transparent"
                      v-bind="props"
                    >
                    </v-btn>
                </template>
                  台本情報・URLがコピーされました。
              </v-tooltip>            
            </v-col>            
          </v-row>
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
  max-width: 500px;
  overflow-y: auto;
}

#inner-container {
  padding: 8px;
  //max-height: 90lvh;
  /** 半透明の白に */
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  /** 影をつける */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  overflow-y: auto;
  z-index: 10;
  //opacity: 0.95;
}

.v-card {
  background-color: $bg-orange-color;  
  overflow-y: auto;
}

#close-button {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 30px;
  height: 30px;
  color: #585858;
  font-size: x-small;
  z-index: 10;
  /** 半透明に */
  background-color: rgba(255, 255, 255, 0.5);
}

#close-button-mobile {
  position: absolute;
  top: 6px;
  right: 0px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.login-button {
  margin-top: 20px;
  width: 300px;
  height: 50px;
}

.card-button {
  position: relative;
  width: 120px;
  height: 120px;
  margin: auto;
  border: solid 1px #999999;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-image {
  position: absolute;
  top: 24px;
}

.caption-s-line {
  position: absolute;
  bottom: 22px;
}

.caption-w-line {
  position: absolute;
  bottom: 8px;
}

#dummy-button {
  width: 0px;
  height: 0px;
  opacity: 0;
}
</style>