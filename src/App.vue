<script setup>
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'

//Dark Mode 
const isDark = useDark()
</script>

<template>
  <div id="app-wrapper">


    <!--App-Header-->

    <main class="app-main">
      <RouterView />
    </main>


    <!--App-Footer-->

    <!--BlueBooster Chatbot-->

  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh; 
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-main {
  flex: 1; 
}
</style>
