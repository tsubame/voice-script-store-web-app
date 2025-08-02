<script lang="ts" setup>
//======================================================
//
// mutes.vue ミュート中ユーザ一覧
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
import * as preferenceManager from '@/composables/util/preferenceManager'
import User from '@/composables/type/user'
import { useLoginUserStore } from '@/store/loginUserStore';

//======================================================
// definePageMeta
//======================================================

// ミドルウェアの定義
definePageMeta({
  middleware: ["login-checker"]
})

//======================================================
// vars
//======================================================

const _muteUsers = ref(new Array<User>())

//======================================================
// onMounted
//======================================================


/**
 * onMounted
 * ・台本データを2回に分けて取得
 * ・作者名の一覧をstoreにセット
 */
onMounted(async () => {
  try {
    _muteUsers.value = await phpApiManager.useGetReadMutesByUserId(useLoginUserStore().user.id)
  } catch (error) {
    console.error(error)
  }
})

//======================================================
// methods
//======================================================

/**
 * イベント ユーザのリストクリック
 * 
 * @param uid 
 */
const onListItemClick = (uid: number) => {
  try {
    console.log('onListItemClick')
    const url = CONSTANTS.PAGE_NAME_USER_DETAIL + '?uid=' + uid

    navigateTo(url)
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
  <v-container id="container" class="my-0 py-0 px-0">
    <v-card id="card-container" 
      :class="{
        'pb-12': true,
        'mt-0': true,
        'mb-12': true,
        'no-border': useDisplay().smAndDown.value,
      }"         
      flat
      >
      <header id="header"></header>

      <h5 class="mt-6 px-4 mb-4">
        <v-icon class="mr-2 ml-2 mb-1" color="teal-lighten-1">mdi-pencil</v-icon>ミュート中ユーザ一覧
        <v-divider class="mt-2" />
      </h5>
     
      <div id="follow-users-container">
        <v-list>                          
          <template v-for="user, i in _muteUsers" :key="user.id">
              <user-list-item    
              @click="onListItemClick(user.id)"              
              :targetUser="user" 
              :isForMute="true"
              :isForFollow="false"
              :isFowFollower="false"
              />
            <v-divider class="mt-0" />
          </template>
        </v-list>   
      </div>          
    </v-card>
  </v-container>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style lang="scss" scoped>

#header {
  height: $content_header-height;
  background-repeat: repeat-x;
  background-size: cover;
  background-position: center center;
  /** 半透明の黒に */
  background-color: rgba(0, 0, 0, 0.5);
  background-image: $my-page-header-image-path;
}

#container {
  margin: auto;
  height: 100%;
  max-width: $content-max-width;
}

.v-card {
  height: 100%;
  border: solid 1px $card-border-color;
}

.no-border {
  border: solid 0px #999999 !important;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2) !important;  
}

.v-list {
  background-color: transparent;
}

#follow-users-container {
  margin: auto;
  max-width: 600px;
}

</style>
