<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuestionStore } from '../stores/questionStore'
import { useToast } from 'vue-toastification'

const questionStore = useQuestionStore()
const toast         = useToast()

const suchbegriff    = ref('')
const aufgeklappteId = ref(null)

onMounted(async () => {
  await questionStore.ladeFragen()
})

const gefilterteFragen = computed(() => {
  if (!suchbegriff.value.trim()) return questionStore.questions
  const begriff = suchbegriff.value.toLowerCase()
  return questionStore.questions.filter(q =>
    q.frage?.toLowerCase().includes(begriff) ||
    q.antwort?.toLowerCase().includes(begriff) ||
    q.kategorie?.toLowerCase().includes(begriff)
  )
})

function toggleAntwort(id) {
  aufgeklappteId.value = aufgeklappteId.value === id ? null : id
}

async function loeschen(id) {
  await questionStore.frageLoeschen(id)
  toast.success('Frage gelöscht.')
  if (aufgeklappteId.value === id) aufgeklappteId.value = null
}

function formatDatum(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleDateString('de-DE')
}
</script>

<template>
  <div class="bibliothek">

    <!-- Header mit SVG-Buch-Icon -->
    <div class="bibliothek__header">

      <div class="bibliothek__header-links">

        <!-- Glasförmiges Buch-Icon -->
        <div class="bibliothek__buch-wrapper">
          <svg
            class="bibliothek__buch-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="56"
            height="56"
            aria-hidden="true"
          >
            <defs>
              <!-- Farbverlauf -->
              <linearGradient id="buch-verlauf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stop-color="#00BFFF" stop-opacity="1"  />
                <stop offset="50%"  stop-color="#00CED1" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#5F9EA0" stop-opacity="0.8"/>
              </linearGradient>

              <!-- Glas-Verlauf für Cover -->
              <linearGradient id="buch-glas" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="rgba(255,255,255,0.25)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0.05)" />
              </linearGradient>

              <!-- Glow-Filter -->
              <filter id="buch-glow" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Hintergrund-Kreis (Glas) -->
            <circle
              cx="32" cy="32" r="30"
              fill="rgba(0, 191, 255, 0.08)"
              stroke="rgba(0, 191, 255, 0.3)"
              stroke-width="1"
            />

            <!-- Buch-Gruppe -->
            <g filter="url(#buch-glow)">

              <!-- Linke Buchseite -->
              <rect
                x="10" y="14" width="20" height="36"
                rx="3"
                fill="url(#buch-glas)"
                stroke="url(#buch-verlauf)"
                stroke-width="1.5"
              />

              <!-- Rechte Buchseite -->
              <rect
                x="34" y="14" width="20" height="36"
                rx="3"
                fill="url(#buch-glas)"
                stroke="url(#buch-verlauf)"
                stroke-width="1.5"
              />

              <!-- Buchrücken (Mitte) -->
              <rect
                x="28" y="12" width="8" height="40"
                rx="2"
                fill="url(#buch-verlauf)"
                opacity="0.7"
              />

              <!-- Seitenlinien links -->
              <line x1="14" y1="22" x2="26" y2="22" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.6"/>
              <line x1="14" y1="28" x2="26" y2="28" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.5"/>
              <line x1="14" y1="34" x2="26" y2="34" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.4"/>
              <line x1="14" y1="40" x2="26" y2="40" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.3"/>

              <!-- Seitenlinien rechts -->
              <line x1="38" y1="22" x2="50" y2="22" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.6"/>
              <line x1="38" y1="28" x2="50" y2="28" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.5"/>
              <line x1="38" y1="34" x2="50" y2="34" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.4"/>
              <line x1="38" y1="40" x2="50" y2="40" stroke="url(#buch-verlauf)" stroke-width="1" opacity="0.3"/>

            </g>
          </svg>
        </div>

        <div class="bibliothek__header-text">
          <h1 class="bibliothek__titel">Fragen-Bibliothek</h1>
          <span class="bibliothek__anzahl">
            {{ gefilterteFragen.length }} von {{ questionStore.questions.length }} Fragen
          </span>
        </div>

      </div>
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
    <div v-else class="bibliothek__liste">
      <div
        v-for="frage in gefilterteFragen"
        :key="frage.id"
        class="bibliothek__item glass--card"
      >

        <div class="bibliothek__item-header">
          <div class="bibliothek__item-meta">
            <span
              v-if="frage.angezeigt_am"
              class="bibliothek__badge bibliothek__badge--gesehen"
            >
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

        <p class="bibliothek__frage-text">{{ frage.frage }}</p>

        <Transition name="bibliothek-slide">
          <div v-if="aufgeklappteId === frage.id" class="bibliothek__antwort">
            <span class="bibliothek__antwort-label">💡 Antwort</span>
            <p class="bibliothek__antwort-text">{{ frage.antwort }}</p>
          </div>
        </Transition>

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

/* ── Header ───────────────────────────────────────────────────────────── */
.bibliothek__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bibliothek__header-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

/* Glas-Wrapper für Buch-Icon */
.bibliothek__buch-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: var(--border-width-thin) solid rgba(0, 191, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.15);
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.bibliothek__buch-wrapper:hover {
  background: var(--glass-bg-strong);
  box-shadow: 0 0 28px rgba(0, 191, 255, 0.3);
  transform: scale(1.05);
}

.bibliothek__buch-svg {
  display: block;
}

.bibliothek__header-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
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

/* ── Suche ────────────────────────────────────────────────────────────── */
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
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.bibliothek__suche-clear:hover {
  color: var(--color-text);
  background: var(--glass-bg);
}

/* ── Leer-Zustände ────────────────────────────────────────────────────── */
.bibliothek__leer {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  padding: var(--spacing-2xl);
}

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

/* ── Fragen-Liste ─────────────────────────────────────────────────────── */
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

/* ── Slide-Animation ──────────────────────────────────────────────────── */
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

/* ── Mobile ───────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .bibliothek__buch-wrapper {
    width: 56px;
    height: 56px;
  }

  .bibliothek__titel {
    font-size: var(--font-size-2xl);
  }
}
</style>