<script lang="ts" setup>
//======================================================
//
// reportEditForm.vue 違反報告投稿用フォーム
//
//======================================================

import { reactive, onMounted, ref } from 'vue';
import { useDisplay } from "vuetify";
import axios from 'axios'
import * as CONSTANTS from '@/composables/etc/constants'
import * as loginUserStore from '@/store/loginUserStore'
import * as preferenceManager from "@/composables/util/preferenceManager"
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as loginManager from '@/composables/util/loginManager';
import * as scriptStore from '@/store/scriptStore'
import Script from '@/composables/type/script'
import User from '@/composables/type/user'
import Report from '@/composables/type/report'
import { useConfirmDialog } from '@/composables/util/dialogManager'
import { useAccessTokenStore } from '../store/accessTokenStore';
import { useLoginUserStore } from '../store/loginUserStore';

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({  
  middleware: [
    'login-checker',
    'access-token-checker'
  ]
})


//======================================================
// vars
//======================================================

// フォームの値
const _formVals = reactive({
  // 違反報告データ
  report: new Report(),
  // 報告対象のユーザ名
  targetUserName: '',
  // 報告対象の台本名
  targetScriptName: '',  
})

// 登録実行ボタンを無効化するか（二重クリック防止）
const _isRegisterButtonDisabled = ref(false)
// 入力フォームバリデーション用定数 
const editForm = ref();
// 確認ダイアログ表示用
const { showConfirmDialog } = useConfirmDialog({});

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    // 未ログインの場合、ログインページに遷移
    if (!useLoginUserStore().hasLogined()) {      
      navigateTo(CONSTANTS.PAGE_NAME_LOGIN)
    }

    // storeからフォームに値をセット
    _formVals.report.userId = useLoginUserStore().user.id
    _formVals.report.reportTargetUserId = useUiEventStore().uiEvent.reportTargetUser.id
    _formVals.targetUserName = useUiEventStore().uiEvent.reportTargetUser.name
    _formVals.report.scriptId = useUiEventStore().uiEvent.reportTargetScript.id
    _formVals.targetScriptName = useUiEventStore().uiEvent.reportTargetScript.title
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント 投稿ボタンクリック
 */
const onSubmitButtonClick = async () => {
  try {
    console.log('onSubmitButtonClick')
    // フォームのバリデーション
    let res = await editForm.value.validate()
    console.log(res.valid)
    if (!res.valid) {
      return
    }

    res = await showConfirmDialog('違反報告を行います。よろしいですか？')
    if (!res) {
      return
    }

    // 本文にユーザ名、台本名を追加
    _formVals.report.message = `\n【違反ユーザ名】${_formVals.targetUserName}\n【違反台本名】${_formVals.targetScriptName}\n【報告者】${useLoginUserStore().user.name}\n\n【コメント】${_formVals.report.message}`
    // ボタンを無効化
    _isRegisterButtonDisabled.value = true
    // 投稿
    res = await phpApiManager.usePostCreateReport(_formVals.report, useLoginUserStore().user, useAccessTokenStore().accessToken)
    if (res) {
      useUiEventStore().uiEvent.okDialogMessage = CONSTANTS.INFO_MSG_REPORT_DONE
      useUiEventStore().uiEvent.isOkDialogShowing = true

      navigateTo(CONSTANTS.PAGE_NAME_SCRIPTS)
    } else { 
      alert('違反報告の投稿に失敗しました。')
    }
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
  <div id="report-edit-form-container" ref="scriptContainer">
    <v-main id="report-edit-form-main" ref="scriptMain">
      <v-container id="report-edit-form-container-inner" ref="scriptContainerInner" class="px-0 py-0 my-0">
        <v-container id="report-edit-form-detail-container" ref="scriptDetailContainer" class="px-0 pt-0">

          <v-card id="card-container" class="pb-12 mt-0 mb-12 px-0">
            <header id="header"></header>

            <h3 class="mt-6 px-4 mb-0">
              <span class="ml-2">違反報告フォーム</span>
              <v-divider class="mt-2" />
            </h3>

            <v-row>
              <v-col cols="10" class="mx-6 mt-4 text-caption">
                <p>利用規約違反や迷惑行為についての報告用フォームです。</p>              
              </v-col>
            </v-row>

            <v-card-text class="px-4">
              <v-form ref="editForm" id="form-container">           
                <v-row class="mt-10 mb-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">
                      <h5 class="input-htxt">報告の種別</h5>
                    </template>
                  </v-col>
                  <v-col cols="12" class="my-0 py-0">
                    <v-select variant="outlined"
                      :items="CONSTANTS.REPORT_FORM_VALS_REPORT_TITLES"
                      v-model="_formVals.report.title" 
                      :label="useDisplay().mobile.value ? '報告の種別' : ''"      
                      :rules="CONSTANTS.FORM_VALIDATION_RULE" 
                      item-text="title"
                      item-value="value"                      
                      density="compact"
                      />
                  </v-col>
                </v-row>              

                <v-row class="my-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">
                      <h5 class="input-htxt">報告対象のユーザ名</h5>
                    </template>
                    <v-text-field v-model="_formVals.targetUserName" 
                      :label="useDisplay().mobile.value ? '報告対象のユーザ名' : ''"
                      :rules="CONSTANTS.FORM_VALIDATION_RULE" 
                      variant="outlined" density="compact">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row class="my-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">
                      <h5 class="input-htxt">報告対象の台本名</h5>
                    </template>
                    <v-text-field v-model="_formVals.targetScriptName" 
                      :label="useDisplay().mobile.value ? '報告対象の台本名' : ''"
                      placeholder="台本名を入力。なければ空欄"
                      variant="outlined" density="compact">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row class="my-0 py-0">
                  <v-col cols="12" class="my-0 py-0">
                    <template v-if="!useDisplay().mobile.value">         
                      <h5 class="input-htxt">内容</h5>
                    </template>  
                    <v-textarea 
                      class="py-0 textarea-basic-description" 
                      v-model="_formVals.report.message"               
                      :label="useDisplay().mobile.value ? '内容' : ''"                            
                      placeholder="報告したい内容を記入してください。" 
                      :rules="CONSTANTS.FORM_VALIDATION_RULE"                     
                      variant="outlined" rows="8" auto-grow 
                      density="compact"
                    />
                  </v-col>
                </v-row>

                <v-row class="text-center mb-0" justify="center" t>
                  <v-col cols="12" class="mb-0">
                    <v-btn 
                    id="submit-button" 
                    color="success" 
                    :disabled="_isRegisterButtonDisabled"
                    @click="onSubmitButtonClick"
                    >                                
                      投稿                  
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-container>
      </v-container>
    </v-main>
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
#report-edit-form-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 0;
  //overflow-y: hidden;
  overflow-x: hidden;
  z-index: 4;
}

#report-edit-form-container-inner {
  min-height: 100svh;
  max-width: $content-max-width;
  border: solid 0px #999999;
  background-color: transparent;
}

#header {
  height: 120px; //100px;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  background-image: $info-page-header-image-path;
}

.v-container {
  width: 100%;
  height: fit-content;
}

#form-container {
  width: 100%;
  max-width: 500px;
  min-height: 700px;
  margin: auto;
  border: solid 0px #999999;
}

input {
  background-color: #F4F7FA;
  border: solid 1px #cbcbcb;
  border-radius: 4px;
}


#profile-icon-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0px auto;
  margin-bottom: 16px;
  padding: 0;
  border-radius: 50%;
  border: solid 1px #cdcdcd;
  background: rgb(0, 0, 0, 0.3);
  color: white;
}

#profile-icon-container strong {
  position: absolute;
  top: 65%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 100%;
  margin: 0;
  padding: 0;
  color: white;
  font-size: 85%;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
}

#profile-icon-container .fa {
  position: absolute;
  top: 30%;
  left: 37%;
  font-size: 200%;
}

#profile-icon {
  margin: 0 auto;
  border-radius: 50%;
  border: solid 2px white;
  opacity: 0.3;

  /** 背景色を半透明の黒に */
  background-color: rgba(128, 128, 128, 0.5);
}

#file-select-button {
  position: absolute;
  top: 20%;
  left: 20%;
  width: 100px;
  height: 100px;
  opacity: 0;
}

.short-width {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 768px) {
  .v-text-field {
    max-width: 600px;
  }
}

.flex {
  flex-direction: row;
}

h4 small {
  color: #6b6b6b;
  font-weight: normal;
}

h5.input-htxt {
  color: #616161;
}

.input-row-clm {
  height: 70px;
  margin-top: 12px;
  border: solid 0px #999999;
  padding: 0px;
}

#submit-button {
  width: 100%;
  max-width: 600px;
  min-height: 60px;
  font-size: large;
  font-weight: bold;
}

</style>
