<script setup>
import { computed, onMounted } from 'vue'
import { useFlashcardStore } from '../stores/flashCardStore'
import { useNotesStore } from '../stores/notesStore'
import { useQuestionStore } from '../stores/questionStore'

// ── Stores ─────────────────────────────────────────────────────────────────
const flashcardStore = useFlashcardStore()
const notesStore     = useNotesStore()
const questionStore  = useQuestionStore()

// ── Daten laden ────────────────────────────────────────────────────────────
onMounted(async () => {
  await flashcardStore.ladeFlashcards()
  await notesStore.ladeNotes()
  await questionStore.ladeFragen()
})

// ── Flashcard-Statistik ────────────────────────────────────────────────────
const flashcardsGesamt  = computed(() => flashcardStore.flashcards.length)
const flashcardsGelernt = computed(() =>
  flashcardStore.flashcards.filter(f => f.gelernt).length
)
const flashcardsOffen = computed(() =>
  flashcardsGesamt.value - flashcardsGelernt.value
)
const flashcardQuote = computed(() => {
  if (flashcardsGesamt.value === 0) return 0
  return Math.round((flashcardsGelernt.value / flashcardsGesamt.value) * 100)
})

// ── Tagesfragen-Statistik ──────────────────────────────────────────────────
const fragenGesamt     = computed(() => questionStore.questions.length)
const fragenAngezeigt  = computed(() =>
  questionStore.questions.filter(q => q.angezeigt_am).length
)
const fragenOffen = computed(() =>
  fragenGesamt.value - fragenAngezeigt.value
)
const fragenQuote = computed(() => {
  if (fragenGesamt.value === 0) return 0
  return Math.round((fragenAngezeigt.value / fragenGesamt.value) * 100)
})

// ── Notizen-Statistik ──────────────────────────────────────────────────────
const notizenGesamt = computed(() => notesStore.notes.length)
</script>

<template>
  <div class="statistics">

    <h1 class="statistics__titel">📊 Statistik</h1>

    <!-- ── Flashcards ─────────────────────────────────────────────────── -->
    <section class="statistics__sektion">

      <h2 class="statistics__sektion-titel">📚 Flashcards</h2>

      <!-- Zahlen-Karten -->
      <div class="statistics__karten">
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">📚</span>
          <span class="statistics__karte-zahl">{{ flashcardsGesamt }}</span>
          <span class="statistics__karte-label">Gesamt</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">✅</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--erfolg">
            {{ flashcardsGelernt }}
          </span>
          <span class="statistics__karte-label">Gelernt</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">⏳</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--offen">
            {{ flashcardsOffen }}
          </span>
          <span class="statistics__karte-label">Offen</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">🎯</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--quote">
            {{ flashcardQuote }}%
          </span>
          <span class="statistics__karte-label">Erledigungsquote</span>
        </div>
      </div>

      <!-- Fortschrittsbalken -->
      <div class="statistics__progress glass">
        <div class="statistics__progress-header">
          <span class="statistics__progress-label">Erledigungsquote</span>
          <span class="statistics__progress-wert">{{ flashcardQuote }}%</span>
        </div>
        <div class="statistics__progress-bar">
          <div
            class="statistics__progress-fill statistics__progress-fill--blau"
            :style="{ width: flashcardQuote + '%' }"
          />
        </div>
        <p v-if="flashcardsGesamt === 0" class="statistics__hinweis">
          Noch keine Flashcards vorhanden.
        </p>
      </div>

    </section>

    <!-- ── Tagesfragen ────────────────────────────────────────────────── -->
    <section class="statistics__sektion">

      <h2 class="statistics__sektion-titel">❓ Tagesfragen</h2>

      <!-- Zahlen-Karten -->
      <div class="statistics__karten">
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">❓</span>
          <span class="statistics__karte-zahl">{{ fragenGesamt }}</span>
          <span class="statistics__karte-label">Gesamt</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">✅</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--erfolg">
            {{ fragenAngezeigt }}
          </span>
          <span class="statistics__karte-label">Beantwortet</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">⏳</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--offen">
            {{ fragenOffen }}
          </span>
          <span class="statistics__karte-label">Offen</span>
        </div>
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">🎯</span>
          <span class="statistics__karte-zahl statistics__karte-zahl--quote">
            {{ fragenQuote }}%
          </span>
          <span class="statistics__karte-label">Beantwortungsquote</span>
        </div>
      </div>

      <!-- Fortschrittsbalken -->
      <div class="statistics__progress glass">
        <div class="statistics__progress-header">
          <span class="statistics__progress-label">Beantwortungsquote</span>
          <span class="statistics__progress-wert">{{ fragenQuote }}%</span>
        </div>
        <div class="statistics__progress-bar">
          <div
            class="statistics__progress-fill statistics__progress-fill--cyan"
            :style="{ width: fragenQuote + '%' }"
          />
        </div>
        <p v-if="fragenGesamt === 0" class="statistics__hinweis">
          Noch keine Fragen vorhanden.
        </p>
      </div>

    </section>

    <!-- ── Notizen ────────────────────────────────────────────────────── -->
    <section class="statistics__sektion">

      <h2 class="statistics__sektion-titel">📝 Notizen</h2>

      <div class="statistics__karten">
        <div class="statistics__karte glass--card">
          <span class="statistics__karte-icon">📝</span>
          <span class="statistics__karte-zahl">{{ notizenGesamt }}</span>
          <span class="statistics__karte-label">Gespeicherte Notizen</span>
        </div>
      </div>

    </section>

  </div>
</template>

<style scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  max-width: 900px;
  margin: 0 auto;
}

.statistics__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

/* Sektionen */
.statistics__sektion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.statistics__sektion-titel {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

/* Zahlen-Karten */
.statistics__karten {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.statistics__karte {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
}

.statistics__karte-icon {
  font-size: var(--font-size-2xl);
}

.statistics__karte-zahl {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.statistics__karte-zahl--erfolg {
  color: var(--color-success);
}

.statistics__karte-zahl--offen {
  color: var(--color-warning);
}

.statistics__karte-zahl--quote {
  color: var(--color-primary);
}

.statistics__karte-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Fortschrittsbalken */
.statistics__progress {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.statistics__progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics__progress-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.statistics__progress-wert {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.statistics__progress-bar {
  width: 100%;
  height: 10px;
  background: var(--glass-bg-strong);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.statistics__progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.statistics__progress-fill--blau {
  background: var(--color-primary);
}

.statistics__progress-fill--cyan {
  background: var(--color-answer-correct);
}

.statistics__hinweis {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}


@media (max-width: 767px) {
  .statistics__karten {
    grid-template-columns: repeat(2, 1fr);
  }

  .statistics__titel {
    font-size: var(--font-size-2xl);
  }
}
</style>