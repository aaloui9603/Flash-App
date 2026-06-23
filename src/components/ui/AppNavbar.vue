<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDark, useToggle, onClickOutside } from '@vueuse/core'

const route      = useRoute()
const isDark     = useDark()
const toggleDark = useToggle(isDark)

// ── Burger-Menü ────────────────────────────────────────────────────────
const menuOffen    = ref(false)
const burgerRef    = ref(null) // Referenz auf das Burger-Dropdown-Element

function menuToggle() {
  menuOffen.value = !menuOffen.value
}

// Klick außerhalb schließt das Menü automatisch
onClickOutside(burgerRef, () => {
  menuOffen.value = false
})

// ── Burger-Links ───────────────────────────────────────────────────────
const burgerLinks = [
  { pfad: '/questions',        label: '❓ Tagesfrage'      },
  { pfad: '/statistics',       label: '📊 Statistik'       },
  { pfad: '/fragen-bibliothek', label: '🗂️ Fragen-Bibliothek' },
]
</script>

<template>
  <nav class="navbar glass">

    <!-- Logo -->
    <RouterLink to="/" class="navbar__logo">
      <span class="navbar__logo-text">Flash</span>
      <span class="navbar__logo-akzent">back</span>
    </RouterLink>

    <!-- Hauptnavigation -->
    <ul class="navbar__links">
      <li>
        <RouterLink
          to="/"
          class="navbar__link"
          :class="{ 'navbar__link--aktiv': route.path === '/' }"
        >
          🏠 Home
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/search"
          class="navbar__link"
          :class="{ 'navbar__link--aktiv': route.path === '/search' }"
        >
          🔍 Suche
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/library"
          class="navbar__link"
          :class="{ 'navbar__link--aktiv': route.path === '/library' }"
        >
          📚 Bibliothek
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/katalog"
          class="navbar__link"
          :class="{ 'navbar__link--aktiv': route.path === '/katalog' }"
        >
          🎯 Fragenkatalog
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/notes"
          class="navbar__link"
          :class="{ 'navbar__link--aktiv': route.path === '/notes' }"
        >
          📝 Notizen
        </RouterLink>
      </li>
    </ul>

    <!-- Rechte Seite: Dark-Mode + Burger -->
    <div class="navbar__aktionen">

      <!-- Dark-Mode Toggle -->
      <button class="navbar__toggle neu-button" @click="toggleDark()">
        {{ isDark ? '☀️' : '🌙' }}
      </button>

      <!-- Burger-Bereich (Button + Dropdown zusammen) -->
      <div ref="burgerRef" class="navbar__burger-bereich">

        <button
          class="navbar__burger neu-button"
          :class="{ 'navbar__burger--aktiv': menuOffen }"
          @click="menuToggle"
          aria-label="Menü öffnen"
        >
          {{ menuOffen ? '✕' : '☰' }}
        </button>

        <!-- Dropdown -->
        <div v-show="menuOffen" class="navbar__dropdown glass">
          <RouterLink
            v-for="link in burgerLinks"
            :key="link.pfad"
            :to="link.pfad"
            class="navbar__dropdown-link"
            :class="{ 'navbar__dropdown-link--aktiv': route.path === link.pfad }"
            @click="menuOffen = false"
          >
            {{ link.label }}
          </RouterLink>
        </div>

      </div>
    </div>

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

/* ── Logo ─────────────────────────────────────────────────────────────── */
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

.navbar__logo-text {
  color: var(--color-text);
}

.navbar__logo-akzent {
  color: var(--color-primary);
  margin-left: var(--spacing-xs);
}

/* ── Hauptlinks ───────────────────────────────────────────────────────── */
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

.navbar__link--aktiv {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

/* ── Rechte Aktionen ──────────────────────────────────────────────────── */
.navbar__aktionen {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* ── Dark-Mode Toggle ─────────────────────────────────────────────────── */
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

/* ── Burger-Bereich ───────────────────────────────────────────────────── */
.navbar__burger-bereich {
  position: relative;
}

.navbar__burger {
  width: var(--toggle-size);
  height: var(--toggle-size);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  color: var(--color-text);
  cursor: pointer;
  transition: var(--transition-fast);
}

.navbar__burger:hover,
.navbar__burger--aktiv {
  background: var(--glass-bg-strong);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* ── Dropdown ─────────────────────────────────────────────────────────── */
.navbar__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  min-width: 200px;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  z-index: var(--z-dropdown, 200);
}

.navbar__dropdown-link {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
}

.navbar__dropdown-link:hover {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.navbar__dropdown-link--aktiv {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

@media (max-width: 767px) {
  .navbar__links {
    display:none;
  }

  .navbar {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>