<script lang="ts" setup>
//======================================================
//
// scriptPolicyExplainDialog.vue 台本利用規定説明用ダイアログ
//
//======================================================

import { reactive, onMounted, nextTick, watch, computed, ref } from 'vue';
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'

//======================================================
// methods
//======================================================

/**
 * OKボタンクリック
 *   ・emit実行
 */
const onClickDialogCloseButton = () => {
  try {
    useUiEventStore().uiEvent.isScriptPolicyDialogShowing = false        
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
    v-model="useUiEventStore().uiEvent.isScriptPolicyDialogShowing" 
    :fullscreen="useDisplay().mobile.value" 
    :transition="useDisplay().mobile.value ? 'dialog-transition' : 'dialog-transition'"  
    max-width="750px">
    <div id='outer-container'>
      <v-btn id='close-button-mobile'  variant="text" @click='onClickDialogCloseButton'>
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card id="inner-container">
        <!-- タイトル -->
        <v-card-title id="title" class="mt-0 mb-4 px-0 text-left">
          <v-icon color="teal" class="title-icon mr-2 text-h6">mdi-help-circle</v-icon>         
          <span class="title-text text-body-2 font-weight-bold">台本利用規定について</span>
        </v-card-title>
        <v-card-text class="text-left">
          <v-container class="px-2">
            <v-row class="my-4">
              <v-col cols="12" class="row-col">
                台本ページに記載されている利用規定の説明は以下の通りです。
                <v-table justify="center" class="mt-4">                 
                  <tbody>
                    <tr>
                      <td class="title">非商用利用時は連絡不要</td>
                      <td class="explain">
                        <p class="my-4">非商用利用であれば連絡不要で台本をお使いいただけます。</p>
                      </td>
                    </tr>
                    <tr>
                      <td class="title">商用、非商用共に連絡不要</td>
                      <td class="explain py-4">
                        商用、非商用に関わらず、連絡不要で台本をお使いいただけます。
                      </td>
                    </tr>           
                    <tr>
                      <td class="title">商用、非商用共に作者に連絡要</td>
                      <td class="explain text-error py-4">
                        台本を使用される前に作者様にXや台本コメントなどで連絡し、許可を得て下さい。
                      </td>
                    </tr>         
                    <tr>
                      <td class="title">台本説明欄参照</td>
                      <td class="explain py-4">
                        台本説明欄に記載されている利用規定に従われてください。
                      </td>
                    </tr>                      
                  </tbody>
                </v-table>
              </v-col>   
            </v-row>

            <v-row justify="center" class="mt-8 mb-8 mx-0">
              <v-spacer></v-spacer>
              <!-- 閉じるボタン -->
              <v-btn id="ok-button" 
                color="teal" 
                elevation="2" 
                @click="onClickDialogCloseButton"
                >
                OK
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
  padding: 0px;
  height: 100%;
  /** 半透明の白に */
  //background-color: red;// #F4F4F4; //rgba(255, 255, 255, 1);
  border-radius: 4px;
  /** 影をつける */
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
  padding-top: calc(env(safe-area-inset-top) + 8px); 

  background-color: $bg-grey-color;
  overflow-y: auto;  
}

#title {
  width: 90%;
  margin: auto;
  border-bottom: solid 1px #CCCCCC;
}

#close-button-mobile {
  position: absolute;
  
  // iOS対応
  top: calc(env(safe-area-inset-top) + 10px);   
  right: 4px;
  width: 50px;
  height: 50px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
  opacity: 0.7;
}

.v-card-text {
  max-width: 700px;
  margin: auto;
}

#title {
  width: 90%;
  margin: auto;
  border-bottom: solid 1px #CCCCCC;

  /** iOS対応 */
  margin-top: calc(env(safe-area-inset-top) + 20px); //calc(100svh - 140px);
}

.title-icon {
  top: -2px;
}

.v-table {
  max-width: 1800px;
  margin: 0 auto;
  border: solid 1px #9c9c9c;
  border-radius: 4px;
}

.v-table tr {
  border: solid 1px #868686;
}

.v-table td {
  position: relative;
  padding: 40px;
  border-right: solid 1px #cecece;  
}

.v-table th {
  height: 30px;
  background-color: #eaeaea;
  text-align: center !important;
  font-weight: bold;
  font-size: small;
  color: #042405;
  border-right: solid 1px #cacaca;
  border-bottom: solid 1px #9c9c9c;
}

td.title {
  width: 40%;
  max-width: 200px;
  font-weight: bold;
}


#ok-button {
  width: 100%;
  max-width: 400px;
  height: 60px;
  vertical-align: middle;
  color: #FFFFFF;
  font-size: large;
  font-weight: bold;
}


</style>