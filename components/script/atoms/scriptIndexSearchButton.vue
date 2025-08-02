<script lang="ts" setup>
//======================================================
//
// scriptIndexSearchButton.vue トップページの検索ボタン
//
//======================================================

</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template >
  <div id="search-button-container" class="text-center">
    <v-btn     
      id="search-text-button"
      class="font-weight-bold px-8"
      @click="useUiEventStore().uiEvent.isSearchDialogShowing = true"
      color="teal"
      rounded
      >
      <template v-slot:prepend>
        <v-icon>mdi-magnify</v-icon>
      </template>
      検索フォーム
    </v-btn>
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
#search-button-container {
  width: 100%;
  margin: auto;
  border: solid 0px #999999;
}

#search-text-button {
  height: 56px;
  font-size: 110%;
  border-radius: 40px;
}
</style>
