<script lang="ts" setup>
//======================================================
//
// userListItem.vue ユーザのリストアイテム
// ミュート中ユーザ一覧、フォロー中ユーザ一覧、フォロワー一覧の全てで使用
//
//======================================================

import { computed, ref } from "vue";
import * as favScriptsStore from '@/store/favScriptsStore'
import * as loginUserStore from '@/store/loginUserStore'
import User from "@/composables/type/user"
import * as phpApiManager from '@/composables/util/phpApiManager';

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  targetUser: User,
  isForMute: boolean,
  isForFollow: boolean,
  isFowFollower: boolean
}>()

//======================================================
// vars
//======================================================


//======================================================
// onMounted
//======================================================

/**
 * onMounted.
 */
onMounted(() => {
  try {

  } catch (error) {
    console.error(error)
  }
})


</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template>
  <v-list-item class="my-0 mx-0">
    <div class="user-list-item-prepend-container">
      <!-- プロフィール画像 -->
      <div class="proile-image-container">
        <v-img :src="props.targetUser.profileImageUrl" />
      </div>
      <!-- 名前 -->
      <div class="user-name-container ml-3">          
        {{ props.targetUser.name }}
      </div>      
    </div>

    <div class="user-list-item-append-container text-caption">
      <!-- ミュートボタン -->
      <template v-if="props.isForMute">
        <user-mute-button :targetUser="props.targetUser" :isSmallSize="true" />
      </template>

      <!-- フォローボタン -->
      <template v-if="props.isForFollow || props.isFowFollower">
        <user-follow-button :targetUser="props.targetUser" :isSmallSize="true"  />
      </template>      
    </div>
  </v-list-item> 
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>

.v-list-item {
  display: flex;
  position: relative;
  align-items: center;  
  height: 80px;
}

.user-list-item-prepend-container {
  display: flex;
  align-items: center;
}

.proile-image-container {
  display: flex;  
  height: 100%;
  align-items: center; /* 追加 */
  border: solid 0px #999999;
}

.v-img {
  width: 50px;
  border-radius: 50%;
}

.user-name-container {
  display: flex;  
  align-items: center;
  font-size: 90%;
}

.user-list-item-append-container {
  position: absolute;
  top: 25px;
  right: 20px;
}
</style>
