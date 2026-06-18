<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useFlashcardStore } from '../stores/flashCardStore'
import { useNotesStore } from '../stores/notesStore'
import { useQuestionStore } from '../stores/questionStore'

const router         = useRouter()
const flashcardStore = useFlashcardStore()
const notesStore     = useNotesStore()
const questionStore  = useQuestionStore()

// ── State ──────────────────────────────────────────────────────────────────
const suchbegriff        = ref('')
const aktiverSuchbegriff = ref('')

// ── Debounce — 300ms warten nach letztem Tastendruck ──────────────────────
const debounceSearch = useDebounceFn((wert) => {
  aktiverSuchbegriff.value = wert
}, 300)

function beiEingabe(event) {
  suchbegriff.value = event.target.value
  debounceSearch(event.target.value)
}

// ── Hilfsfunktion: Suchbegriff im Text enthalten? ─────────────────────────
function trifft(text) {
  if (!aktiverSuchbegriff.value.trim()) return false
  return text?.toLowerCase().includes(aktiverSuchbegriff.value.toLowerCase())
}

// ── Hilfsfunktion: HTML-Tags entfernen für Notiz-Vorschau ─────────────────
function htmlZuPlaintext(html) {
  return html?.replace(/<[^>]*>/g, '').trim() ?? ''
}

// ── Gefilterte Ergebnisse ─────────────────────────────────────────────────
const flashcardErgebnisse = computed(() => {
  if (!aktiverSuchbegriff.value.trim()) return []
  return flashcardStore.flashcards.filter(f =>
    trifft(f.frage) || trifft(f.antwort) || trifft(f.kategorie)
  )
})

const notizenErgebnisse = computed(() => {
  if (!aktiverSuchbegriff.value.trim()) return []
  return notesStore.notes.filter(n =>
    trifft(n.titel) || trifft(htmlZuPlaintext(n.inhalt))
  )
})

const fragenErgebnisse = computed(() => {
  if (!aktiverSuchbegriff.value.trim()) return []
  return questionStore.questions.filter(q =>
    trifft(q.frage) || trifft(q.antwort)
  )
})

const gesamtAnzahl = computed(() =>
  flashcardErgebnisse.value.length +
  notizenErgebnisse.value.length +
  fragenErgebnisse.value.length
)

const keineErgebnisse = computed(() =>
  aktiverSuchbegriff.value.trim() !== '' && gesamtAnzahl.value === 0
)
</script>

<template>
  <div class="search">

    <!-- Header -->
    <h1 class="search__titel">🔍 Suche</h1>

    <!-- Suchfeld -->
    <div class="search__feld-wrapper glass">
      <span class="search__icon">🔍</span>
      <input
        class="search__feld"
        type="text"
        placeholder="Suche in Flashcards, Notizen, Fragen..."
        :value="suchbegriff"
        @input="beiEingabe"
        autofocus
      />
      <button
        v-if="suchbegriff"
        class="search__clear neu-button"
        @click="suchbegriff = ''; aktiverSuchbegriff = ''"
      >
        ✕
      </button>
    </div>

    <!-- Ergebnis-Anzahl -->
    <p v-if="aktiverSuchbegriff && !keineErgebnisse" class="search__anzahl">
      {{ gesamtAnzahl }} Ergebnis{{ gesamtAnzahl === 1 ? '' : 'se' }} für
      „{{ aktiverSuchbegriff }}"
    </p>

    <!-- Keine Ergebnisse -->
    <div v-if="keineErgebnisse" class="search__leer glass">
      <p>Keine Ergebnisse für „{{ aktiverSuchbegriff }}"</p>
      <p class="search__leer-hint">Versuche einen anderen Suchbegriff.</p>
    </div>

    <!-- Flashcard-Ergebnisse -->
    <section v-if="flashcardErgebnisse.length > 0" class="search__gruppe">
      <h2 class="search__gruppe-titel">📚 Flashcards ({{ flashcardErgebnisse.length }})</h2>
      <div class="search__liste">
        <div
          v-for="karte in flashcardErgebnisse"
          :key="karte.id"
          class="search__item glass--card"
          @click="router.push('/library')"
        >
          <p class="search__item-titel">{{ karte.frage }}</p>
          <p class="search__item-vorschau">{{ karte.antwort }}</p>
          <span v-if="karte.kategorie" class="search__item-tag">
            {{ karte.kategorie }}
          </span>
        </div>
      </div>
    </section>

    <!-- Notizen-Ergebnisse -->
    <section v-if="notizenErgebnisse.length > 0" class="search__gruppe">
      <h2 class="search__gruppe-titel">📝 Notizen ({{ notizenErgebnisse.length }})</h2>
      <div class="search__liste">
        <div
          v-for="notiz in notizenErgebnisse"
          :key="notiz.id"
          class="search__item glass--card"
          @click="router.push('/notes')"
        >
          <p class="search__item-titel">{{ notiz.titel }}</p>
          <p class="search__item-vorschau">{{ htmlZuPlaintext(notiz.inhalt) }}</p>
        </div>
      </div>
    </section>

    <!-- Fragen-Ergebnisse -->
    <section v-if="fragenErgebnisse.length > 0" class="search__gruppe">
      <h2 class="search__gruppe-titel">❓ Fragen ({{ fragenErgebnisse.length }})</h2>
      <div class="search__liste">
        <div
          v-for="frage in fragenErgebnisse"
          :key="frage.id"
          class="search__item glass--card"
          @click="router.push('/questions')"
        >
          <p class="search__item-titel">{{ frage.frage }}</p>
          <p class="search__item-vorschau">{{ frage.antwort }}</p>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.search__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

/* Suchfeld */
.search__feld-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  border: var(--border-width-thin) solid var(--glass-border);
}

.search__icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.search__feld {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  font-size: var(--font-size-lg);
  font-family: inherit;
}

.search__feld::placeholder {
  color: var(--color-text-muted);
}

.search__clear {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.search__clear:hover {
  color: var(--color-text);
  background: var(--glass-bg);
}

/* Ergebnis-Anzahl */
.search__anzahl {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Keine Ergebnisse */
.search__leer {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.search__leer-hint {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

/* Ergebnis-Gruppen */
.search__gruppe {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search__gruppe-titel {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.search__liste {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Einzelnes Ergebnis */
.search__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  border: var(--border-width-thin) solid var(--glass-border);
}

.search__item:hover {
  background: var(--glass-bg-strong);
  transform: translateX(4px);
}

.search__item-titel {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.search__item-vorschau {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search__item-tag {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
</style>