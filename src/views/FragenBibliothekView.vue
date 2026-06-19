<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuestionStore } from '../stores/questionStore'
import { useToast } from 'vue-toastification'

// ── Store ──────────────────────────────────────────────────────────────────
const questionStore = useQuestionStore()
const toast         = useToast()

// ── State ──────────────────────────────────────────────────────────────────
const suchbegriff    = ref('')
const aufgeklappteId = ref(null)

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await questionStore.ladeFragen()
})

// ── Gefilterte Fragen ──────────────────────────────────────────────────────
const gefilterteFragen = computed(() => {
  if (!suchbegriff.value.trim()) return questionStore.questions

  const begriff = suchbegriff.value.toLowerCase()
  return questionStore.questions.filter(q =>
    q.frage?.toLowerCase().includes(begriff) ||
    q.antwort?.toLowerCase().includes(begriff) ||
    q.kategorie?.toLowerCase().includes(begriff)
  )
})

// ── Antwort auf- und zuklappen ─────────────────────────────────────────────
function toggleAntwort(id) {
  aufgeklappteId.value = aufgeklappteId.value === id ? null : id
}

// ── Frage löschen ──────────────────────────────────────────────────────────
async function loeschen(id) {
  await questionStore.frageLoeschen(id)
  toast.success('Frage gelöscht.')

  if (aufgeklappteId.value === id) {
    aufgeklappteId.value = null
  }
}

// ── Datum formatieren ──────────────────────────────────────────────────────
// Fehler 3 behoben: formatDatum (nicht formateDatum)
function formatDatum(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleDateString('de-DE')
}
</script>

<template>
  <div class="bibliothek">

    <!-- Header -->
    <div class="bibliothek__header">
      <h1 class="bibliothek__titel">🗂️ Fragen-Bibliothek</h1>
      <span class="bibliothek__anzahl">
        {{ gefilterteFragen.length }} von {{ questionStore.questions.length }} Fragen
      </span>
    </div>

    <!-- Suchfeld -->
    <div class="bibliothek__suche glass">
      <span class="bibliothek__suche-icon">🔍</span>
      <input
        v-model="suchbegriff"
        class="bibliothek__suche-feld"
        type="text"
        placeholder="Fragen durchsuchen..."
      />
      <button
        v-if="suchbegriff"
        class="bibliothek__suche-clear neu-button"
        @click="suchbegriff = ''"
      >
        ✕
      </button>
    </div>

    <!-- Ladezustand -->
    <p v-if="questionStore.isLoading" class="bibliothek__leer">
      Lädt...
    </p>

    <!-- Leer -->
    <div v-else-if="questionStore.questions.length === 0" class="bibliothek__leer-block glass">
      <p>Noch keine Fragen vorhanden.</p>
      <p class="bibliothek__leer-hint">Füge Fragen über die Tagesfrage-Seite hinzu!</p>
    </div>

    <!-- Keine Suchergebnisse -->
    <div v-else-if="gefilterteFragen.length === 0" class="bibliothek__leer-block glass">
      <p>Keine Fragen für „{{ suchbegriff }}" gefunden.</p>
    </div>

    <!-- Fragen-Liste -->
    <!-- Fehler 2 behoben: v-for (nicht v.for) -->
    <div v-else class="bibliothek__liste">
      <div
        v-for="frage in gefilterteFragen"
        :key="frage.id"
        class="bibliothek__item glass--card"
      >

        <!-- Fehler 5 behoben: Item-Header ist jetzt ein eigener Block -->
        <div class="bibliothek__item-header">
          <div class="bibliothek__item-meta">
            <span
              v-if="frage.angezeigt_am"
              class="bibliothek__badge bibliothek__badge--gesehen"
            >
              <!-- Fehler 3 behoben: formatDatum (nicht formateDatum) -->
              ✅ Gesehen am {{ formatDatum(frage.angezeigt_am) }}
            </span>
            <span v-else class="bibliothek__badge bibliothek__badge--neu">
              🆕 Noch nicht gesehen
            </span>
            <span v-if="frage.kategorie" class="bibliothek__kategorie">
              {{ frage.kategorie }}
            </span>
          </div>

          <div class="bibliothek__item-aktionen">
            <button
              class="bibliothek__aktion-btn neu-button"
              :title="aufgeklappteId === frage.id ? 'Antwort verbergen' : 'Antwort anzeigen'"
              @click="toggleAntwort(frage.id)"
            >
              {{ aufgeklappteId === frage.id ? '▲' : '▼' }}
            </button>
            <button
              class="bibliothek__aktion-btn bibliothek__aktion-btn--loeschen neu-button"
              title="Frage löschen"
              @click="loeschen(frage.id)"
            >
              🗑️
            </button>
          </div>
        </div>

        <!-- Frage-Text — Fehler 5 behoben: außerhalb von item-header -->
        <p class="bibliothek__frage-text">{{ frage.frage }}</p>

        <!-- Antwort — Fehler 5 behoben: außerhalb von item-header -->
        <Transition name="bibliothek-slide">
          <div
            v-if="aufgeklappteId === frage.id"
            class="bibliothek__antwort"
          >
            <span class="bibliothek__antwort-label">💡 Antwort</span>
            <p class="bibliothek__antwort-text">{{ frage.antwort }}</p>
          </div>
        </Transition>

        <!-- Datum — Fehler 5 behoben: außerhalb von item-header -->
        <p class="bibliothek__datum">
          📅 Erstellt am {{ formatDatum(frage.created_at) }}
        </p>

      </div>
    </div>

  </div>
</template>

<style scoped>
.bibliothek {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.bibliothek__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bibliothek__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.bibliothek__anzahl {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.bibliothek__suche {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  border: var(--border-width-thin) solid var(--glass-border);
}

.bibliothek__suche-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.bibliothek__suche-feld {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  font-size: var(--font-size-md);
  font-family: inherit;
}

.bibliothek__suche-feld::placeholder {
  color: var(--color-text-muted);
}

.bibliothek__suche-clear {
  padding: var(--spacing-xs) var(--spacing-sm);
  /* Fehler 4 behoben: --font-size-sm (nicht --front-size-sm) */
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.bibliothek__suche-clear:hover {
  color: var(--color-text);
  background: var(--glass-bg);
}

.bibliothek__leer {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  padding: var(--spacing-2xl);
}

/* Fehler 6 behoben: fehlende Klasse ergänzt */
.bibliothek__leer-block {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.bibliothek__leer-hint {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

.bibliothek__liste {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.bibliothek__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: var(--border-width-thin) solid var(--glass-border);
  transition: var(--transition-fast);
}

.bibliothek__item:hover {
  background: var(--glass-bg-strong);
}

.bibliothek__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.bibliothek__item-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.bibliothek__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}

.bibliothek__badge--gesehen {
  color: var(--color-success);
  background: var(--glass-bg);
}

.bibliothek__badge--neu {
  color: var(--color-primary);
  background: var(--glass-bg);
}

.bibliothek__kategorie {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  background: var(--glass-bg);
}

.bibliothek__item-aktionen {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.bibliothek__aktion-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.bibliothek__aktion-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--color-text);
}

.bibliothek__aktion-btn--loeschen:hover {
  color: var(--color-error);
}

.bibliothek__frage-text {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
}

.bibliothek__antwort {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  border-left: 3px solid var(--color-primary);
}

.bibliothek__antwort-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.bibliothek__antwort-text {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.bibliothek__datum {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  border-top: var(--border-width-thin) solid var(--glass-border);
  padding-top: var(--spacing-sm);
}

/* Fehler 7 behoben: enter-from und leave-to ergänzt */
.bibliothek-slide-enter-active,
.bibliothek-slide-leave-active {
  transition: var(--transition-base);
  overflow: hidden;
}

.bibliothek-slide-enter-from,
.bibliothek-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.bibliothek-slide-enter-to,
.bibliothek-slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>