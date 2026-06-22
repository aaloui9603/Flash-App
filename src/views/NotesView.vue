<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '../stores/notesStore.js'
import NoteCard from '../components/notes/NoteCard.vue'
import NoteEditor from '../components/notes/NoteEditor.vue'

const notesStore = useNotesStore()

// ── State ──────────────────────────────────────────────────────────────────
const titel             = ref('')
const inhalt            = ref('')
const bearbeitungsModus = ref(false)
const aktiveNotizId     = ref(null)
const formRef           = ref(null)
const gewaehlterOrdner  = ref(null)
const filterOrdner      = ref(null)

// ── Ordner-Palette ─────────────────────────────────────────────────────────
const ORDNER_PALETTE = [
  { schluessel: 'cyan',        label: 'Cyan',        farbe: 'var(--ordner-cyan)'        },
  { schluessel: 'meerblau',    label: 'Meerblau',    farbe: 'var(--ordner-meerblau)'    },
  { schluessel: 'aquamarin',   label: 'Aquamarin',   farbe: 'var(--ordner-aquamarin)'   },
  { schluessel: 'violetred',   label: 'VioletRed',   farbe: 'var(--ordner-violetred)'   },
  { schluessel: 'orchid',      label: 'Orchid',      farbe: 'var(--ordner-orchid)'      },
  { schluessel: 'lavendel',    label: 'Lavendel',    farbe: 'var(--ordner-lavendel)'    },
  { schluessel: 'indianred',   label: 'IndianRed',   farbe: 'var(--ordner-indianred)'   },
  { schluessel: 'springgreen', label: 'SpringGreen', farbe: 'var(--ordner-springgreen)' }
]

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await notesStore.ladeNotes()
})

// ── Gefilterter Notizen-Array ──────────────────────────────────────────────
// Fix: n.farbe statt n.ordner — Supabase-Spalte heißt 'farbe'
const gefilterteNotes = computed(() => {
  if (!filterOrdner.value) return notesStore.notes
  return notesStore.notes.filter(n => n.farbe === filterOrdner.value)
})

// ── Formular-Funktionen ────────────────────────────────────────────────────
function neueNotiz() {
  titel.value             = ''
  inhalt.value            = ''
  gewaehlterOrdner.value  = null
  bearbeitungsModus.value = false
  aktiveNotizId.value     = null
}

function notizBearbeiten(notiz) {
  titel.value             = notiz.titel
  inhalt.value            = notiz.inhalt
  // Fix: notiz.farbe statt notiz.ordner — Supabase-Spalte heißt 'farbe'
  gewaehlterOrdner.value  = notiz.farbe ?? null
  bearbeitungsModus.value = true
  aktiveNotizId.value     = notiz.id

  setTimeout(() => {
    formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
}

async function speichern() {
  if (!titel.value.trim()) return

  if (bearbeitungsModus.value && aktiveNotizId.value) {
    await notesStore.notizAktualisieren(
      aktiveNotizId.value,
      titel.value.trim(),
      inhalt.value,
      gewaehlterOrdner.value
    )
  } else {
    await notesStore.notizHinzufuegen(
      titel.value.trim(),
      inhalt.value,
      gewaehlterOrdner.value
    )
  }
  neueNotiz()
}

async function loeschen(id) {
  await notesStore.notizLoeschen(id)
}
</script>

<template>
  <div class="notes">

    <!-- Header -->
    <div class="notes__header">
      <h1 class="notes__titel">📝 Notizen</h1>
      <button class="notes__neu-btn neu-button" @click="neueNotiz">
        ➕ Neue Notiz
      </button>
    </div>

    <!-- Ordner-Filter -->
    <div class="notes__filter glass">
      <button
        class="notes__filter-btn neu-button"
        :class="{ 'notes__filter-btn--aktiv': filterOrdner === null }"
        @click="filterOrdner = null"
      >
        Alle
      </button>
      <button
        v-for="ordner in ORDNER_PALETTE"
        :key="ordner.schluessel"
        class="notes__filter-btn neu-button"
        :class="{ 'notes__filter-btn--aktiv': filterOrdner === ordner.schluessel }"
        :style="filterOrdner === ordner.schluessel
          ? { background: ordner.farbe, color: 'var(--color-schwarz)' }
          : {}"
        @click="filterOrdner = ordner.schluessel"
      >
        <span
          class="notes__filter-punkt"
          :style="{ background: ordner.farbe }"
        />
        {{ ordner.label }}
      </button>
    </div>

    <!-- Layout -->
    <div class="notes__layout">

      <!-- Formular -->
      <aside class="notes__sidebar">
        <div class="notes__form glass" ref="formRef">

          <h2 class="notes__form-titel">
            {{ bearbeitungsModus ? '✏️ Notiz bearbeiten' : '➕ Neue Notiz' }}
          </h2>

          <div class="notes__form-group">
            <label class="notes__label">Titel</label>
            <input
              v-model="titel"
              class="notes__input"
              placeholder="Titel der Notiz..."
              type="text"
            />
          </div>

          <div class="notes__form-group">
            <label class="notes__label">Ordner (optional)</label>
            <div class="notes__ordner-auswahl">
              <button
                class="notes__ordner-btn neu-button"
                :class="{ 'notes__ordner-btn--aktiv': gewaehlterOrdner === null }"
                @click="gewaehlterOrdner = null"
              >
                Kein Ordner
              </button>
              <button
                v-for="ordner in ORDNER_PALETTE"
                :key="ordner.schluessel"
                class="notes__ordner-btn neu-button"
                :class="{ 'notes__ordner-btn--aktiv': gewaehlterOrdner === ordner.schluessel }"
                :title="ordner.label"
                @click="gewaehlterOrdner = ordner.schluessel"
              >
                <span
                  class="notes__ordner-farbe"
                  :style="{ background: ordner.farbe }"
                />
              </button>
            </div>
          </div>

          <div class="notes__form-group">
            <label class="notes__label">Inhalt</label>
            <NoteEditor v-model="inhalt" />
          </div>

          <div class="notes__form-buttons">
            <button
              class="notes__btn neu-button"
              :disabled="!titel.trim()"
              @click="speichern"
            >
              💾 Speichern
            </button>
            <button
              v-if="bearbeitungsModus"
              class="notes__btn notes__btn--abbrechen neu-button"
              @click="neueNotiz"
            >
              ✕ Abbrechen
            </button>
          </div>

        </div>
      </aside>

      <!-- Notizen-Grid -->
      <main class="notes__content">

        <p v-if="notesStore.isLoading" class="notes__leer">
          Lädt...
        </p>

        <p v-else-if="gefilterteNotes.length === 0" class="notes__leer">
          {{ filterOrdner
            ? 'Keine Notizen in diesem Ordner.'
            : 'Noch keine Notizen vorhanden. Erstelle deine erste Notiz! 📝'
          }}
        </p>

        <div v-else class="notes__grid">
          <NoteCard
            v-for="note in gefilterteNotes"
            :key="note.id"
            :note="note"
            @bearbeiten="notizBearbeiten"
            @loeschen="loeschen"
          />
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.notes {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.notes__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notes__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.notes__neu-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.notes__neu-btn:hover {
  background: var(--glass-bg-strong);
}

.notes__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  align-items: center;
}

.notes__filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.notes__filter-btn--aktiv {
  color: var(--color-text);
  background: var(--glass-bg-strong);
}

.notes__filter-punkt {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.notes__layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-xl);
  align-items: start;
}

.notes__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  position: sticky;
  top: var(--spacing-xl);
}

.notes__form-titel {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.notes__form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.notes__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.notes__input {
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  font-size: var(--font-size-md);
  font-family: inherit;
  transition: var(--transition-fast);
}

.notes__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.notes__input::placeholder {
  color: var(--color-text-muted);
}

.notes__ordner-auswahl {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
}

.notes__ordner-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.notes__ordner-btn--aktiv {
  background: var(--glass-bg-strong);
  color: var(--color-text);
}

.notes__ordner-farbe {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  border: var(--border-width-thin) solid var(--glass-border);
}

.notes__form-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.notes__btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.notes__btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.notes__btn--abbrechen {
  color: var(--color-error);
}

.notes__leer {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  padding: var(--spacing-2xl);
}

.notes__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  align-items: start;
}

@media (max-width: 1023px) {
  .notes__layout {
    grid-template-columns: 1fr; 
  }

  .notes__form {
    position: static;
  }
}

@media (max-width: 767px) {
  .notes__grid {
    grid-template-columns: 1fr; 
  }

  .notes__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .notes__filter {
    overflow-x: auto; 
    flex-wrap: nowrap;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .notes__grid {
    grid-template-columns: repeat(2, 1fr); 
  }
}
</style>