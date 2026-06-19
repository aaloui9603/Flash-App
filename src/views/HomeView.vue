<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFlashcardStore } from '../stores/flashCardStore'
import { useNotesStore } from '../stores/notesStore'
import { useQuestionStore } from '../stores/questionStore'

const flashCardStore = useFlashcardStore()
const notesStore     = useNotesStore()
const questionStore  = useQuestionStore()

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

    <!-- Hero -->
    <section class="home__hero glass">
      <h1 class="home__titel">
        Welcome to your personal
        <span class="home__titel-akzent">Flashcard-App</span>
      </h1>
      <p class="home__untertitel">
        Lerne smarter und effektiver — nicht härter.
      </p>
    </section>

    <!-- Statistik-Karten -->
    <section class="home__statistik">

      <div class="home__statistik-karte glass--card">
        <span class="home__statistik-icon">📚</span>
        <span class="home__statistik-zahl">{{ flashCardStore.flashcards.length }}</span>
        <span class="home__statistik-label">Flashcards</span>
      </div>

      <div class="home__statistik-karte glass--card">
        <span class="home__statistik-icon">📝</span>
        <span class="home__statistik-zahl">{{ notesStore.notes.length }}</span>
        <span class="home__statistik-label">Notizen</span>
      </div>

      <div class="home__statistik-karte glass--card">
        <span class="home__statistik-icon">❓</span>
        <span class="home__statistik-zahl">{{ questionStore.questions.length }}</span>
        <span class="home__statistik-label">Fragen</span>
      </div>

      <div class="home__statistik-karte glass--card">
        <span class="home__statistik-icon">✅</span>
        <span class="home__statistik-zahl">{{ gelerntAnzahl }}</span>
        <span class="home__statistik-label">Gelernt</span>
      </div>

    </section>

    <!-- Schnellzugriff -->
    <section class="home__schnellzugriff">
      <h2 class="home__abschnitt-titel">Schnellzugriff</h2>
      <div class="home__schnellzugriff-links">

        <RouterLink to="/library" class="home__schnellzugriff-karte glass--card">
          <span class="home__schnellzugriff-icon">📚</span>
          <span class="home__schnellzugriff-label">Bibliothek</span>
        </RouterLink>

        <RouterLink to="/notes" class="home__schnellzugriff-karte glass--card">
          <span class="home__schnellzugriff-icon">📝</span>
          <span class="home__schnellzugriff-label">Notizen</span>
        </RouterLink>

        <RouterLink to="/statistics" class="home__schnellzugriff-karte glass--card">
          <span class="home__schnellzugriff-icon">📊</span>
          <span class="home__schnellzugriff-label">Statistik</span>
        </RouterLink>

      </div>
    </section>

  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.home__hero {
  padding: var(--spacing-2xl);
  text-align: center;
  border-radius: var(--radius-lg);
}

/* Korrektur: font-weight: 700 → var(--font-weight-bold) */
.home__titel {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.home__titel-akzent {
  color: var(--color-primary);
}

.home__untertitel {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.home__statistik {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.home__statistik-karte {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  text-align: center;
}

.home__statistik-icon {
  font-size: var(--font-size-3xl);
}

/* Korrektur: font-weight: 700 → var(--font-weight-bold) */
.home__statistik-zahl {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.home__statistik-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* Korrektur: font-weight: 600 → var(--font-weight-semibold) */
.home__abschnitt-titel {
  color: var(--color-text);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.home__schnellzugriff-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.home__schnellzugriff-karte {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  text-align: center;
  text-decoration: none;
}

.home__schnellzugriff-icon {
  font-size: var(--font-size-4xl);
}


.home__schnellzugriff-label {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}
</style>