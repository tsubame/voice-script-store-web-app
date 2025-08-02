<script lang="ts" setup>
//======================================================
//
// scriptIndexTabButton.vue トップページのタブボタン
//
//======================================================

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  name: string,
  selectedCategoryTabName: string
}>()


</script>
<!--
//======================================================
//
// HTML
//
//======================================================
-->
<template >
  <v-btn
    :class="{
      'selected': props.selectedCategoryTabName === props.name,
      'not-selected': props.selectedCategoryTabName !== props.name,
    }"
    :color="props.selectedCategoryTabName === props.name ? 'teal-lighten-1' : 'white'"
    variant="flat"
    rounded            
    >
    {{ props.name }}
  </v-btn>
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
  margin-right: 8px !important;
  padding: 0px 8px !important;
  font-size: 80%;  
}

.selected {
  border: solid 1px transparent;
  font-weight: bold;
}

.not-selected {
  border: solid 1px #7e7e7e;
}
</style>
