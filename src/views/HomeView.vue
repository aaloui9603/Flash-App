<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFlashcardStore } from '../stores/flashCardStore'
import { useNotesStore } from '../stores/notesStore'
import { useQuestionStore } from '../stores/questionStore'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

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

const swiperModule = [Autoplay, Pagination]

const featureSlides = [
  {
    icon:         '🃏',
    titel:        'Glasskarten',
    beschreibung: 'Erstelle Lernkarten mit automatischer Flip-Animation. Vorderseite zeigt die Frage — Rückseite die Antwort.',
    farbe:        '#00CED1',
  },
  {
    icon:         '❓',
    titel:        'Tägliche Fragen',
    beschreibung: 'Bis zu 20 zufällige Fragen täglich — direkt aus deinem persönlichen Fragenkatalog.',
    farbe:        '#B452CD',
  },
  {
    icon:         '📝',
    titel:        'Digitale Notizen',
    beschreibung: 'Erstelle und organisiere Notizen mit Rich-Text-Editor, Farb-Markierungen und Ordner-System.',
    farbe:        '#66CDAA',
  },
  {
    icon:         '🤖',
    titel:        'BlueBooster',
    beschreibung: 'Dein persönlicher KI-Assistent hilft dir beim Lernen — DSGVO-konform und immer verfügbar.',
    farbe:        '#006994',
  },
  {
    icon:         '📊',
    titel:        'Statistiken',
    beschreibung: 'Verfolge deinen Lernfortschritt mit detaillierten Erledigungs- und Beantwortungsquoten.',
    farbe:        '#D02090',
  },
]
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

    <!-- Feature-Slider -->
    <section class="home__slider-bereich">
      <h2 class="home__abschnitt-titel">Features</h2>
      <Swiper
        class="home__swiper"
        :modules="swiperModule"
        :slides-per-view="1"
        :space-between="24"
        :breakpoints="{
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        loop
      >
        <SwiperSlide
          v-for="(slide, index) in featureSlides"
          :key="index"
          class="home__slide"
        >
          <div
            class="home__slide-karte glass--card"
            :style="{ borderTopColor: slide.farbe }"
          >
            <span class="home__slide-icon">{{ slide.icon }}</span>
            <h3 class="home__slide-titel" :style="{ color: slide.farbe }">
              {{ slide.titel }}
            </h3>
            <p class="home__slide-beschreibung">{{ slide.beschreibung }}</p>
          </div>
        </SwiperSlide>
      </Swiper>
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
        <RouterLink to="/library" class="home__schnellzugriff-karte">
          <span class="home__schnellzugriff-icon">📚</span>
          <span class="home__schnellzugriff-label">Bibliothek</span>
        </RouterLink>
        <RouterLink to="/notes" class="home__schnellzugriff-karte">
          <span class="home__schnellzugriff-icon">📝</span>
          <span class="home__schnellzugriff-label">Notizen</span>
        </RouterLink>
        <RouterLink to="/statistics" class="home__schnellzugriff-karte">
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

/* ── Hero ─────────────────────────────────────────────────────────────── */
.home__hero {
  padding: var(--spacing-2xl);
  text-align: center;
  border-radius: var(--radius-lg);
}

.home__titel {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.home__titel-akzent { color: var(--color-primary); }

.home__untertitel {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

/* ── Feature-Slider ───────────────────────────────────────────────────── */
.home__abschnitt-titel {
  color: var(--color-text);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.home__swiper {
  width: 100%;
  padding-bottom: var(--spacing-xl);
}

.home__slide { height: auto; }

.home__slide-karte {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border-top: 3px solid transparent;
  text-align: center;
  height: 100%;
}

.home__slide-icon { font-size: var(--font-size-4xl); }

.home__slide-titel {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.home__slide-beschreibung {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
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
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  text-align: center;
  /* Durch glass--card in glassmorphism.scss gestylt */
}

.home__statistik-icon { font-size: var(--font-size-3xl); }

.home__statistik-zahl {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.home__statistik-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* ── Schnellzugriff — sichtbar anklickbar ─────────────────────────────── */
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
  /* Sichtbare Glasumrandung — zeigt Anklickbarkeit */
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-fast);
}

.home__schnellzugriff-karte:hover {
  background: var(--glass-bg-strong);
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);
}

.home__schnellzugriff-icon { font-size: var(--font-size-4xl); }

.home__schnellzugriff-label {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 767px) {
  .home__titel { font-size: var(--font-size-2xl); }

  .home__statistik {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-xs);
  }

  .home__statistik-karte {
    padding: var(--spacing-sm);
    gap: var(--spacing-xs);
  }

  .home__statistik-icon { font-size: var(--font-size-xl); }
  .home__statistik-zahl { font-size: var(--font-size-xl); }

  .home__schnellzugriff-links {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }

  .home__schnellzugriff-karte { padding: var(--spacing-md); }
  .home__schnellzugriff-icon  { font-size: var(--font-size-2xl); }
}
</style>