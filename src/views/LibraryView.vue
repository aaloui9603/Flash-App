<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore'
import FlashCardForm from '../components/flashcard/FlashCardForm.vue'
import FlashCardList from '../components/flashcard/FlashCardList.vue'

const flashcardStore  = useFlashcardStore()
const suchbegriff     = ref('')
const aktiveKategorie = ref('')
const aktiverOrdner   = ref(null) // null = alle Ordner anzeigen

onMounted(async () => {
  await flashcardStore.ladeFlashcards()
})

// ── Ordner-Farbpalette (identisch zu FlashCardForm) ────────────────────
const ordnerFarben = [
  { name: 'Cyan',        wert: '#00CED1' },
  { name: 'Meerblau',    wert: '#006994' },
  { name: 'Aquamarin',   wert: '#66CDAA' },
  { name: 'VioletRed',   wert: '#D02090' },
  { name: 'Orchid',      wert: '#B452CD' },
  { name: 'Lavendel',    wert: '#FFF0F5' },
  { name: 'IndianRed',   wert: '#FF6A6A' },
  { name: 'SpringGreen', wert: '#76EE00' },
]

// ── Nur Farben anzeigen, die auch wirklich vergeben wurden ────────────
const vorhandeneOrdner = computed(() => {
  const vergeben = flashcardStore.flashcards
    .map(f => f.ordner)
    .filter(o => o !== null && o !== undefined && o !== '')
  const einzigartig = [...new Set(vergeben)]
  return ordnerFarben.filter(f => einzigartig.includes(f.wert))
})

// ── Kategorien für Filter ──────────────────────────────────────────────
const kategorien = computed(() => {
  const alle = flashcardStore.flashcards
    .map(f => f.kategorie)
    .filter(k => k && k.trim() !== '')
  return [...new Set(alle)]
})

// ── Gefilterte Karten (Suche + Kategorie + Ordner) ────────────────────
const gefilterteFlashcards = computed(() => {
  return flashcardStore.flashcards.filter(f => {
    const suchTreffer =
      f.frage.toLowerCase().includes(suchbegriff.value.toLowerCase()) ||
      f.antwort.toLowerCase().includes(suchbegriff.value.toLowerCase())

    const kategorieTreffer =
      aktiveKategorie.value === '' ||
      f.kategorie === aktiveKategorie.value

    const ordnerTreffer =
      aktiverOrdner.value === null ||
      f.ordner === aktiverOrdner.value

    return suchTreffer && kategorieTreffer && ordnerTreffer
  })
})

// ── ordner-Feld wird jetzt mitgegeben ─────────────────────────────────
async function flashcardHinzufuegen(daten) {
  await flashcardStore.flashcardHinzufuegen(
    daten.frage,
    daten.antwort,
    daten.kategorie,
    daten.ordner   // ← neu
  )
}

async function gelerntToggle(id, gelernt) {
  await flashcardStore.gelerntMarkieren(id, gelernt)
}

async function aktualisieren(id, frage, antwort, kategorie, ordner) {
  await flashcardStore.flashcardAktualisieren(id, frage, antwort, kategorie, ordner)
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

          <!-- Suche -->
          <input
            v-model="suchbegriff"
            class="bibliothek__suche"
            placeholder="🔍 Flashcards durchsuchen..."
            type="text"
          />

          <!-- Ordner-Filter -->
          <div
            v-if="vorhandeneOrdner.length > 0"
            class="bibliothek__ordner-filter"
          >
            <button
              class="bibliothek__ordner-btn neu-button"
              :class="{ 'bibliothek__ordner-btn--aktiv': aktiverOrdner === null }"
              @click="aktiverOrdner = null"
            >
              Alle
            </button>
            <button
              v-for="farbe in vorhandeneOrdner"
              :key="farbe.wert"
              class="bibliothek__ordner-kreis"
              :class="{ 'bibliothek__ordner-kreis--aktiv': aktiverOrdner === farbe.wert }"
              :style="{ backgroundColor: farbe.wert }"
              :title="farbe.name"
              @click="aktiverOrdner = farbe.wert"
            />
          </div>

          <!-- Kategorie-Filter -->
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
          @aktualisieren="aktualisieren"
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

/* Ordner-Filter-Zeile */
.bibliothek__ordner-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
}

.bibliothek__ordner-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  border: var(--border-width-thin) solid var(--glass-border);
}

.bibliothek__ordner-btn--aktiv {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
  border-color: var(--color-primary);
}

.bibliothek__ordner-kreis {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.bibliothek__ordner-kreis--aktiv {
  border-color: var(--color-text);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Kategorie-Filter-Zeile */
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

@media (max-width: 1023px) {
  .bibliothek__layout {
    grid-template-columns: 1fr; 
  }

  .bibliothek__kopf {
    flex-direction: column; 
    align-items: flex-start; 
    gap: var(--spacing-sm);
  }
}
</style>