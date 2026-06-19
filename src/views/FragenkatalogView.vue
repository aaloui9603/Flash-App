<script setup>
import { ref } from 'vue'
import { useQuestionStore } from '../stores/questionStore.js'
import { useAnswerValidation } from '../composables/useAnswerValidation.js'
import { useToast } from 'vue-toastification'
import NoteEditor from '../components/notes/NoteEditor.vue'

// ── Stores & Composables ───────────────────────────────────────────────────
const questionStore = useQuestionStore()
const toast         = useToast()

const {
  attempts,
  validationStatus,
  isValidating,
  MAX_ATTEMPTS,
  initQuestion,
  validateAnswer,
} = useAnswerValidation()

// ── State ──────────────────────────────────────────────────────────────────
const aktuelleFrageText   = ref('')
const aktuelleFrageMuster = ref('')
const aktuelleFrageId     = ref(null)
const antwortHtml         = ref('')
const laedt               = ref(false)
const gestellteFragen     = ref([])

let frageZaehler = 0

// ── Themen-Liste für zufälligen Einstieg ──────────────────────────────────
const THEMEN = [
  'Vue 3 Composition API',
  'JavaScript Arrays und Methoden',
  'CSS Flexbox',
  'CSS Grid',
  'Supabase CRUD',
  'Git Workflow',
  'Vite Build-Tool',
  'Pinia State Management',
  'SCSS Variablen',
  'Vue Router',
  'TypeScript Grundlagen',
  'HTML Semantik',
  'REST API',
  'Async/Await',
  'Vue Lifecycle Hooks'
]

// ── Hilfsfunktion: HTML → Plaintext ───────────────────────────────────────
function htmlZuPlaintext(html) {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// ── Neue Frage von der Anthropic API laden ─────────────────────────────────
async function neueFrage() {
  laedt.value       = true
  antwortHtml.value = ''

  try {
    const zufall       = Math.floor(Math.random() * 100000)
    const zufallsThema = THEMEN[Math.floor(Math.random() * THEMEN.length)]

    const vermeiden = gestellteFragen.value.length > 0
      ? `\nBereits gestellte Fragen (diese NICHT wiederholen):\n${gestellteFragen.value.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
      : ''

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Du bist ein Webentwicklungs-Lerncoach. [Seed: ${zufall}]
Erstelle EINE Prüfungsfrage speziell über das Thema: ${zufallsThema}.${vermeiden}
Antworte NUR in diesem JSON-Format ohne Markdown-Backticks:
{
  "frage": "...",
  "musterantwort": "..."
}`
          }
        ]
      })
    })

    const data   = await response.json()
    const text   = data.content?.[0]?.text ?? ''
    const parsed = JSON.parse(text)

    aktuelleFrageText.value   = parsed.frage
    aktuelleFrageMuster.value = parsed.musterantwort

    // Frage zur Liste hinzufügen — max. 10 merken
    gestellteFragen.value.push(parsed.frage)
    if (gestellteFragen.value.length > 10) {
      gestellteFragen.value.shift()
    }

    frageZaehler++
    aktuelleFrageId.value = `api-frage-${frageZaehler}`
    initQuestion(aktuelleFrageId.value)

  } catch (err) {
    console.error('Fehler beim Laden der Frage:', err)
    toast.error('Frage konnte nicht geladen werden. Bitte erneut versuchen.')
  } finally {
    laedt.value = false
  }
}

// ── Antwort prüfen ─────────────────────────────────────────────────────────
async function handleValidate() {
  const plainText = htmlZuPlaintext(antwortHtml.value)

  if (!plainText) {
    toast.warning('Bitte schreibe zuerst eine Antwort!')
    return
  }

  await validateAnswer(
    aktuelleFrageId.value,
    aktuelleFrageText.value,
    aktuelleFrageMuster.value,
    plainText
  )

  const zustand = validationStatus.value[aktuelleFrageId.value]

  if (zustand === 'correct') {
    toast.success('Richtig! Sehr gut. 🎉')
  } else if (zustand === 'wrong') {
    const verbleibend = MAX_ATTEMPTS - attempts.value[aktuelleFrageId.value]
    toast.error(`Leider falsch. Noch ${verbleibend} Versuch${verbleibend === 1 ? '' : 'e'}.`)
  } else if (zustand === 'revealed') {
    toast.info('3 Versuche aufgebraucht — die Antwort wird jetzt angezeigt.')
  }
}

// ── Frage in Supabase speichern ────────────────────────────────────────────
// Korrektur: frageHinzufuegen statt antwortSpeichern (existiert nicht im Store)
async function speichern() {
  if (!aktuelleFrageText.value || !aktuelleFrageMuster.value) return

  await questionStore.frageHinzufuegen(
    aktuelleFrageText.value,
    aktuelleFrageMuster.value,
    'Fragenkatalog'
  )

  toast.success('Frage gespeichert! 💾')
}

// Beim ersten Laden direkt eine Frage generieren
neueFrage()
</script>

<template>
  <div class="katalog">

    <!-- Header -->
    <div class="katalog__header">
      <h1 class="katalog__titel">🎯 Übungs-Fragenkatalog</h1>
      <button
        class="katalog__neu-btn neu-button"
        :disabled="laedt"
        @click="neueFrage"
      >
        {{ laedt ? 'Lädt …' : '🔄 Neue Frage' }}
      </button>
    </div>

    <!-- Ladezustand -->
    <div v-if="laedt" class="katalog__ladeblock glass">
      <p class="katalog__lade-text">Frage wird generiert …</p>
    </div>

    <!-- Frage-Block -->
    <div v-else-if="aktuelleFrageText" class="katalog__frage-block glass">
      <span class="katalog__label">❓ Frage</span>
      <p class="katalog__frage-text">{{ aktuelleFrageText }}</p>
    </div>

    <!-- Antwort-Block -->
    <div
      v-if="aktuelleFrageText"
      class="katalog__antwort-block"
      :class="{
        'katalog__antwort-block--richtig':  validationStatus[aktuelleFrageId] === 'correct',
        'katalog__antwort-block--falsch':   validationStatus[aktuelleFrageId] === 'wrong',
        'katalog__antwort-block--revealed': validationStatus[aktuelleFrageId] === 'revealed'
      }"
    >
      <span class="katalog__label">✏️ Deine Antwort</span>
      <NoteEditor v-model="antwortHtml" />
    </div>

    <!-- Versuchs-Punkte -->
    <div v-if="aktuelleFrageId" class="katalog__versuche">
      <span
        v-for="n in MAX_ATTEMPTS"
        :key="n"
        class="katalog__versuch-punkt"
        :class="{
          'katalog__versuch-punkt--verbraucht': n <= (attempts[aktuelleFrageId] ?? 0),
          'katalog__versuch-punkt--richtig':    validationStatus[aktuelleFrageId] === 'correct'
        }"
      />
    </div>

    <!-- Aktions-Buttons -->
    <div v-if="aktuelleFrageText" class="katalog__aktionen">

      <button
        v-if="
          validationStatus[aktuelleFrageId] !== 'correct' &&
          validationStatus[aktuelleFrageId] !== 'revealed'
        "
        class="katalog__btn neu-button"
        :disabled="isValidating"
        @click="handleValidate"
      >
        {{ isValidating ? 'Wird geprüft …' : '🔍 Antwort prüfen' }}
      </button>

      <button
        v-if="validationStatus[aktuelleFrageId] === 'correct'"
        class="katalog__btn katalog__btn--speichern neu-button"
        @click="speichern"
      >
        💾 Speichern
      </button>

    </div>

    <!-- Musterantwort (nach 3 Fehlversuchen) -->
    <div
      v-if="validationStatus[aktuelleFrageId] === 'revealed'"
      class="katalog__muster glass"
    >
      <span class="katalog__label">💡 Musterantwort</span>
      <p class="katalog__muster-text">{{ aktuelleFrageMuster }}</p>
    </div>

  </div>
</template>

<style scoped>
.katalog {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 800px;
  margin: 0 auto;
}

.katalog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.katalog__titel {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.katalog__neu-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.katalog__neu-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.katalog__frage-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  border: var(--border-width-thin) solid var(--color-primary);
}

.katalog__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.katalog__frage-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
}

.katalog__ladeblock {
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
}

.katalog__lade-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-md);
}

.katalog__antwort-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  background: var(--glass-bg);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.katalog__antwort-block--richtig {
  border-color: var(--color-answer-correct);
  box-shadow: 0 0 12px var(--color-answer-correct-glow);
}

.katalog__antwort-block--falsch {
  border-color: var(--color-answer-wrong);
  box-shadow: 0 0 12px var(--color-answer-wrong-glow);
}

.katalog__antwort-block--revealed {
  border-color: var(--glass-border);
}

.katalog__versuche {
  display: flex;
  gap: var(--spacing-xs);
}

.katalog__versuch-punkt {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--glass-border);
  transition: background var(--transition-base);
}

.katalog__versuch-punkt--verbraucht {
  background: var(--color-answer-wrong);
}

.katalog__versuch-punkt--richtig {
  background: var(--color-answer-correct);
}

.katalog__aktionen {
  display: flex;
  gap: var(--spacing-md);
}

.katalog__btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.katalog__btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.katalog__btn--speichern {
  color: var(--color-success);
}

.katalog__muster {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.katalog__muster-text {
  color: var(--color-text);
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
}
</style>