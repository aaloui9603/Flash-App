<script setup>
import FlashCard from './FlashCard.vue'

const props = defineProps({
  flashcards: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['gelernt-toggle', 'loeschen'])

function gelerntToggle(id, gelernt) {
  emit('gelernt-toggle', id, gelernt)
}

function loeschen(id) {
  emit('loeschen', id)
}
</script>

<template>
  <div class="card-list">

    <p v-if="flashcards.length === 0" class="card-list__empty">
      Noch keine Flashcards vorhanden. Erstelle deine erste Karte! 🃏
    </p>

    <div v-else class="card-list__grid">
      <FlashCard
        v-for="flashcard in flashcards"
        :key="flashcard.id"
        :flashcard="flashcard"
        @gelernt-toggle="gelerntToggle"
        @loeschen="loeschen"
      />
    </div>

  </div>
</template>

<style scoped>
.card-list__empty {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  padding: var(--spacing-2xl);
}

.card-list__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}
</style>