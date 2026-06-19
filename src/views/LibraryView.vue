<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore'
import FlashCardForm from '../components/flashcard/FlashCardForm.vue'
import FlashCardList from '../components/flashcard/FlashCardList.vue'

const flashcardStore  = useFlashcardStore()
const suchbegriff     = ref('')
const aktiveKategorie = ref('')

onMounted(async () => {
  await flashcardStore.ladeFlashcards()
})

const kategorien = computed(() => {
  const alle = flashcardStore.flashcards
    .map(f => f.kategorie)
    .filter(k => k && k.trim() !== '')
  return [...new Set(alle)]
})

const gefilterteFlashcards = computed(() => {
  return flashcardStore.flashcards.filter(f => {
    const suchTreffer =
      f.frage.toLowerCase().includes(suchbegriff.value.toLowerCase()) ||
      f.antwort.toLowerCase().includes(suchbegriff.value.toLowerCase())
    const kategorieTreffer =
      aktiveKategorie.value === '' ||
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
  <div class="bibliothek">

    <div class="bibliothek__kopf">
      <h1 class="bibliothek__titel">📚 Bibliothek</h1>
      <RouterLink to="/learn" class="bibliothek__lern-btn neu-button">
        🎓 Lern-Modus aktivieren
      </RouterLink>
    </div>

    <div class="bibliothek__layout">

      <aside class="bibliothek__sidebar">
        <FlashCardForm @hinzufuegen="flashcardHinzufuegen" />
      </aside>

      <main class="bibliothek__inhalt">

        <div class="bibliothek__werkzeuge glass">
          <input
            v-model="suchbegriff"
            class="bibliothek__suche"
            placeholder="🔍 Flashcards durchsuchen..."
            type="text"
          />
          <div class="bibliothek__filter">
            <button
              class="bibliothek__filter-btn neu-button"
              :class="{ 'bibliothek__filter-btn--aktiv': aktiveKategorie === '' }"
              @click="aktiveKategorie = ''"
            >
              Alle
            </button>
            <button
              v-for="kategorie in kategorien"
              :key="kategorie"
              class="bibliothek__filter-btn neu-button"
              :class="{ 'bibliothek__filter-btn--aktiv': aktiveKategorie === kategorie }"
              @click="aktiveKategorie = kategorie"
            >
              {{ kategorie }}
            </button>
          </div>
        </div>

        <p class="bibliothek__zaehler">
          {{ gefilterteFlashcards.length }} von {{ flashcardStore.flashcards.length }} Karten
        </p>

        <p v-if="flashcardStore.isLoading" class="bibliothek__laden">
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
.bibliothek {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.bibliothek__kopf {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bibliothek__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.bibliothek__lern-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  text-decoration: none;
}

.bibliothek__lern-btn:hover {
  background: var(--glass-bg-strong);
}

.bibliothek__layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.bibliothek__werkzeuge {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.bibliothek__suche {
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

.bibliothek__suche:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.bibliothek__suche::placeholder {
  color: var(--color-text-muted);
}

.bibliothek__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.bibliothek__filter-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.bibliothek__filter-btn--aktiv {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.bibliothek__zaehler {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.bibliothek__laden {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}
</style>