<script setup>
import { ref, onMounted } from 'vue'
import { useNotesStore } from '../stores/notesStore.js'
import NoteCard from '../components/notes/NoteCard.vue'
import NoteEditor from '../components/notes/NoteEditor.vue'

const notesStore = useNotesStore()

const titel = ref('')
const inhalt = ref('')
const bearbeitungsModus = ref(false)
const aktiveNotizId = ref(null)
const formRef = ref(null)

onMounted(async () => {
  await notesStore.ladeNotes()
})

function neueNotiz() {
  titel.value = ''
  inhalt.value = ''
  bearbeitungsModus.value = false
  aktiveNotizId.value = null
}

function notizBearbeiten(notiz) {
  titel.value = notiz.titel
  inhalt.value = notiz.inhalt
  bearbeitungsModus.value = true
  aktiveNotizId.value = notiz.id

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
      null
    )
  } else {
    await notesStore.notizHinzufuegen(
      titel.value.trim(),
      inhalt.value,
      null
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

    <div class="notes__header">
      <h1 class="notes__titel">📝 Notizen</h1>
      <button class="notes__neu-btn neu-button" @click="neueNotiz">
        ➕ Neue Notiz
      </button>
    </div>

    <div class="notes__layout">

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

      <main class="notes__content">

        <p v-if="notesStore.isLoading" class="notes__loading">
          Lädt...
        </p>

        <p v-else-if="notesStore.notes.length === 0" class="notes__leer">
          Noch keine Notizen vorhanden. Erstelle deine erste Notiz! 📝
        </p>

        <div v-else class="notes__grid">
          <NoteCard
            v-for="note in notesStore.notes"
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

.notes__loading,
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
</style>