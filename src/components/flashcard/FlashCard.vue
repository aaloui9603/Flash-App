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

        <div class="card" :class="{ 'card--flipped': istUmgedreht }">
            <div class="card__front glass--card">
                <span class="card__badge">Frage</span>
                <p class="card__text">{{ flashcard.frage }}</p>
                <span class="card__kategorie">{{ flashcard.kategorie }}</span>
            </div>

            <!--Rückseite-->
            <div class="card__back glass--card">
                <span class="card__badge card__badge--back">Antwort</span>
                <p class="card__text">{{ flashcard.antwort }}</p>

                <div class="card__actions" @click.stop>
                    <button
                    class="card__btn neu-button"
                    :class="{ 'card__btn--gelernt': flashcard.gelernt}"
                    @click="gelerntToggle"
                    >
                      {{ flashcard.gelernt ? '✅ Gelernt' : '⬜ Noch nicht' }}
                </button>
                <button class="card__btn card__btn--delete neu-button" @click="loeschen">
                    🗑️ Löschen
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.card-wrapper {
  perspective: var(--card-perspective);
  cursor: pointer;
  height: var(--card-height);
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: var(--transition-flip);
}

.card--flipped {
  transform: rotateY(180deg);
}

.card__front,
.card__back {
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

.card__back {
  transform: rotateY(180deg);
}

.card__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.card__badge--back {
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

.card__actions {
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

.card__btn--delete {
  color: var(--color-error);
}
</style>
