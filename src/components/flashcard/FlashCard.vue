<script setup>
import { ref } from 'vue'

const props = defineProps({
  flashcard: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['gelernt-toggle', 'loeschen'])

const istUmgedreht = ref(false)

function umdrehen() {
  istUmgedreht.value = !istUmgedreht.value
}

function gelerntToggle() {
  emit('gelernt-toggle', props.flashcard.id, !props.flashcard.gelernt)
}

function loeschen() {
  emit('loeschen', props.flashcard.id)
}
</script>

<template>
  <div class="card-wrapper" @click="umdrehen">

    <!-- Ordner-Farbindikator oben auf der Karte -->
    <div
      v-if="flashcard.ordner"
      class="card__ordner-indikator"
      :style="{ backgroundColor: flashcard.ordner }"
    />

    <div class="card" :class="{ 'card--umgedreht': istUmgedreht }">

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

/* Farbiger Balken oben — zeigt den Ordner an */
.card__ordner-indikator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  z-index: 1;
}

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
}

.card__btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  border-radius: var(--radius-sm);
}

.card__btn--gelernt {
  color: var(--color-success);
}

.card__btn--loeschen {
  color: var(--color-error);
}
</style>