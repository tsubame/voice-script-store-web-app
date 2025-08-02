<script lang="ts" setup>
//======================================================
//
// commonHeaderNotificationIcon.vue 通知アイコン
//
//======================================================

import { reactive, onMounted, computed, watch, ref } from 'vue'
import { useDisplay } from 'vuetify'
import * as  CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager';

//======================================================
// methods
//======================================================

/**
 * イベント アイコンクリック
 */
const onClickNotificationIcon = () => {
  try {
    useUiEventStore().uiEvent.isNotificationDialogShowing = true

    // 通知閲覧日時を更新
    if (useLoginUserStore().hasLogined()) {
      phpApiManager.usePostUpdateUserNotifyPageWatchDate(useLoginUserStore().user, useAccessTokenStore().accessToken)

      // 未読件数をセット
      useUiEventStore().uiEvent.newNotificationCount = 0
    }
  } catch (error) {
    console.log('onClickMenuItem')  
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
  <div id="header-profile-icon-container">
    <!-- 新着通知なし -->
    <template v-if="useUiEventStore().uiEvent.newNotificationCount === 0">
      <v-btn
        @click="onClickNotificationIcon"
        variant="flat"
      >
        <common-bell-icon />
      </v-btn>        
    </template>
    <!-- 通知あり -->
    <template v-else>
      <v-badge 
        id="notification-badge"
        color="success"
        offset-x="4"
        offset-y="4"        
        :content="useUiEventStore().uiEvent.newNotificationCount"
        density="compact"
        @click="onClickNotificationIcon"        
        >         
        <v-btn 
          class="mr-0" 
          color="grey-darken-1" 
          variant="text" 
          rounded
          @click="onClickNotificationIcon"
          >
            <common-bell-icon />          
          </v-btn>
      </v-badge> 
    </template>
  </div>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>
.v-btn {
  width: 40px;
  height: 40px;
  margin-top: 0px;
  font-size: 110%;
}

#notification-badge {
  //position: absolute;
  right: 0px;
  opacity: 0.8;
  //pointer-events: none; /* 子要素に影響を与えないようにする */  
  //z-index: 10;
}

</style>
