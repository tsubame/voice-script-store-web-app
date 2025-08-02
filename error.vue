<!--
//======================================================
//
// error.vue
//    Nuxtアプリケーションのエラーページ
//
//======================================================
-->
<template>
  <div class="container">
    <div class="stack">
      <h1>404</h1>
      <p class="error-message">redirecting...</p>
    </div>
  </div>
</template>
<!--
//======================================================
//
// SCSS
//
//======================================================
-->
<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 6rem;
  letter-spacing: 0.5rem;
  text-align: center;
  line-height: 1;
  color: pink;
}

.error-message {
  font-weight: bold;
  color: pink;  
}
</style>