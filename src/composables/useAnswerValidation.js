/* Hier findet die Validierungslogik statt. 
Es wird geprüft, ob die Antworten richtig oder falsch sind und 
am Ende kommt true or false raus. */

// src/composables/useAnswerValidation.js
import { ref } from 'vue'

export function useAnswerValidation() {
  // ── State ──────────────────────────────────────────────────────────────
  const attempts        = ref({}) // { [frageId]: Anzahl Fehlversuche }
  const validationStatus = ref({}) // { [frageId]: 'correct' | 'wrong' | 'revealed' | null }
  const isValidating    = ref(false)

  const MAX_ATTEMPTS = 3

  // ── Frage initialisieren ───────────────────────────────────────────────
  function initQuestion(frageId) {
    if (attempts.value[frageId] === undefined) {
      attempts.value[frageId]        = 0
      validationStatus.value[frageId] = null
    }
  }

  // ── Antwort prüfen ─────────────────────────────────────────────────────
  async function validateAnswer(frageId, frageText, musterantwort, nutzerantwort) {
    if (attempts.value[frageId] >= MAX_ATTEMPTS) return

    isValidating.value = true

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Du bist ein fairer Lerncoach für Webentwicklung.
Bewerte die folgende Antwort inhaltlich — nicht auf Wortwahl, sondern auf Verständnis.

Frage: "${frageText}"
Musterantwort: "${musterantwort}"
Antwort des Lernenden: "${nutzerantwort}"

Antworte NUR mit einem einzigen Wort: RICHTIG oder FALSCH`
            }
          ]
        })
      })

      const data   = await response.json()
      const urteil = data.content?.[0]?.text?.trim().toUpperCase()

      if (urteil === 'RICHTIG') {
        validationStatus.value[frageId] = 'correct'
      } else {
        attempts.value[frageId] += 1

        if (attempts.value[frageId] >= MAX_ATTEMPTS) {
          validationStatus.value[frageId] = 'revealed'
        } else {
          validationStatus.value[frageId] = 'wrong'
        }
      }
    } catch (err) {
      console.error('Validierungsfehler:', err)
      validationStatus.value[frageId] = 'wrong'
    } finally {
      isValidating.value = false
    }
  }

  // ── Frage zurücksetzen ─────────────────────────────────────────────────
  function resetQuestion(frageId) {
    attempts.value[frageId]        = 0
    validationStatus.value[frageId] = null
  }

  // ── Rückgabe ───────────────────────────────────────────────────────────
  return {
    attempts,
    validationStatus,
    isValidating,
    MAX_ATTEMPTS,
    initQuestion,
    validateAnswer,
    resetQuestion
  }
}