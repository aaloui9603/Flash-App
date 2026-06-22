<script setup>
import FlashCard from './FlashCard.vue'

const props = defineProps({
  flashcards: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['gelernt-toggle', 'loeschen', 'aktualisieren'])

function gelerntToggle(id, gelernt) {
  emit('gelernt-toggle', id, gelernt)
}

function loeschen(id) {
  emit('loeschen', id)
}

function aktualisieren(id, frage, antwort, kategorie, ordner) {
  emit('aktualisieren', id, frage, antwort, kategorie, ordner)
}
</script>

<template>
  <div class="card-list">

    <p v-if="flashcards.length === 0" class="card-list__leer">
      Noch keine Flashcards vorhanden. Erstelle deine erste Karte! 🃏
    </p>

    <div v-else class="card-list__grid">
      <FlashCard
        v-for="flashcard in flashcards"
        :key="flashcard.id"
        :flashcard="flashcard"
        @gelernt-toggle="gelerntToggle"
        @loeschen="loeschen"
        @aktualisieren="aktualisieren"
      />
    </div>

  </div>
</template>

<style scoped>
.card-list__leer {
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

@media (max-width: 639px) {
  .card-list__grid {
    grid-template-columns: 1fr; 
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .card-list__grid {
    grid-template-columns: repeat(2, 1fr); 
  }
}
</style>