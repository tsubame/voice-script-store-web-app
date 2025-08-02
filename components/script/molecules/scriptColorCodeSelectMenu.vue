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

// props
const _props = defineProps<{
  charaName: string,
  charaIndex: number,
  selectedBgColor: string,
  selectedBorderColor: string,  
}>()

// emits
const emits = defineEmits(
  ['onColorCodeSelected']
)

//======================================================
// vars
//======================================================

// メニュー表示中か
const _isMenuShowing = ref(false)



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
 * @param {CONSTANTS.ColorCodeItem} SampleColorCodeItem
 */
const onListItemClick = (SampleColorCodeItem: CONSTANTS.ColorCodeItem) => {
  try {

    emits('onColorCodeSelected', SampleColorCodeItem, _props.charaIndex)
    _isMenuShowing.value = false
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
  <v-menu
      v-model="_isMenuShowing"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <div 
          id="activator-container"
          class="mx-1"
          v-bind="props"
          >
          <div
            id="activator-color-container"
            :style="{
              'background-color': _props.selectedBgColor,
              'border': 'solid 1px ' + _props.selectedBorderColor
            }"          
          >
          </div>
          
          <template v-if="!useDisplay().mobile.value">
            <div id="activator-icon-container">
              <v-icon>mdi-chevron-down</v-icon>
            </div>
          </template>
        </div>
      </template>

      <v-card class="px-4 py-4">
        <v-row>
          <v-col>
            <div id="colors-container">
              <template v-for="(SampleColorCodeItem, ci) in CONSTANTS.THEME_COLOR_CODE_ITEMS" :key="ci">   
                <div class="color-code-item mr-2 mb-2" 
                  @click="onListItemClick(SampleColorCodeItem)"
                  :style="{
                    'background-color': SampleColorCodeItem.bgColor,
                    'border': 'solid 1px ' + SampleColorCodeItem.borderColor,
                    'color': SampleColorCodeItem.fontColor,
                  }">{{ SampleColorCodeItem.name }}</div>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

#activator-container {
  position: relative;
  padding: 4px;
  border: solid 1px #bbbbbb;
  border-radius: 4px;
}

#activator-color-container {
  width: 70%;
  min-width: 20px;
  height: 24px;
}

#activator-icon-container {
  position: absolute;
  top: 8px;
  right: 6px;
  width: 10px;
  color: grey;
  font-size: 70%;  
  border: solid 0px #999999;
}

.v-card {
  width: fit-content;
  max-width: 320px;
  overflow-x: auto;
}

.v-card-text {

}

#colors-container {
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  border: solid 0px #999999;
}

.color-code-item {
  display: flex;
  width: 60px;
  height: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 80%;
  line-height: 14px;
  cursor: pointer;
}

</style>