<script setup>
import { ref } from 'vue'

const props = defineProps({
  flashcard: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['gelernt-toggle', 'loeschen', 'aktualisieren'])

// ── Flip-Logik ─────────────────────────────────────────────────────────
const istUmgedreht   = ref(false)
const bearbeitungAktiv = ref(false)

// ── Edit-Felder (werden beim Start befüllt) ────────────────────────────
const bearbeitungFrage     = ref('')
const bearbeitungAntwort   = ref('')
const bearbeitungKategorie = ref('')
const bearbeitungOrdner    = ref(null)

// ── Ordner-Farbpalette (identisch zu FlashCardForm) ───────────────────
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

function umdrehen() {
  if (bearbeitungAktiv.value) return // Kein Flip im Edit-Modus
  istUmgedreht.value = !istUmgedreht.value
}

function bearbeitungStarten() {
  // Aktuelle Werte in die Edit-Felder laden
  bearbeitungFrage.value     = props.flashcard.frage
  bearbeitungAntwort.value   = props.flashcard.antwort
  bearbeitungKategorie.value = props.flashcard.kategorie || ''
  bearbeitungOrdner.value    = props.flashcard.ordner || null
  istUmgedreht.value         = false // Karte zurückdrehen
  bearbeitungAktiv.value     = true
}

function bearbeitungAbbrechen() {
  bearbeitungAktiv.value = false
}

function bearbeitungSpeichern() {
  if (!bearbeitungFrage.value.trim() || !bearbeitungAntwort.value.trim()) return

  emit('aktualisieren',
    props.flashcard.id,
    bearbeitungFrage.value.trim(),
    bearbeitungAntwort.value.trim(),
    bearbeitungKategorie.value.trim(),
    bearbeitungOrdner.value
  )

  bearbeitungAktiv.value = false
}

function gelerntToggle() {
  emit('gelernt-toggle', props.flashcard.id, !props.flashcard.gelernt)
}

function loeschen() {
  emit('loeschen', props.flashcard.id)
}
</script>

<template>
  <div class="card-wrapper" :class="{ 'card-wrapper--bearbeitung': bearbeitungAktiv }" @click="umdrehen">

    <!-- Ordner-Farbindikator (nur wenn kein Edit-Modus) -->
    <div
      v-if="flashcard.ordner && !bearbeitungAktiv"
      class="card__ordner-indikator"
      :style="{ backgroundColor: flashcard.ordner }"
    />

    <!-- Edit-Modus: Inline-Formular -->
    <div v-if="bearbeitungAktiv" class="card__bearbeitung glass--card" @click.stop>

      <h3 class="card__bearbeitung-titel">✏️ Bearbeiten</h3>

      <div class="card__bearbeitung-gruppe">
        <label class="card__bearbeitung-label">Frage</label>
        <textarea
          v-model="bearbeitungFrage"
          class="card__bearbeitung-eingabe"
          rows="2"
        />
      </div>

      <div class="card__bearbeitung-gruppe">
        <label class="card__bearbeitung-label">Antwort</label>
        <textarea
          v-model="bearbeitungAntwort"
          class="card__bearbeitung-eingabe"
          rows="2"
        />
      </div>

      <div class="card__bearbeitung-gruppe">
        <label class="card__bearbeitung-label">Kategorie</label>
        <input
          v-model="bearbeitungKategorie"
          class="card__bearbeitung-eingabe"
          type="text"
        />
      </div>

      <!-- Ordner-Auswahl -->
      <div class="card__bearbeitung-gruppe">
        <label class="card__bearbeitung-label">Ordner</label>
        <div class="card__bearbeitung-farben">
          <button
            class="card__bearbeitung-kein neu-button"
            :class="{ 'card__bearbeitung-farbe--aktiv': bearbeitungOrdner === null }"
            @click="bearbeitungOrdner = null"
          >
            Kein Ordner
          </button>
          <button
            v-for="farbe in ordnerFarben"
            :key="farbe.wert"
            class="card__bearbeitung-kreis"
            :class="{ 'card__bearbeitung-farbe--aktiv': bearbeitungOrdner === farbe.wert }"
            :style="{ backgroundColor: farbe.wert }"
            :title="farbe.name"
            @click="bearbeitungOrdner = farbe.wert"
          />
        </div>
      </div>

      <!-- Aktionen -->
      <div class="card__bearbeitung-aktionen">
        <button
          class="card__bearbeitung-btn card__bearbeitung-btn--speichern neu-button"
          :disabled="!bearbeitungFrage.trim() || !bearbeitungAntwort.trim()"
          @click="bearbeitungSpeichern"
        >
          💾 Speichern
        </button>
        <button
          class="card__bearbeitung-btn card__bearbeitung-btn--abbrechen neu-button"
          @click="bearbeitungAbbrechen"
        >
          ✖ Abbrechen
        </button>
      </div>

    </div>

    <!-- Normale Karte (wenn kein Edit-Modus) -->
    <div v-else class="card" :class="{ 'card--umgedreht': istUmgedreht }">

      <!-- Vorderseite -->
      <div class="card__vorderseite glass--card">
        <span class="card__badge">Frage</span>
        <p class="card__text">{{ flashcard.frage }}</p>
        <span class="card__kategorie">{{ flashcard.kategorie }}</span>
      </div>

      <!-- Rückseite -->
      <div class="card__rueckseite glass--card">
        <span class="card__badge card__badge--rueck">Antwort</span>
        <p class="card__text">{{ flashcard.antwort }}</p>

        <div class="card__aktionen" @click.stop>
          <button
            class="card__btn neu-button"
            :class="{ 'card__btn--gelernt': flashcard.gelernt }"
            @click="gelerntToggle"
          >
            {{ flashcard.gelernt ? '✅ Gelernt' : '⬜ Noch nicht' }}
          </button>
          <button
            class="card__btn card__btn--bearbeiten neu-button"
            @click="bearbeitungStarten"
          >
            ✏️ Bearbeiten
          </button>
          <button
            class="card__btn card__btn--loeschen neu-button"
            @click="loeschen"
          >
            🗑️ Löschen
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  position: relative;
  perspective: var(--card-perspective);
  cursor: pointer;
  height: var(--card-height);
}

/* Ordner-Farbbalken oben */
.card__ordner-indikator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  z-index: 1;
}

/* Flip-Karte */
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: var(--transition-flip);
}

.card--umgedreht {
  transform: rotateY(180deg);
}

.card__vorderseite,
.card__rueckseite {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
}

.card__rueckseite {
  transform: rotateY(180deg);
}

.card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.card__badge--rueck {
  color: var(--color-secondary);
}

.card__text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  text-align: center;
}

.card__kategorie {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.card__aktionen {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

.card__btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border-radius: var(--radius-sm);
}

.card__btn--gelernt    { color: var(--color-success); }
.card__btn--bearbeiten { color: var(--color-primary); }
.card__btn--loeschen   { color: var(--color-error); }

/* ── Edit-Modus ─────────────────────────────────────────────────────── */
.card__bearbeitung {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  overflow-y: auto;
  cursor: default;
}

.card__bearbeitung-titel {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.card__bearbeitung-gruppe {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__bearbeitung-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.card__bearbeitung-eingabe {
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-family: inherit;
  resize: none;
}

.card__bearbeitung-eingabe:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Ordner-Farben im Edit-Modus */
.card__bearbeitung-farben {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
}

.card__bearbeitung-kein {
  padding: 2px var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  border: var(--border-width-thin) solid var(--glass-border);
}

.card__bearbeitung-kreis {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.card__bearbeitung-farbe--aktiv {
  border-color: var(--color-text);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Speichern / Abbrechen */
.card__bearbeitung-aktionen {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.card__bearbeitung-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
}

.card__bearbeitung-btn--speichern {
  color: var(--color-primary);
}

.card__bearbeitung-btn--speichern:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.card__bearbeitung-btn--abbrechen {
  color: var(--color-error);
}

.card-wrapper--bearbeitung {
  height: auto; 
  cursor: default; 
}
</style>