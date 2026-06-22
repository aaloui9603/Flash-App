<script setup>
import { ref } from 'vue'

const emit = defineEmits(['hinzufuegen'])

// ── Formular-Felder ────────────────────────────────────────────────────
const frage     = ref('')
const antwort   = ref('')
const kategorie = ref('')
const ordner    = ref(null) // null = kein Ordner gewählt

// ── Ordner-Farbpalette (8 Farben) ─────────────────────────────────────
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

// ── Formular absenden ──────────────────────────────────────────────────
function absenden() {
  if (!frage.value.trim() || !antwort.value.trim()) return

  emit('hinzufuegen', {
    frage:     frage.value.trim(),
    antwort:   antwort.value.trim(),
    kategorie: kategorie.value.trim(),
    ordner:    ordner.value
  })

  // Felder zurücksetzen
  frage.value     = ''
  antwort.value   = ''
  kategorie.value = ''
  ordner.value    = null
}
</script>

<template>
  <div class="card-form glass">

    <h2 class="card-form__titel">Neue Flashcard</h2>

    <div class="card-form__gruppe">
      <label class="card-form__label">Frage</label>
      <textarea
        v-model="frage"
        class="card-form__eingabe"
        placeholder="Deine Frage..."
        rows="3"
      />
    </div>

    <div class="card-form__gruppe">
      <label class="card-form__label">Antwort</label>
      <textarea
        v-model="antwort"
        class="card-form__eingabe"
        placeholder="Die Antwort..."
        rows="3"
      />
    </div>

    <div class="card-form__gruppe">
      <label class="card-form__label">Kategorie (optional)</label>
      <input
        v-model="kategorie"
        class="card-form__eingabe"
        placeholder="z.B. Vue, JavaScript..."
        type="text"
      />
    </div>

    <!-- Ordner-Farbauswahl -->
    <div class="card-form__gruppe">
      <label class="card-form__label">Ordner (optional)</label>
      <div class="card-form__farben">

        <!-- Kein Ordner -->
        <button
          class="card-form__farbe-kein neu-button"
          :class="{ 'card-form__farbe--aktiv': ordner === null }"
          @click="ordner = null"
        >
          Kein Ordner
        </button>

        <!-- 8 Farbkreise -->
        <button
          v-for="farbe in ordnerFarben"
          :key="farbe.wert"
          class="card-form__farbe-kreis"
          :class="{ 'card-form__farbe--aktiv': ordner === farbe.wert }"
          :style="{ backgroundColor: farbe.wert }"
          :title="farbe.name"
          @click="ordner = farbe.wert"
        />

      </div>
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

.card-form__titel {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.card-form__gruppe {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.card-form__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.card-form__eingabe {
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

.card-form__eingabe:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.card-form__eingabe::placeholder {
  color: var(--color-text-muted);
}

/* Farb-Auswahl-Zeile */
.card-form__farben {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
}

/* "Kein Ordner" Button */
.card-form__farbe-kein {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  border: var(--border-width-thin) solid var(--glass-border);
}

/* Farbkreis */
.card-form__farbe-kreis {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

/* Aktiver Zustand — weißer Ring */
.card-form__farbe--aktiv {
  border-color: var(--color-text);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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