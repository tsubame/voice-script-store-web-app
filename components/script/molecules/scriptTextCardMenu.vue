<script lang="ts" setup>

//======================================================
//
// scriptTextCardMenu.vue
//
//======================================================

import { reactive, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as CONSTANTS from '@/composables/etc/constants'
import * as preferenceManager from '@/composables/util/preferenceManager'
import * as phpApiManager from '@/composables/util/phpApiManager'

//======================================================
// vars
//======================================================

// プラスボタン用のツールチップ表示
const _showPlusButtonTooltip = ref(false)

// マイナスボタン用のツールチップ表示
const _showMinusButtonTooltip = ref(false)

//======================================================
// methods
//======================================================

/**
 * イベント プラスボタンクリック
 */
const onPlusButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isFontSizePlusButtonClicked = true

    _showPlusButtonTooltip.value = true    

    // 1秒後に非表示
    setTimeout(() => {
      _showPlusButtonTooltip.value = false
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント マイナスボタンクリック
 */
const onMinusButtonClick = async() => {
  try {
    useUiEventStore().uiEvent.isFontSizeMinusButtonClicked = true

    _showMinusButtonTooltip.value = true    

    // 1秒後に非表示
    setTimeout(() => {
      _showMinusButtonTooltip.value = false
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}

/**
 * イベント 縦横切り替えボタンクリック
 */
const onSwitchButtonClick = async () => {
  try {
    useUiEventStore().uiEvent.showFullScreenScriptByVertical = !useUiEventStore().uiEvent.showFullScreenScriptByVertical 
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
  <div id="container" class="d-flex justify-end">
    <div id="buttons-container">
      <v-tooltip
        v-model="_showMinusButtonTooltip"     
        location="bottom" 
      >   
        <template v-slot:activator="{ props }">    
          <span class="ml-0">
            <v-btn id="minus-button" 
              v-bind="props"                    
              :class="{
                'plus-minus-button': true,
              }" 
              @click="onMinusButtonClick"
              density="comfortable"              
              variant="flat"
              icon="mdi-minus"
                ><v-icon>mdi-minus</v-icon>
              </v-btn>   
          </span>   
        </template>
        台本文字サイズ縮小
      </v-tooltip>  

      <v-tooltip
        v-model="_showPlusButtonTooltip"   
        location="bottom"    
      >   
        <template v-slot:activator="{ props }">              
          <span class="ml-2">
            <v-btn id="plus-button" 
              v-bind="props"             
              :class="{
                'plus-minus-button': true,
              }" 
              @click="onPlusButtonClick"
              density="comfortable"              
              variant="flat"
              icon="mdi-plus"
                ><v-icon>mdi-plus</v-icon>
              </v-btn>   
          </span>
        </template>
          台本文字サイズ拡大
      </v-tooltip>       

      <v-btn 
        class="ml-4 bg-white"   
        @click="onSwitchButtonClick"
        color="grey"
        density="comfortable"
        variant="outlined"   
        rounded    
        >
        <v-icon>mdi-swap-horizontal</v-icon>
        <span class="text-grey-darken-2">
          <template v-if="!useUiEventStore().uiEvent.showFullScreenScriptByVertical">
            縦書き
          </template>  
          <template v-else>
            横書き
          </template> 
        </span>
      </v-btn>     
    </div>
  </div>
</template>

<!--
======================================================
  CSS
======================================================  
-->
<style lang="scss" scoped>
#container {
  width: 100%;
  margin: 20px auto;
  height: 40px;
  position: absolute;
  bottom: 0px;
  border: solid 0px #999999;
}

#buttons-container {
  position: absolute;
  right: 30px;
  padding-top: 4px;
  border: solid 0px #999999;
  background-color: white;
}

#switch-button {
  position: absolute;
  top: 16px;
  height: 30px;
  left: 10px;
}

.plus-minus-button {
  width: 30px;
  height: 30px;
  font-size: 80%;;
}

.button-flat {
  background-color: white !important;
  color: #8f8f8f !important;
  border: solid 1px #C7C7C7;
}

.button-switch-flat {
  background-color: white !important;
  color: #454545 !important;
  border: solid 1px #C7C7C7;
}

#menu-button {
  opacity: 0.6;
}
</style>
