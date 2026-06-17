<script setup>
import { onMounted } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore';

const flashCardStore = useFlashcardStore()

onMounted(async () => {
    await flashCardStore.ladeFlashcards()
    console.log('Flashcards:', flashCardStore.flashcards)
    console.log('Fehler:', flashCardStore.error)
})


</script>
<template>
    <div class="home-view">
        <h1>Flashcard-App</h1>
        <p v-if="flashCardStore.isLoading">Lädt...</p>
        <p v-else-if="flashCardStore.error">Fehler: {{ flashCardStore.error }}</p>
        <p v-else>Verbindung erfolgreich ✅ ({{ flashCardStore.flashcards.length }} Karten)</p>
    </div>
</template>
<style scoped>
</style>