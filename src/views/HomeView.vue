<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFlashcardStore } from '../stores/flashCardStore'
import { useNotesStore } from '../stores/notesStore'
import { useQuestionStore } from '../stores/questionStore'

const flashCardStore = useFlashcardStore()
const notesStore = useNotesStore()
const questionStore = useQuestionStore()

onMounted(async () => {
    await flashCardStore.ladeFlashcards()
    await notesStore.ladeNotes()
    await questionStore.ladeFragen()
})

const gelerntAnzahl = computed(() => 
    flashCardStore.flashcards.filter(f => f.gelernt).length
)

</script>
<template>
    <div class="home">

     <!--Hero-->
     <section class="home__hero glass">
        <h1 class="home__title">
            Welcome to your personal
            <span class="home__title-accent">Flashcard-App</span>
        </h1>
        <p class="home__subtitle">
            Lerne smarter und effektiver - nicht härter. 
        </p>
     </section>

     <!--Statistik-Karten-->
     <section class="home__stats">
        
        <div class="home__stat-card glass--card">
            <span class="home__stat-icon">📚</span>
            <span class="home__stat-number">{{ flashCardStore.flashcards.length }}</span>
            <span class="home__stat-label">Flashcards </span>
        </div>

        <div class="home__stat-card glass--card">
            <span class="home__stat-icon">📝</span>
            <span class="home__stat-number">{{ notesStore.notes.length }}</span>
            <span class="home__stat-label">Notizen</span>
        </div>

        <div class="home__stat-card glass--card">
            <span class="home__stat-icon">❓</span>
            <span class="home__stat-number">{{ questionStore.questions.length }}</span>
            <span class="home__stat-label">Fragen</span>
        </div>

        <div class="home__stat-card glass--card">
            <span class="home__stat-icon">✅</span>
            <span class="home__stat-number">{{ gelerntAnzahl }}</span>
            <span class="home__stat-label">Gelernt</span>
        </div>
     </section>

     <!--Schnellzugriff-->
     <section class="home__quick">
        <h2 class="home__section-title">Schnellzugriff</h2>
        <div class="home__quick-links">

            <RouterLink to="/library" class="home__quick-card glass--card">
                <span class="home__quick-icon">📚</span>
                <span class="home__quick-label">Bibliothek</span>
            </RouterLink>

            <RouterLink to="/notes" class="home__quick-card glass--card">
                <span class="home__quick-icon">📝</span>
                <span class="home__quick-label">Notizen</span>
            </RouterLink>

            <RouterLink to="/statistics" class="home__quick-card glass--card">
                <span class="home__quick-icon">📊</span>
                <span class="home__quick-label">Statistik</span>
            </RouterLink>
        </div>
     </section>
    </div>
</template>
<style scoped>
.home {
    display:flex; 
    flex-direction: column; 
    gap: var(--spacing-xl);
}

.home__hero {
    padding: var(--spacing-2xl);
    text-align: center;
    border-radius: var(--radius-lg);
}

.home__title {
    font-size: var(--font-size-4xl); 
    font-weight: 700; 
    color: var(--color-text); 
    margin-bottom: var(--spacing-md);
}

.home__title-accent {
    color: var(--color-primary);
}

.home__subtitle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
}

.home__stats {
    display: grid; 
    grid-template-columns: repeat(4, 1fr); 
    gap: var(--spacing-md);
}

.home__stat-card {
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: var(--spacing-lg); 
    padding: var(--spacing-lg);
    text-align: center;
}

.home__stat-icon {
    font-size: var(--font-size-3xl); 
}

.home__stat-number {
    font-size: var(--font-size-3xl);
    font-weight: 700; 
    color: var(--color-primary);
}

.home__stat-label {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.home__section-title {
    color: var(--color-text);
    font-size: var(--font-size-2xl);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
}

.home__quick-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.home__quick-card {
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: var(--spacing-sm);
    padding: var(--spacing-xl); 
    text-align: center; 
    text-decoration: none;
}

.home__quick-icon {
    font-size: var(--font-size-4xl); 
}

.home__quick-label {
    color: var(--color-text);
    font-weight: 600;
}






</style>