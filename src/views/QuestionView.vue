<script setup>
import { ref, onMounted } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'
import { useToast } from 'vue-toastification'

const questionStore = useQuestionStore()
const toast         = useToast()

// ── State ──────────────────────────────────────────────────────────────────
const istUmgedreht        = ref(false)
const generiert           = ref(false)
const tagesZaehler        = ref(0)
const limitUeberschritten = ref(false)
const aktiveFrage         = ref(null)
const heuteGezeigteIds    = ref(new Set())

// ── localStorage-Keys ──────────────────────────────────────────────────────
const HEUTE_KEY     = 'tagesfrage_datum'
const ZAEHLER_KEY   = 'tagesfrage_zaehler'
const HEUTE_IDS_KEY = 'tagesfrage_heute_ids'
const MAX_FRAGEN    = 20

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  await questionStore.ladeFragen()
  pruefeHeutigenStatus()

  if (questionStore.questions.length === 0) {
    await frageAutomatischGenerieren()
  } else {
    zufaelligeFrage()
  }
})

// ── Tagesstatus prüfen ─────────────────────────────────────────────────────
function pruefeHeutigenStatus() {
  const heute              = new Date().toISOString().split('T')[0]
  const gespeichertesDatum = localStorage.getItem(HEUTE_KEY)

  if (gespeichertesDatum === heute) {
    tagesZaehler.value = parseInt(localStorage.getItem(ZAEHLER_KEY) ?? '0')
    const idsJson = localStorage.getItem(HEUTE_IDS_KEY)
    if (idsJson) {
      heuteGezeigteIds.value = new Set(JSON.parse(idsJson))
    }
  } else {
    tagesZaehler.value     = 0
    heuteGezeigteIds.value = new Set()
    localStorage.setItem(HEUTE_KEY, heute)
    localStorage.setItem(ZAEHLER_KEY, '0')
    localStorage.removeItem(HEUTE_IDS_KEY)
  }

  limitUeberschritten.value = tagesZaehler.value >= MAX_FRAGEN
}

// ── Heute gesehene IDs speichern ──────────────────────────────────────────
function speichereHeuteIds() {
  localStorage.setItem(HEUTE_IDS_KEY, JSON.stringify([...heuteGezeigteIds.value]))
}

// ── Zufällige Frage wählen ─────────────────────────────────────────────────
function zufaelligeFrage() {
  const nochNichtHeute = questionStore.questions.filter(
    q => !heuteGezeigteIds.value.has(q.id)
  )

  if (nochNichtHeute.length > 0) {
    const idx = Math.floor(Math.random() * nochNichtHeute.length)
    aktiveFrage.value = nochNichtHeute[idx]
    return
  }

  // Alle heute gesehen → Set zurücksetzen und neu beginnen
  heuteGezeigteIds.value.clear()
  localStorage.removeItem(HEUTE_IDS_KEY)

  if (questionStore.questions.length > 0) {
    const idx = Math.floor(Math.random() * questionStore.questions.length)
    aktiveFrage.value = questionStore.questions[idx]
    return
  }

  aktiveFrage.value = null
}

// ── Auto-Generierung wenn Supabase leer oder alle gesehen ────────────────
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

    await questionStore.frageHinzufuegen(
      parsed.frage,
      parsed.antwort,
      'Webentwicklung'
    )

    await questionStore.ladeFragen()
    generiert.value = true
    toast.info('Neue Frage automatisch generiert! 🎯')
    zufaelligeFrage()

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
  if (!aktiveFrage.value) return

  heuteGezeigteIds.value.add(aktiveFrage.value.id)
  speichereHeuteIds()

  if (aktiveFrage.value.id) {
    await questionStore.frageAlsAngezeigtMarkieren(aktiveFrage.value.id)
  }

  tagesZaehler.value++
  localStorage.setItem(ZAEHLER_KEY, String(tagesZaehler.value))
  localStorage.setItem(HEUTE_KEY, new Date().toISOString().split('T')[0])

  istUmgedreht.value = false

  if (tagesZaehler.value >= MAX_FRAGEN) {
    limitUeberschritten.value = true
    toast.warning('Stopp! Tägliche Learning Questions überschritten! 🛑')
    return
  }

  toast.success(`Gut gemacht! ${tagesZaehler.value} von ${MAX_FRAGEN} Fragen heute. ✅`)

  // Noch ungesehene Fragen heute?
  const nochVerfuegbar = questionStore.questions.filter(
    q => !heuteGezeigteIds.value.has(q.id)
  )

  if (nochVerfuegbar.length === 0) {
    // Keine Fragen mehr → automatisch neue generieren
    toast.info('Alle Fragen gesehen — neue Frage wird generiert... 🎯')
    await frageAutomatischGenerieren()
  } else {
    zufaelligeFrage()
  }
}
</script>

<template>
  <div class="questions">

    <h1 class="questions__titel">❓ Tägliche Frage</h1>

    <!-- Limit überschritten -->
    <div v-if="limitUeberschritten" class="questions__limit glass">
      <span class="questions__limit-icon">🛑</span>
      <h2 class="questions__limit-titel">
        Stopp! Tägliche Learning Questions überschritten!
      </h2>
      <p class="questions__limit-text">
        Du hast heute bereits {{ MAX_FRAGEN }} Fragen beantwortet.
        Morgen geht es weiter — gut gemacht! 💪
      </p>
      <p class="questions__limit-hinweis">
        Noch {{ questionStore.nochNichtAngezeigt.length }} Fragen warten auf dich.
      </p>
    </div>

    <!-- Laden -->
    <div v-else-if="questionStore.isLoading" class="questions__leer glass">
      <p>Lädt...</p>
    </div>

    <!-- Tagesfrage -->
    <template v-else-if="aktiveFrage">

      <div class="questions__fortschritt">
        <span class="questions__zaehler">
          {{ tagesZaehler }} / {{ MAX_FRAGEN }} Fragen heute
        </span>
        <div class="questions__fortschritt-balken">
          <div
            class="questions__fortschritt-fuell"
            :style="{ width: (tagesZaehler / MAX_FRAGEN * 100) + '%' }"
          />
        </div>
        <span v-if="generiert" class="questions__generiert">
          Frage automatisch generiert 🎯
        </span>
      </div>

      <div class="questions__card-wrapper" @click="umdrehen">
        <div
          class="questions__card"
          :class="{ 'questions__card--flipped': istUmgedreht }"
        >
          <div class="questions__front glass--card">
            <span class="questions__badge">Frage des Tages</span>
            <p class="questions__card-text">{{ aktiveFrage.frage }}</p>
            <span class="questions__hint">Klicke zum Umdrehen</span>
          </div>

          <div class="questions__back glass--card">
            <span class="questions__badge questions__badge--back">Antwort</span>
            <p class="questions__card-text">{{ aktiveFrage.antwort }}</p>
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

    <!-- Laden neue Frage -->
    <div v-else-if="questionStore.isLoading" class="questions__leer glass">
      <p>Neue Frage wird generiert...</p>
    </div>

    <!-- Keine Fragen -->
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

.questions__limit {
  padding: var(--spacing-2xl);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  border: var(--border-width-thin) solid var(--color-warning);
}

.questions__limit-icon { font-size: var(--font-size-4xl); }

.questions__limit-titel {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-warning);
}

.questions__limit-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
}

.questions__limit-hinweis {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.questions__fortschritt {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.questions__zaehler {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.questions__fortschritt-balken {
  width: 100%;
  height: 6px;
  background: var(--glass-bg-strong);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.questions__fortschritt-fuell {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.questions__generiert {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.questions__card-wrapper {
  perspective: var(--card-perspective);
  cursor: pointer;
  height: var(--card-height);
  overflow: visible;
}

.questions__card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: var(--transition-flip);
  overflow: visible;
}

.questions__card--flipped { transform: rotateY(180deg); }

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
  overflow: visible;
}

.questions__back { transform: rotateY(180deg); }

/* Hover-Transform von glass--card deaktivieren */
.questions__front:hover { transform: none; }
.questions__back:hover  { transform: rotateY(180deg); }

.questions__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.questions__badge--back { color: var(--color-secondary); }

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
</style>