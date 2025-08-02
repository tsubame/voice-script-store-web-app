<script lang="ts" setup>
//======================================================
//
// scriptIndexSearchTextBox.vue トップページの検索テキストボックス
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
  <div id="search-text-box-container">
    <v-text-field       
      id="search-text-box"
      v-model="useUiEventStore().uiEvent.searchBarText "
      @click="useUiEventStore().uiEvent.isSearchDialogShowing = true"
      bg-color="white"
      variant="outlined"
      placeholder="検索フォーム"
      density="comfortable"
      hide-details
      readonly
      rounded
      >
      <template v-slot:prepend-inner>
        <v-icon color="blue-lighten-1">mdi-magnify</v-icon>
      </template>
    </v-text-field>
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
#search-text-box-container {
  margin: auto;
  max-width: 440px;
}
</style>
