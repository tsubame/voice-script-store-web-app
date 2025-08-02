<script lang="ts" setup>
//======================================================
//
// commonBottomNotification..vue 
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
  <v-fade-transition>
    <div 
      id="container" 
      :class="{
        'text-body-2': true, 
        'above-fotter': useScriptStore().targetScript.id !== 0
      }" v-if="useUiEventStore().uiEvent.isBottomNotificationShowing">
        {{ useUiEventStore().uiEvent.bottomNotificationMessage }}
    </div>
  </v-fade-transition>
</template>
<!--
//======================================================
//
// CSS
//
//======================================================
-->
<style lang="scss" scoped>
#container {
  position: fixed;
  right: 10px;
  bottom: 10px; 
  min-width: 100px;
  height: 36px;
  padding: 8px 8px;

  border-radius: 4px;
  color: white;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 100000;
}

.above-fotter {
  bottom: calc($footer-height + 10px) !important;
}

</style>
