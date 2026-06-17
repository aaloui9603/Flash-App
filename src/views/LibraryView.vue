<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore'
import FlashCardForm from '../components/flashcard/FlashCardForm.vue'
import FlashCardList from '../components/flashcard/FlashCardList.vue'

const flashcardStore = useFlashcardStore()

const suchbegriff = ref('')
const aktiveKategorie = ref('')

onMounted(async () => {
  await flashcardStore.ladeFlashcards()
})

// Alle einzigartigen Kategorien
const kategorien = computed(() => {
  const alle = flashcardStore.flashcards
    .map(f => f.kategorie)
    .filter(k => k && k.trim() !== '')
  return [...new Set(alle)]
})

// Gefilterte Flashcards
const gefilterteFlashcards = computed(() => {
  return flashcardStore.flashcards.filter(f => {
    const suchTreffer = f.frage.toLowerCase().includes(suchbegriff.value.toLowerCase()) ||
                        f.antwort.toLowerCase().includes(suchbegriff.value.toLowerCase())
    const kategorieTreffer = aktiveKategorie.value === '' ||
                             f.kategorie === aktiveKategorie.value
    return suchTreffer && kategorieTreffer
  })
})

async function flashcardHinzufuegen(daten) {
  await flashcardStore.flashcardHinzufuegen(daten.frage, daten.antwort, daten.kategorie)
}

async function gelerntToggle(id, gelernt) {
  await flashcardStore.gelerntMarkieren(id, gelernt)
}

async function loeschen(id) {
  await flashcardStore.flashcardLoeschen(id)
}
</script>

<template>
  <div class="library">

    <h1 class="library__title">📚 Bibliothek</h1>

    <div class="library__layout">

      <aside class="library__sidebar">
        <FlashCardForm @hinzufuegen="flashcardHinzufuegen" />
      </aside>

      <main class="library__content">

        <!-- Suche + Filter -->
        <div class="library__toolbar glass">

          <input
            v-model="suchbegriff"
            class="library__search"
            placeholder="🔍 Flashcards durchsuchen..."
            type="text"
          />

          <div class="library__filter">
            <button
              class="library__filter-btn neu-button"
              :class="{ 'library__filter-btn--active': aktiveKategorie === '' }"
              @click="aktiveKategorie = ''"
            >
              Alle
            </button>
            <button
              v-for="kategorie in kategorien"
              :key="kategorie"
              class="library__filter-btn neu-button"
              :class="{ 'library__filter-btn--active': aktiveKategorie === kategorie }"
              @click="aktiveKategorie = kategorie"
            >
              {{ kategorie }}
            </button>
          </div>

        </div>

        <!-- Ergebnis-Info -->
        <p class="library__count">
          {{ gefilterteFlashcards.length }} von {{ flashcardStore.flashcards.length }} Karten
        </p>

        <!-- Flashcard Liste -->
        <p v-if="flashcardStore.isLoading" class="library__loading">
          Lädt...
        </p>
        <FlashCardList
          v-else
          :flashcards="gefilterteFlashcards"
          @gelernt-toggle="gelerntToggle"
          @loeschen="loeschen"
        />

      </main>
    </div>
  </div>
</template>

<style scoped>
.library {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.library__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.library__layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.library__toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.library__search {
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  font-size: var(--font-size-md);
  font-family: inherit;
  transition: var(--transition-fast);
  width: 100%;
}

.library__search:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.library__search::placeholder {
  color: var(--color-text-muted);
}

.library__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.library__filter-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.library__filter-btn--active {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.library__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.library__loading {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}
</style>