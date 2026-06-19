<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'
import { useToast } from 'vue-toastification'

// ── Store ──────────────────────────────────────────────────────────────────
const questionStore = useQuestionStore()
const toast         = useToast()

// ── State ──────────────────────────────────────────────────────────────────
const istUmgedreht      = ref(false)
const heuteBeantwortet  = ref(false)
const generierteFrage   = ref(null) // temporäre API-Frage wenn Supabase leer
const generiert         = ref(false)

const HEUTE_KEY = 'tagesfrage_datum'

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await questionStore.ladeFragen()
  pruefeHeutigenStatus()

  // Wenn keine Fragen in Supabase → automatisch generieren
  if (questionStore.questions.length === 0) {
    await frageAutomatischGenerieren()
  }
})

// ── Tagesfragen-Logik ──────────────────────────────────────────────────────
function pruefeHeutigenStatus() {
  const heute = new Date().toISOString().split('T')[0]
  const gespeichertesDatum = localStorage.getItem(HEUTE_KEY)
  heuteBeantwortet.value = gespeichertesDatum === heute
}

const tagesfrage = computed(() => {
  // Zuerst aus Supabase
  if (questionStore.questions.length > 0) {
    const nochNicht = questionStore.questions.filter(q => !q.angezeigt_am)
    if (nochNicht.length > 0) return nochNicht[0]
    return questionStore.questions[0]
  }
  // Fallback: API-generierte Frage
  return generierteFrage.value
})

// ── Auto-Generierung wenn Supabase leer ───────────────────────────────────
async function frageAutomatischGenerieren() {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Erstelle EINE Lernfrage über Webentwicklung für Einsteiger.
Antworte NUR in diesem JSON-Format ohne Markdown-Backticks:
{
  "frage": "...",
  "antwort": "..."
}`
          }
        ]
      })
    })

    const data   = await response.json()
    const text   = data.content?.[0]?.text ?? ''
    const parsed = JSON.parse(text)

    // Als temporäre Frage setzen — wird auch in Supabase gespeichert
    await questionStore.frageHinzufuegen(
      parsed.frage,
      parsed.antwort,
      'Webentwicklung'
    )

    // Store neu laden
    await questionStore.ladeFragen()
    generiert.value = true
    toast.info('Neue Frage automatisch generiert! 🎯')

  } catch (err) {
    console.error('Auto-Generierung fehlgeschlagen:', err)
  }
}

// ── Karte umdrehen ─────────────────────────────────────────────────────────
function umdrehen() {
  istUmgedreht.value = !istUmgedreht.value
}

// ── Verstanden-Button ──────────────────────────────────────────────────────
async function beantwortet() {
  if (!tagesfrage.value) return

  // Nur in Supabase markieren wenn echte Frage (mit ID)
  if (tagesfrage.value.id) {
    await questionStore.frageAlsAngezeigtMarkieren(tagesfrage.value.id)
  }

  const heute = new Date().toISOString().split('T')[0]
  localStorage.setItem(HEUTE_KEY, heute)
  heuteBeantwortet.value = true
  istUmgedreht.value     = false
}
</script>

<template>
  <div class="questions">

    <h1 class="questions__titel">❓ Tägliche Frage</h1>

    <!-- Heute schon beantwortet -->
    <div v-if="heuteBeantwortet" class="questions__fertig glass">
      <span class="questions__fertig-icon">🌟</span>
      <h2 class="questions__fertig-titel">Für heute erledigt!</h2>
      <p class="questions__fertig-text">
        Du hast deine Tagesfrage bereits beantwortet. Morgen gibt es eine neue!
      </p>
      <p class="questions__fertig-zaehler">
        Noch {{ questionStore.nochNichtAngezeigt.length }} Fragen übrig
      </p>
    </div>

    <!-- Laden -->
    <div v-else-if="questionStore.isLoading" class="questions__leer glass">
      <p>Lädt...</p>
    </div>

    <!-- Tagesfrage -->
    <template v-else-if="tagesfrage">

      <p class="questions__info">
        {{ questionStore.nochNichtAngezeigt.length }} Fragen noch nicht gesehen
        <span v-if="generiert"> — Frage automatisch generiert 🎯</span>
      </p>

      <!-- Karte -->
      <div class="questions__card-wrapper" @click="umdrehen">
        <div
          class="questions__card"
          :class="{ 'questions__card--flipped': istUmgedreht }"
        >

          <!-- Vorderseite -->
          <div class="questions__front glass--card">
            <span class="questions__badge">Frage des Tages</span>
            <p class="questions__card-text">{{ tagesfrage.frage }}</p>
            <span class="questions__hint">Klicke zum Umdrehen</span>
          </div>

          <!-- Rückseite -->
          <div class="questions__back glass--card">
            <span class="questions__badge questions__badge--back">Antwort</span>
            <p class="questions__card-text">{{ tagesfrage.antwort }}</p>
            <button
              class="questions__btn neu-button"
              @click.stop="beantwortet"
            >
              ✅ Verstanden!
            </button>
          </div>

        </div>
      </div>

    </template>

    <!-- Keine Fragen und auch keine Generierung möglich -->
    <div v-else class="questions__leer glass">
      <p>Keine Frage verfügbar.</p>
      <p class="questions__leer-hint">Bitte versuche es erneut.</p>
    </div>

  </div>
</template>

<style scoped>
.questions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 700px;
  margin: 0 auto;
}

.questions__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.questions__info {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* ── Karten-Flip — overflow: visible ist PFLICHT für 3D-Transform ── */
.questions__card-wrapper {
  perspective: var(--card-perspective);
  cursor: pointer;
  height: var(--card-height);
  overflow: visible;  /* Fix: verhindert Clipping der 3D-Animation */
}

.questions__card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: var(--transition-flip);
  overflow: visible;  /* Fix: verhindert Clipping der 3D-Animation */
}

.questions__card--flipped {
  transform: rotateY(180deg);
}

.questions__front,
.questions__back {
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
  overflow: visible;  /* Fix: verhindert Clipping */
}

.questions__back {
  transform: rotateY(180deg);
}

.questions__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.questions__badge--back {
  color: var(--color-secondary);
}

.questions__card-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  text-align: center;
}

.questions__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.questions__btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.questions__leer {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.questions__leer-hint {
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
}

.questions__fertig {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.questions__fertig-icon {
  font-size: var(--font-size-4xl);
}

.questions__fertig-titel {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.questions__fertig-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}

.questions__fertig-zaehler {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>