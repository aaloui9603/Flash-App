<script setup>
import { ref, nextTick, watch } from 'vue'
import { useBlueBooster } from '../../composables/useBlueBooster'

const {
  nachrichten,
  laedt,
  fehler,
  dsgvoAkzeptiert,
  dsgvoAkzeptieren,
  nachrichtSenden,
  chatLeeren
} = useBlueBooster()

// ── State ──────────────────────────────────────────────────────────────────
const chatOffen    = ref(false)
const eingabe      = ref('')
const nachrichtenRef = ref(null)

// ── Chat öffnen / schließen ────────────────────────────────────────────────
function toggleChat() {
  chatOffen.value = !chatOffen.value
}

// ── Nachricht abschicken ───────────────────────────────────────────────────
async function abschicken() {
  if (!eingabe.value.trim()) return
  const text   = eingabe.value
  eingabe.value = ''
  await nachrichtSenden(text)
}

// Enter-Taste zum Senden (Shift+Enter = neue Zeile)
function enterHandler(event) {
  if (event.shiftKey) return
  event.preventDefault()
  abschicken()
}

// ── Auto-Scroll nach unten wenn neue Nachricht kommt ──────────────────────
watch(nachrichten, async () => {
  await nextTick()
  if (nachrichtenRef.value) {
    nachrichtenRef.value.scrollTop = nachrichtenRef.value.scrollHeight
  }
}, { deep: true })
</script>

<template>
  <div class="booster">

    <!-- Smiley-Button (immer sichtbar, unten rechts) -->
    <button
      class="booster__toggle neu-button"
      :class="{ 'booster__toggle--offen': chatOffen }"
      :title="chatOffen ? 'Chat schließen' : 'BlueBooster öffnen'"
      @click="toggleChat"
    >
      😊
    </button>

    <!-- Chat-Fenster -->
    <Transition name="booster-slide">
      <div v-if="chatOffen" class="booster__fenster glass">

        <!-- Header -->
        <div class="booster__header">
          <div class="booster__header-info">
            <span class="booster__avatar">😊</span>
            <div>
              <p class="booster__name">BlueBooster</p>
              <p class="booster__subtitle">Welcome Buddy!</p>
            </div>
          </div>
          <div class="booster__header-aktionen">
            <button
              class="booster__aktion-btn neu-button"
              title="Chatverlauf löschen"
              @click="chatLeeren"
            >
              🗑️
            </button>
            <button
              class="booster__aktion-btn neu-button"
              title="Schließen"
              @click="toggleChat"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- DSGVO-Einwilligungsdialog -->
        <div v-if="!dsgvoAkzeptiert" class="booster__dsgvo">
          <p class="booster__dsgvo-text">
            Bevor wir starten: BlueBooster ist ein KI-Assistent.
          </p>
          <ul class="booster__dsgvo-liste">
            <li>💾 Dein Chatverlauf wird nicht gespeichert</li>
            <li>🔒 Es werden keine personenbezogenen Daten verarbeitet</li>
            <li>🗑️ Du kannst den Verlauf jederzeit löschen</li>
          </ul>
          <button
            class="booster__dsgvo-btn neu-button"
            @click="dsgvoAkzeptieren"
          >
            ✅ Verstanden — los geht's!
          </button>
        </div>

        <!-- Chat-Bereich (nur nach DSGVO-Einwilligung) -->
        <template v-else>

          <!-- Nachrichten-Liste -->
          <div class="booster__nachrichten" ref="nachrichtenRef">

            <!-- Begrüßung wenn noch keine Nachrichten -->
            <div v-if="nachrichten.length === 0" class="booster__willkommen">
              <p>Hallo! Ich bin BlueBooster. 😊</p>
              <p>Womit kann ich dir heute beim Lernen helfen?</p>
            </div>

            <!-- Nachrichten -->
            <div
              v-for="(nachricht, index) in nachrichten"
              :key="index"
              class="booster__nachricht"
              :class="{
                'booster__nachricht--user':      nachricht.role === 'user',
                'booster__nachricht--assistant': nachricht.role === 'assistant'
              }"
            >
              <span
                v-if="nachricht.role === 'assistant'"
                class="booster__nachricht-avatar"
              >😊</span>
              <p class="booster__nachricht-text">{{ nachricht.content }}</p>
            </div>

            <!-- Lade-Indikator -->
            <div v-if="laedt" class="booster__nachricht booster__nachricht--assistant">
              <span class="booster__nachricht-avatar">😊</span>
              <p class="booster__nachricht-text booster__tippen">···</p>
            </div>

            <!-- Fehleranzeige -->
            <p v-if="fehler" class="booster__fehler">{{ fehler }}</p>

          </div>

          <!-- DSGVO-Hinweis (immer sichtbar) -->
          <p class="booster__datenschutz-hinweis">
            🔒 Dieser Assistent verarbeitet keine personenbezogenen Daten.
          </p>

          <!-- Eingabe-Bereich -->
          <div class="booster__eingabe-bereich">
            <textarea
              v-model="eingabe"
              class="booster__eingabe"
              placeholder="Schreibe eine Nachricht..."
              rows="2"
              :disabled="laedt"
              @keydown.enter="enterHandler"
            />
            <button
              class="booster__senden-btn neu-button"
              :disabled="!eingabe.trim() || laedt"
              @click="abschicken"
            >
              ➤
            </button>
          </div>

        </template>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* ── Wrapper — fixed unten rechts ──────────────────────────────────────── */
.booster {
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

/* ── Smiley-Toggle-Button ──────────────────────────────────────────────── */
.booster__toggle {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border: 2px solid var(--glass-border);
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--glass-shadow);
}

.booster__toggle:hover {
  transform: scale(1.1);
}

.booster__toggle--offen {
  transform: scale(0.95);
}

/* ── Chat-Fenster ──────────────────────────────────────────────────────── */
.booster__fenster {
  width: 340px;
  max-height: 520px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: var(--border-width-thin) solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

/* ── Header ────────────────────────────────────────────────────────────── */
.booster__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: var(--border-width-thin) solid var(--glass-border);
  background: var(--glass-bg-strong);
}

.booster__header-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.booster__avatar {
  font-size: var(--font-size-2xl);
}

.booster__name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.booster__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
}

.booster__header-aktionen {
  display: flex;
  gap: var(--spacing-xs);
}

.booster__aktion-btn {
  padding: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.booster__aktion-btn:hover {
  color: var(--color-text);
  background: var(--glass-bg);
}

/* ── DSGVO-Dialog ──────────────────────────────────────────────────────── */
.booster__dsgvo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  flex: 1;
}

.booster__dsgvo-text {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.booster__dsgvo-liste {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-left: var(--spacing-sm);
}

.booster__dsgvo-liste li {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.booster__dsgvo-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  align-self: flex-start;
}

.booster__dsgvo-btn:hover {
  background: var(--glass-bg-strong);
}

/* ── Nachrichten-Liste ─────────────────────────────────────────────────── */
.booster__nachrichten {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.booster__willkommen {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-lg);
}

.booster__nachricht {
  display: flex;
  gap: var(--spacing-xs);
  align-items: flex-end;
  max-width: 85%;
}

.booster__nachricht--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.booster__nachricht--assistant {
  align-self: flex-start;
}

.booster__nachricht-avatar {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.booster__nachricht-text {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-text);
}

.booster__nachricht--user .booster__nachricht-text {
  background: var(--color-primary);
  color: #ffffff;
  border-radius: var(--radius-md) var(--radius-md) 0 var(--radius-md);
}

.booster__nachricht--assistant .booster__nachricht-text {
  background: var(--glass-bg-strong);
  border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 0;
}

/* Tipp-Animation */
.booster__tippen {
  letter-spacing: 4px;
  animation: tippen 1s infinite;
}

@keyframes tippen {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 1;   }
}

.booster__fehler {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  text-align: center;
}

/* ── Datenschutz-Hinweis ───────────────────────────────────────────────── */
.booster__datenschutz-hinweis {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--spacing-xs) var(--spacing-md);
  border-top: var(--border-width-thin) solid var(--glass-border);
}

/* ── Eingabe-Bereich ───────────────────────────────────────────────────── */
.booster__eingabe-bereich {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: var(--border-width-thin) solid var(--glass-border);
  align-items: flex-end;
}

.booster__eingabe {
  flex: 1;
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-family: inherit;
  resize: none;
  transition: var(--transition-fast);
}

.booster__eingabe:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.booster__eingabe::placeholder {
  color: var(--color-text-muted);
}

.booster__eingabe:disabled {
  opacity: var(--opacity-disabled);
}

.booster__senden-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.booster__senden-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.booster__senden-btn:hover:not(:disabled) {
  background: var(--glass-bg-strong);
}

/* ── Slide-Animation ───────────────────────────────────────────────────── */
.booster-slide-enter-active,
.booster-slide-leave-active {
  transition: var(--transition-base);
}

.booster-slide-enter-from,
.booster-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
</style>