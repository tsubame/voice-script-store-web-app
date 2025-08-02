<script lang="ts" setup>
//======================================================
//
// follows.vue フォロー中一覧ページ
//
//======================================================

import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import InfiniteLoading from 'v3-infinite-loading'
import * as CONSTANTS from '@/composables/etc/constants'
import * as phpApiManager from '@/composables/util/phpApiManager'
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

// 対象ユーザ
const _followUsers = ref(new Array<User>())

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(async () => {
  try {
    // クエリパラメータにユーザIDがあればセット
    if (useRoute().query.uid !== undefined) {
      // 数値に変換
      const uid = Number(useRoute().query.uid)

      _followUsers.value = await phpApiManager.useGetReadFollowUsersByUserId(uid)
    } else { 
      // クエリパラメータが空でログインユーザの場合は自分のページを表示
      if (useLoginUserStore().hasLogined()) { 
        _followUsers.value = await phpApiManager.useGetReadFollowUsersByUserId(useLoginUserStore().user.id)        
      }
    }
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
        <v-icon class="mr-2 ml-2 mb-1" color="teal-lighten-1">mdi-pencil</v-icon>フォロー中ユーザ一覧
        <v-divider class="mt-2" />
      </h5>
     
      <div id="follow-users-container">
        <v-list>                          
          <template v-for="user, i in _followUsers" :key="user.id">
              <user-list-item    
              @click="onListItemClick(user.id)"              
              :targetUser="user" 
              :isForMute="false"
              :isForFollow="true"
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
