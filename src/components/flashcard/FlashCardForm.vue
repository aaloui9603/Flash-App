<script setup>
import { ref } from 'vue'

const emit = defineEmits(['hinzufuegen'])

const frage = ref('')
const antwort = ref('')
const kategorie = ref('')

function absenden() {
  if (!frage.value.trim() || !antwort.value.trim()) return

  emit('hinzufuegen', {
    frage: frage.value.trim(),
    antwort: antwort.value.trim(),
    kategorie: kategorie.value.trim()
  })

  frage.value = ''
  antwort.value = ''
  kategorie.value = ''
}
</script>

<template>
  <div class="card-form glass">

    <h2 class="card-form__title">Neue Flashcard</h2>

    <div class="card-form__group">
      <label class="card-form__label">Frage</label>
      <textarea
        v-model="frage"
        class="card-form__input"
        placeholder="Deine Frage..."
        rows="3"
      />
    </div>

    <div class="card-form__group">
      <label class="card-form__label">Antwort</label>
      <textarea
        v-model="antwort"
        class="card-form__input"
        placeholder="Die Antwort..."
        rows="3"
      />
    </div>

    <div class="card-form__group">
      <label class="card-form__label">Kategorie (optional)</label>
      <input
        v-model="kategorie"
        class="card-form__input"
        placeholder="z.B. Vue, JavaScript..."
        type="text"
      />
    </div>

    <button
      class="card-form__btn neu-button"
      :disabled="!frage.trim() || !antwort.trim()"
      @click="absenden"
    >
      ➕ Flashcard erstellen
    </button>

  </div>
</template>

<style scoped>
.card-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.card-form__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.card-form__group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.card-form__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.card-form__input {
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  font-size: var(--font-size-md);
  font-family: inherit;
  resize: vertical;
  transition: var(--transition-fast);
}

.card-form__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.card-form__input::placeholder {
  color: var(--color-text-muted);
}

.card-form__btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  align-self: flex-start;
}

.card-form__btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.card-form__btn:hover:not(:disabled) {
  color: var(--color-primary-soft);
  background: var(--glass-bg-strong);
}
</style>