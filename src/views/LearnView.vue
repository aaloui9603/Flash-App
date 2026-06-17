<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFlashcardStore } from '../stores/flashCardStore'

const router = useRouter()
const flashcardStore = useFlashcardStore()

const aktuellerIndex = ref(0)
const istUmgedreht = ref(false)
const richtig = ref(0)
const falsch = ref(0)
const fertig = ref(false)

onMounted(async () => {
  await flashcardStore.ladeFlashcards()
  if (flashcardStore.flashcards.length === 0) {
    router.push('/library')
  }
})

const aktuelleKarte = computed(() =>
  flashcardStore.flashcards[aktuellerIndex.value]
)

const fortschritt = computed(() =>
  Math.round((aktuellerIndex.value / flashcardStore.flashcards.length) * 100)
)

// Karte zurücksetzen wenn Index wechselt
watch(aktuellerIndex, () => {
  istUmgedreht.value = false
})

function umdrehen() {
  istUmgedreht.value = !istUmgedreht.value
}

function naechsteKarte(gewusst) {
  if (gewusst) {
    richtig.value++
    flashcardStore.gelerntMarkieren(aktuelleKarte.value.id, true)
  } else {
    falsch.value++
  }

  if (aktuellerIndex.value < flashcardStore.flashcards.length - 1) {
    aktuellerIndex.value++
  } else {
    fertig.value = true
  }
}

function neuStarten() {
  aktuellerIndex.value = 0
  istUmgedreht.value = false
  richtig.value = 0
  falsch.value = 0
  fertig.value = false
}
</script>

<template>
  <div class="learn">

    <!-- Auswertung -->
    <div v-if="fertig" class="learn__auswertung glass">
      <h2 class="learn__auswertung-titel">🎉 Lerneinheit abgeschlossen!</h2>
      <div class="learn__auswertung-stats">
        <div class="learn__auswertung-stat">
          <span class="learn__auswertung-zahl learn__auswertung-zahl--richtig">{{ richtig }}</span>
          <span class="learn__auswertung-label">Gewusst</span>
        </div>
        <div class="learn__auswertung-stat">
          <span class="learn__auswertung-zahl learn__auswertung-zahl--falsch">{{ falsch }}</span>
          <span class="learn__auswertung-label">Nicht gewusst</span>
        </div>
      </div>
      <div class="learn__auswertung-buttons">
        <button class="learn__btn neu-button" @click="neuStarten">
          🔄 Nochmal
        </button>
        <button class="learn__btn neu-button" @click="router.push('/library')">
          📚 Zur Bibliothek
        </button>
      </div>
    </div>

    <!-- Lern-Modus -->
    <template v-else>

      <div class="learn__header">
        <h1 class="learn__titel">🎓 Lern-Modus</h1>
        <span class="learn__zaehler">
          {{ aktuellerIndex + 1 }} / {{ flashcardStore.flashcards.length }}
        </span>
      </div>

      <!-- Fortschrittsbalken -->
      <div class="learn__progress-bar">
        <div
          class="learn__progress-fill"
          :style="{ width: fortschritt + '%' }"
        />
      </div>

      <!-- Karte -->
      <div class="learn__card-wrapper" @click="umdrehen">
        <div class="learn__card" :class="{ 'learn__card--flipped': istUmgedreht }">

          <div class="learn__card-front glass--card">
            <span class="learn__badge">Frage</span>
            <p class="learn__card-text">{{ aktuelleKarte?.frage }}</p>
            <span class="learn__hint">Klicke zum Umdrehen</span>
          </div>

          <div class="learn__card-back glass--card">
            <span class="learn__badge learn__badge--back">Antwort</span>
            <p class="learn__card-text">{{ aktuelleKarte?.antwort }}</p>
          </div>

        </div>
      </div>

      <!-- Buttons -->
      <div v-if="istUmgedreht" class="learn__buttons" @click.stop>
        <button class="learn__btn learn__btn--falsch neu-button" @click="naechsteKarte(false)">
          ❌ Nicht gewusst
        </button>
        <button class="learn__btn learn__btn--richtig neu-button" @click="naechsteKarte(true)">
          ✅ Gewusst
        </button>
      </div>

    </template>
  </div>
</template>

<style scoped>
.learn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.learn__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.learn__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.learn__zaehler {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.learn__progress-bar {
  width: 100%;
  height: 8px;
  background: var(--glass-bg);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.learn__progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: var(--transition-base);
}

.learn__card-wrapper {
  perspective: var(--card-perspective);
  cursor: pointer;
  height: var(--card-height);
}

.learn__card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: var(--transition-flip);
}

.learn__card--flipped {
  transform: rotateY(180deg);
}

.learn__card-front,
.learn__card-back {
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
  padding: var(--spacing-xl);
}

.learn__card-back {
  transform: rotateY(180deg);
}

.learn__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.learn__badge--back {
  color: var(--color-secondary);
}

.learn__card-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  text-align: center;
}

.learn__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.learn__buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.learn__btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  color: var(--color-text);
}

.learn__btn--richtig:hover {
  color: var(--color-success);
}

.learn__btn--falsch:hover {
  color: var(--color-error);
}

.learn__auswertung {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
}

.learn__auswertung-titel {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.learn__auswertung-stats {
  display: flex;
  gap: var(--spacing-2xl);
}

.learn__auswertung-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.learn__auswertung-zahl {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
}

.learn__auswertung-zahl--richtig {
  color: var(--color-success);
}

.learn__auswertung-zahl--falsch {
  color: var(--color-error);
}

.learn__auswertung-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-md);
}

.learn__auswertung-buttons {
  display: flex;
  gap: var(--spacing-md);
}
</style>