<script lang="ts" setup>
//======================================================
//
// userMyPageMenuButton.vue マイページのメニューボタン
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as  CONSTANTS from '@/composables/etc/constants'
import User from "@/composables/type/user"

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetUser: User
}>()

//======================================================
// vars
//======================================================

//======================================================
// methods
//======================================================

/**
 * イベント Xアカウントボタンクリック
 */
const onXAccountButtonClick = () => {
  try {
    console.log('onXAccountButtonClick')
    let url = CONSTANTS.X_LINK_PREFIX + props.targetUser.twitterScreenName
    // @を除去
    url = url.replace('@', '')
    url = url.replace('＠', '')

    window.open(url, '_blank')
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
<template >
  <template v-if="props.targetUser.revealTwitterScreenName">            
    <p class="mt-2 mb-4 text-caption" color="grey-darken-1">
      <v-btn id="x-button" class="mr-2" @click="onXAccountButtonClick" icon="mdi-alpha-x"  color="grey" variant="flat" density="compact" />
      <span @click="onXAccountButtonClick">
      {{ props.targetUser.twitterScreenName }}
      </span>
    </p>
  </template>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

#x-button {
  width: 20px;
  height: 20px;
  font-size: 110%;
}

span {
  cursor: pointer;
}
</style>
