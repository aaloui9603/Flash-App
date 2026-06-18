import { ref } from 'vue'

const DSGVO_KEY = 'blueBooster_dsgvo_akzeptiert'

export function useBlueBooster() {
  const nachrichten     = ref([])
  const laedt           = ref(false)
  const fehler          = ref(null)

  const dsgvoAkzeptiert = ref(
    localStorage.getItem(DSGVO_KEY) === 'true'
  )

  const SYSTEM_PROMPT = `Du bist BlueBooster — ein freundlicher, feinfühliger, professioneller und lustiger Assistent für die Flashcard-App. Du hilfst der Nutzerin beim Lernen von Webentwicklungs-Themen.

Deine Persönlichkeit:
- Warm, motivierend und geduldig
- Du machst Vorschläge, über welche Themen die Nutzerin mehr lernen könnte
- Nach 3 fehlgeschlagenen Versuchen bei einer Frage gibst du die Antwort

Deine Regeln:
- Antworte immer auf Deutsch
- Verarbeite keine personenbezogenen Daten
- Halte Antworten kurz und verständlich
- Wenn du etwas nicht weißt, sag es ehrlich`

  // DSGVO akzeptieren
  function dsgvoAkzeptieren() {
    localStorage.setItem(DSGVO_KEY, 'true')
    dsgvoAkzeptiert.value = true
  }

  // Nachricht senden
  async function nachrichtSenden(text) {
    if (!text.trim() || laedt.value) return

    fehler.value = null
    nachrichten.value.push({ role: 'user', content: text.trim() })
    laedt.value = true

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: nachrichten.value.map(n => ({
            role: n.role,
            content: n.content
          }))
        })
      })

      const data    = await response.json()
      const antwort = data.content?.[0]?.text ?? 'Entschuldigung, ich konnte keine Antwort generieren.'

      nachrichten.value.push({ role: 'assistant', content: antwort })

    } catch (err) {
      console.error('BlueBooster Fehler:', err)
      fehler.value = 'Verbindungsfehler. Bitte versuche es erneut.'
    } finally {
      laedt.value = false
    }
  } // ← Fehler 2 behoben: nachrichtSenden endet hier

  // Chat leeren
  function chatLeeren() {
    nachrichten.value = []
    fehler.value      = null
  }
// Rückgabe
  return {
    nachrichten,
    laedt,
    fehler,
    dsgvoAkzeptiert,
    dsgvoAkzeptieren,
    nachrichtSenden,
    chatLeeren
  }
}