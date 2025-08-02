<script lang="ts" setup>
// ======================================================
//
// error.vue エラー用テンプレート
//
// ======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useUiEventStore } from '@/store/uiEventStore'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import Script from '@/composables/type/script'

//======================================================
// vars
//======================================================


//======================================================
// onMounted
//======================================================

/**
 * onMounted
 * ・ログイン中の場合、フォローデータ、ミュートデータをセット
 */
onMounted(() => {
  try {

  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * トップページ表示中かを返す
 * 
 * @returns {boolean} トップページ表示中か
 */
const isInTopPage = (): boolean => {
  try {
    if (useRoute().fullPath.indexOf(CONSTANTS.URL_QUERY_KEY_SCRIPT_ID) === -1) {
      return true
    }
  } catch (error) {
    console.error(error)
  }

  return false
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
  404
</template>

<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss">

</style>
