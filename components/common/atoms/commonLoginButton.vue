<script lang="ts" setup>
//======================================================
//
// commonLoginButton.vue ログインボタン
//
//======================================================

//======================================================
// methods
//======================================================

/**
 * イベント ログインボタンクリック
 * ・ログインダイアログ表示
 */
const onLoginButtonClick = () => {
  try {
    useUiEventStore().uiEvent.isLoginDialogShowing = true
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
  <v-btn color="success"
    @click="onLoginButtonClick"
    >
    <template v-slot:prepend><v-icon color="" class="text-caption">mdi-login</v-icon></template>
    ログイン</v-btn>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>
div {
  position: absolute;
  width: 100%;
  border: solid 0px #999999;
}

#back-button {
  position: fixed;
  /** iOS対応 */
  top: calc(env(safe-area-inset-top) + 14px);

  margin-left: 0px;
  z-index: 10;
  /* 半透明に */
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
