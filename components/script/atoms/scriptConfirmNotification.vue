<script lang="ts" setup>

//======================================================
// 
// scriptConfirmNotification.vue 確認通知メッセージ
//
//======================================================

// vue
import { reactive, onMounted, ref } from 'vue';
// 定数
import * as CONSTANTS from '@/composables/etc/constants'

//======================================================
// props、emits
//======================================================

// props
const props = defineProps({
  message: String,
})

</script>
<!--
//======================================================
//  HTML
//======================================================  
-->
<template>
  <!-- 確認メッセージ。台本編集時のみ -->
  <v-row class="text-left" justify="center">
    <v-col cols="12" class="mb-4 px-6 mt-8">
      <v-alert id="confirm-notification" color="info" density="compact" icon="mdi-help-box" variant="outlined">
        {{ props.message }}
      </v-alert>
    </v-col>
  </v-row>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>
// 確認
#confirm-notification {
  max-width: 800px;
  margin-top: 10px;
  margin: auto;
}
</style>