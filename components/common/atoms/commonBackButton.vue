<script lang="ts" setup>
//======================================================
//
// commonBackButton.vue 左上の戻るボタン
//
//======================================================

//======================================================
// props、emits
//======================================================

// props
const props = defineProps<{
  isFixed: boolean,
  isOutlined: boolean
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
  <div>
    <v-btn id="back-button"
      :class="{
        'is-fixed': props.isFixed,
        'is-not-fixed': !props.isFixed,
        'is-outlined': props.isOutlined,
        'is-mobile': useDisplay().mobile.value
       }"
       :variant="props.isOutlined ? 'outlined' : 'elevated'"
    >
      <v-icon color="grey-darken-2">mdi-arrow-left-thick</v-icon>
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

#back-button {
  position: fixed;
  /** iOS対応 */
  top: calc(env(safe-area-inset-top) + 6px); 
  left: 6px; 

  margin-left: 0px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
}

.is-mobile {
  top: calc(env(safe-area-inset-top) + 6px) !important;
}

.is-outlined {
  border: solid 1px #999999;
}

.is-fixed {
  position: fixed;
}

.is-not-fixed {
  position: absolute;
}
</style>
