<script lang="ts" setup>

//======================================================
// 
// カスタム確認ダイアログ
//
// [使い方]
//  import { useMessageDialog } from '@/composables/util/dialogManager'
//
//  if (await showConfirmDialog("text")) {
//    console.log("OK")
//  } else {  
//    console.log("キャンセル")
//  }
// 
//  const { showConfirmDialog } = useConfirmDialog({});
//
// <template>
//   <common-confirm-dialog />
// </template>
//
//======================================================

// dialog表示用
import { useConfirmDialog } from "@/composables/util/dialogManager";

const { isOpen, ok, cancel, close, dialogText } = useConfirmDialog();

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <v-dialog v-model="isOpen">
    <div id="inner-container">
      <v-card>
        <v-card-text class="py-2">
          <div class="dialog-title my-4">

          </div>
          <p class="confirm-dialog-message mt-7" v-html="dialogText.text">
          </p>

          <v-row class="mt-6">
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-btn color="grey-lighten-1" @click="cancel" class="item-button mb-7">
                {{ dialogText.cancel }}
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn color="success" @click="ok" class="item-button mb-3">{{ dialogText.ok }}</v-btn>
            </v-col>
            <v-spacer></v-spacer>
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
.v-dialog {
  max-width: 600px;

  background-color: transparent;
}

#inner-container {
  padding: 8px;
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
  overflow-y: hidden;
  text-align: center;
}

.dialog-title {
  font-weight: bold;
  font-size: 130%;
}

#h-explain {
  font-size: 60%;
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

.button-title {
  font-weight: bold;
}

.item-button {
  opacity: 0.9;
  width: 100%;
  max-width: 200px;
  height: 50px;
  font-weight: bold;
  font-size: 120%;
  border-radius: 4px;
}

.confirm-dialog-message {
  font-size: 110%;
  line-height: 160%;
}

.item-explain {
  font-size: 90%;
}

</style>