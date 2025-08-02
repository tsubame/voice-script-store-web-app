<script lang='ts' setup>

//======================================================
// 
// userShareDialog.vue
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
      if (useScriptStore().targetScript.userId === useLoginUserStore().user.id) {
        isMyScript = true
      }
    }
    // 台本URLをセット
    let scriptUrl = CONSTANTS.SCRIPT_SHARE_BASE_URL
    if (useScriptStore().targetScript.id !== 0) {
      scriptUrl += useScriptStore().targetScript.id
    }

    // テキストをURLエンコード
    let txt = encodeURIComponent(useScriptStore().targetScript?.getXShareText(isMyScript)) 
    let xUrl = CONSTANTS.X_BASE_URL + scriptUrl + '&text=' + txt
    
    window.open(xUrl, '_blank')
  } catch (error) {
    console.error(error)
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
  <v-dialog v-model='useUiEventStore().uiEvent.isUserShareDialogShowing'>
    <div id='inner-container'>
      <!-- 閉じるボタン -->
      <v-btn id='close-button' icon='mdi-close' @click='onClickDialogCloseButton' />
      <v-card class='pt-0 pb-4'>  
        <v-card-text class='mx-8'>
          <v-row class='mt-8 text-center'>
            <v-col cols='12'>
              <v-btn
                @click="onXShareButtonClick"
                id="x-button" variant="outlined" >
                <p class="button-image"><v-img :src="CONSTANTS.IMAGE_X_ICON_PATH" width="30" /></p>
                <p class="caption-s-line">Xで台本一覧を共有</p>            
              </v-btn>
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
  opacity: 0.95;
}

.v-card {
  background-color: $bg-grey-color;  
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

#x-button {
  position: relative;
  width: 160px;
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