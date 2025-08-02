<script lang="ts" setup>

//======================================================
//
// scriptColorCodeSelectDialog.vue カラーコード選択用ダイアログ
//
//======================================================

import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// props、emits
//======================================================

const emits = defineEmits(
  ['onColorCodeSelected']
)

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
 * リストのアイテムクリック
 * 
 * @param SampleColorCodeItem
 */
const onListItemClick = (colorCodeItem: CONSTANTS.ColorCodeItem) => {
  try {

    emits('onColorCodeSelected', colorCodeItem)
    useUiEventStore().uiEvent.isColorCodeSelectDialogShowing = false    
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
    v-model="useUiEventStore().uiEvent.isColorCodeSelectDialogShowing" 
    max-width="800px">
    <div id='inner-container'>
      <v-card id="container-card" class="px-4 py-4">
        <p class="mb-2">
          <h4>色の選択</h4>
        </p>       
        <v-card-text class="px-0 text-left">      
          <v-row>
            <v-col cols="12">
              <template v-for="(SampleColorCodeItem, ci) in CONSTANTS.THEME_COLOR_CODE_ITEMS" :key="ci">   
                <span class="color-code-item mr-2" 
                  @click="onListItemClick(SampleColorCodeItem)"
                  :style="{
                    'background-color': SampleColorCodeItem.bgColor,
                    'border': 'solid 1px ' + SampleColorCodeItem.borderColor,
                    'color': SampleColorCodeItem.fontColor,
                  }"></span>
              </template>
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
<style lang="scss" scoped>
#inner-container {
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
}

@media (max-width: 600px) {
  #inner-container {
    padding: 0px;
  }
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
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  color: #585858;
  font-size: 100%;
  z-index: 10;
}

.v-card {
  height: 100%;
  //overflow-y: scroll;
}

.v-card-text {
  max-height: 70%;
  overflow-y: auto;
  overflow-x: hidden;
  border: solid 0px #999999;
}

.color-code-item {
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 4px;
}

</style>