<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/ui/AppNavbar.vue'
import AppFooter from './components/ui/AppFooter.vue'
import BlueBooster from './components/chatbot/BlueBooster.vue'
</script>

<template>
  <div class="app-wrapper">
    <AppNavbar />
    <main class="app-main">
      <RouterView />
    </main>
    <AppFooter />
    <BlueBooster />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: var(--transition-base);
}

.app-main {
  flex: 1;
  padding: var(--spacing-xl);
}
</style>