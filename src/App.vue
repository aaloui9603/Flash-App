<script setup>
import { RouterView } from 'vue-router'
import { useDark } from '@vueuse/core'
import AppNavbar from './components/ui/AppNavbar.vue'

const isDark = useDark()
</script>

<template>
  <div class="app-wrapper">
    <AppNavbar />
    <main class="app-main">
      <RouterView />
    </main>
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