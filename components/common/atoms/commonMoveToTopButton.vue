<script lang="ts" setup>
//======================================================
//
// commonMoveToTopButton.vue 右下の上に戻るボタン
//
//======================================================

// このY座標以上で表示
const MIN_SHOW_SCROOL_Y = 200;

// ボタンを表示するか
const _showButton = ref(false);

// スクロール位置
let lastScrollPosition = 0;

//======================================================
// onMounted
//======================================================

/**
 * onMounted
 */
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

/**
 * スクロールイベント
 */
const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset;

  // 上にスクロールしているかを判断
  if (currentScrollPosition < lastScrollPosition && MIN_SHOW_SCROOL_Y < currentScrollPosition) {
    _showButton.value = true;
  } else {
    _showButton.value = false;
  }

  lastScrollPosition = currentScrollPosition;
};

//======================================================
// methods
//======================================================

/**
 * イベント ボタンクリック
 */
const onButtonClick = () => {
  try {
    window.scrollTo({
      top: 0,
    })

    //lastScrollPosition = 0
    _showButton.value = false
  } catch (error) {
    console.error(error)
  }
}


//======================================================
// onUnmounted
//======================================================

/**
 * onUnmounted
 */
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

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
    <template v-if="_showButton">

      <div id="container"
        :class="
          {
            'above-fotter': useScriptStore().targetScript.id !== 0
          }
        "      
      >
        <v-btn
          @click="onButtonClick"
          icon="mdi-arrow-up"
        >
          <v-icon color="grey-darken-2">mdi-arrow-up</v-icon>
        </v-btn>
      </div>
    </template>
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
  right: 16px;
  bottom: 10px;
  width: fit-content;
  height: fit-content;
  position: fixed;
  z-index: 9;

  border: solid 0px #999999;
  opacity: 0.8;
}

.above-fotter {
  bottom: calc($footer-height + 10px) !important;
}

//.v-btn {}

</style>
