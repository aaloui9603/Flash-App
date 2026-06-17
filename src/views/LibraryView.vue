<script setup>
import { onMounted } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore'
import  FlashCardList  from '../components/flashcard/FlashCardList.vue'
import FlashCardForm from '../components/flashcard/FlashCardForm.vue'

const flashcardStore = useFlashcardStore()

onMounted(async () => {
    await flashcardStore.ladeFlashcards()
})

async function flashcardHinzufuegen(daten) {
    await flashcardStore.flashcardHinzufuegen(daten.frage, daten.antwort, daten.kategorie)
}

async function gelerntToggle(id, gelernt) {
    await flashcardStore.gelerntMarkieren(id, gelernt)
}

async function loeschen(id) {
    await flashcardStore.flashcardLoeschen(id)
}
</script>
<template>
    <div class="library">

        <h1 class="library__title">📚 Bibliothek</h1>

        <div class="library__layout">

            <aside class="library__sidebar">
                <FlashCardForm @hinzufuegen="flashcardHinzufuegen" />
            </aside>

            <main class="library__content">
                <p v-if="flashcardStore.isLoading" class="library__loading">
                    Lädt...
                </p>
                <FlashCardList 
                v-else
                :flashcards="flashcardStore.flashcards"
                @gelernt-toggle="gelerntToggle"
                @loeschen="loeschen"
                />
            </main>
        </div>
    </div>
</template>

<style scoped>
.library {
    display:flex;
    flex-direction: column; 
    gap: var(--spacing-xl);
}

.library__title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
}

.library__layout {
    display: grid; 
    grid-template-columns: 1fr 2fr; 
    gap: var(--spacing-xl);
    align-items: start; 
}
.library__loading {
    text-align: center; 
    color: var(--color-text-muted);
    font-size: var(--font-size-lg);
}


</style>