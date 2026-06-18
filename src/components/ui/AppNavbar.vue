<script setup>
import { RouterLink, useRoute} from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'

const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)

</script>
<template>
    <nav class="navbar glass">
        <RouterLink to="/" class="navbar__logo">
            <span class="navbar__logo-text">Flash</span>
            <span class="navbar__logo-accent">back</span>
        </RouterLink>

        <ul class="navbar__links">
            <li>
                <RouterLink 
                to="/"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/'}"
                >
                🏠 Home 
            </RouterLink>
            </li>
            <li>
                <RouterLink 
                to="/search"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/search'}"
                >
                🔍 Suche
            </RouterLink>
            </li>
            <li>
                <RouterLink
                to="/questions"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/questions'}"               
                >
                ❓ Tagesfrage
            </RouterLink>
            </li>
            <li>
                <RouterLink 
                to="/library"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/library'}"
                >
                📚 Bibliothek
            </RouterLink>
            </li>
            <li>
                <RouterLink
                  to="/statistics"
                  class="navbar__link"
                  :class="{ 'navbar__link--active' : route.path === '/statistics'}"
                  > 
                  Statistik 📊
                </RouterLink>
            </li>
            <li>
                <RouterLink 
                to="/katalog"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/katalog'}"
                >
                🎯  Fragenkatalog 
            </RouterLink>
            </li>
            <li>
                <RouterLink 
                to="/notes"
                class="navbar__link"
                :class="{ 'navbar__link--active': route.path === '/notes'}"
                > 
                📝 Notizen
            </RouterLink>
            </li>
        </ul>

        <button class="navbar__toggle neu-button" @click="toggleDark()">
            {{ isDark ? '☀️' : '🌙' }}
        </button>
    </nav>
</template>
<style scoped>
.navbar {
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding: var(--spacing-md) var(--spacing-xl);
    position: sticky; 
    top: 0; 
    z-index: var(--z-navbar);
}

.navbar__logo {
    font-size: var(--font-size-2xl); 
    font-weight: var(--font-weight-bold); 
}

.navbar__logo-text {
    color: var(--color-text);
}

.navbar__logo-accent {
    color: var(--color-primary); 
    margin-left: var(--spacing-xs);
}

.navbar__links {
    display: flex; 
    gap: var(--spacing-md);
}

.navbar__link {
    color: var(--color-text-secondary); 
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    transition: var(--transition-fast); 
    font-weight: var(--font-weight-medium);
}

.navbar__link:hover {
    color: var(--color-primary); 
    background: var(--glass-bg);
}

.navbar__link--active {
    color: var(--color-primary);
    background: var(--glass-bg-strong);
}

.navbar__toggle {
    width: var(--toggle-size);
    height: var(--toggle-size); 
    border-radius: var(--radius-full);
    font-size: var(--font-size-md); 
    display: flex; 
    align-items: center;
    justify-content: center;
    background: var(--glass-bg);
    border: var(--border-width-thin) solid var(--glass-border);
    color: var(--color-text);
    cursor: pointer;
    transition: var(--transition-fast);
}

.navbar__toggle:hover {
    background: var(--glass-bg-strong);
}
.navbar__logo {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.navbar__logo:hover {
  opacity: var(--opacity-hover);
  transform: scale(1.02);
}

.navbar__logo:active {
  transform: scale(0.97);
}
</style>