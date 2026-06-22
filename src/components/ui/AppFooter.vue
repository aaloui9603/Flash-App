<script setup>
import { ref } from 'vue'

const jahr             = new Date().getFullYear()
const scanAktiv        = ref(false)
const modalOffen       = ref(false)
const aktuelleNachricht = ref(null)

const nachrichten = [
  { emoji: '🚀', titel: 'Keep going!',       text: 'Du lernst jeden Tag besser. Mach weiter so!' },
  { emoji: '🧠', titel: 'Wissen ist Macht',  text: 'Wissen ist die beste Investition in dich selbst.' },
  { emoji: '💪', titel: 'Stark bleiben!',    text: 'Jede Flashcard bringt dich einen Schritt näher ans Ziel.' },
  { emoji: '⭐', titel: 'Glaub an dich!',    text: 'Kleine Schritte führen zu großen Erfolgen. Du schaffst das!' },
  { emoji: '🎯', titel: 'Auf Kurs!',         text: 'Fokus ist der Schlüssel. Du bist auf dem richtigen Weg.' },
  { emoji: '🌟', titel: 'Ma sha Allah!',     text: 'Heute gelernt = Morgen besser. In sha Allah!' },
  { emoji: '🏆', titel: 'Elhamdulillah!',   text: 'Du gibst jeden Tag dein Bestes — das zählt.' },
  { emoji: '💡', titel: 'Bleib neugierig!',  text: 'Jede Frage die du stellst macht dich klüger.' },
]

function scanStarten() {
  if (scanAktiv.value) return

  // Zufällige Nachricht wählen
  aktuelleNachricht.value = nachrichten[
    Math.floor(Math.random() * nachrichten.length)
  ]

  scanAktiv.value = true

  // Nach Scan-Animation → Modal öffnen
  setTimeout(() => {
    scanAktiv.value  = false
    modalOffen.value = true
  }, 1400)
}

function modalSchliessen() {
  modalOffen.value = false
}
</script>

<template>

  <!-- Footer -->
  <footer class="app-footer glass">
    <div class="app-footer__copyright">
      <span class="app-footer__name">Flashback</span>
      <span class="app-footer__text">© {{ jahr }} — Alle Rechte vorbehalten</span>
    </div>
  </footer>

  <!-- Fingerabdruck — fixed, Mitte unten -->
  <div
    class="app-footer__fingerabdruck"
    :class="{ 'app-footer__fingerabdruck--scan': scanAktiv }"
    @click="scanStarten"
    title="Scan me!"
  >

    <!-- Scan-Linie -->
    <div v-if="scanAktiv" class="app-footer__scan-linie" />

    <svg
      class="app-footer__svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="48"
      height="48"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fp-verlauf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#00BFFF" stop-opacity="1" />
          <stop offset="50%"  stop-color="#00CED1" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#87CEFA" stop-opacity="0.6" />
        </linearGradient>
        <filter id="fp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="32" cy="32" r="30"
        fill="rgba(0, 191, 255, 0.08)"
        stroke="rgba(0, 191, 255, 0.25)"
        stroke-width="1"
      />

      <g filter="url(#fp-glow)" stroke="url(#fp-verlauf)" fill="none" stroke-linecap="round">
        <ellipse cx="32" cy="34" rx="4" ry="5"  stroke-width="1.8" opacity="1"/>
        <path d="M 24 34 Q 24 22 32 22 Q 40 22 40 34 Q 40 44 32 46 Q 26 46 24 40" stroke-width="1.8" opacity="0.9"/>
        <path d="M 20 34 Q 20 18 32 18 Q 44 18 44 34 Q 44 48 32 50 Q 22 50 20 42" stroke-width="1.6" opacity="0.8"/>
        <path d="M 16 32 Q 16 14 32 14 Q 48 14 48 32 Q 48 50 32 52 Q 18 52 16 40" stroke-width="1.5" opacity="0.65"/>
        <path d="M 12 30 Q 12 10 32 10 Q 52 10 52 30 Q 52 52 32 54 Q 14 54 12 38" stroke-width="1.4" opacity="0.45"/>
      </g>
    </svg>
  </div>

  <!-- Motivations-Modal -->
  <Transition name="modal">
    <div
      v-if="modalOffen"
      class="app-footer__modal-overlay"
      @click.self="modalSchliessen"
    >
      <div class="app-footer__modal glass">

        <button
          class="app-footer__modal-close neu-button"
          @click="modalSchliessen"
        >
          ✕
        </button>

        <span class="app-footer__modal-emoji">
          {{ aktuelleNachricht?.emoji }}
        </span>

        <h2 class="app-footer__modal-titel">
          {{ aktuelleNachricht?.titel }}
        </h2>

        <p class="app-footer__modal-text">
          {{ aktuelleNachricht?.text }}
        </p>

        <div class="app-footer__modal-fingerabdruck">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
            <g stroke="#00BFFF" fill="none" stroke-linecap="round" opacity="0.5">
              <ellipse cx="32" cy="34" rx="4" ry="5" stroke-width="1.5"/>
              <path d="M 24 34 Q 24 22 32 22 Q 40 22 40 34 Q 40 44 32 46 Q 26 46 24 40" stroke-width="1.5"/>
              <path d="M 20 34 Q 20 18 32 18 Q 44 18 44 34 Q 44 48 32 50 Q 22 50 20 42" stroke-width="1.3"/>
              <path d="M 16 32 Q 16 14 32 14 Q 48 14 48 32 Q 48 50 32 52 Q 18 52 16 40" stroke-width="1.2"/>
            </g>
          </svg>
          <span class="app-footer__modal-identifiziert">Identität bestätigt ✅</span>
        </div>

      </div>
    </div>
  </Transition>

</template>

<style lang="scss">
/* ── Footer ───────────────────────────────────────────────────────────── */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-xl);
  margin-top: var(--spacing-xl);
  border-top: var(--border-width-thin) solid var(--glass-border);
}

.app-footer__copyright {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-footer__name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.app-footer__text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.app-footer__fingerabdruck {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  cursor: pointer;
  transition: var(--transition-fast);
  overflow: hidden;
}

.app-footer__fingerabdruck:hover {
  background: var(--glass-bg-strong);
  border-color: var(--color-primary);
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
  transform: translateX(-50%) scale(1.08);
}

/* Scan-Zustand */
.app-footer__fingerabdruck--scan {
  border-color: var(--color-primary);
  box-shadow: 0 0 24px rgba(0, 191, 255, 0.5);
  animation: fp-puls 1.4s ease infinite;
}

@keyframes fp-puls {
  0%, 100% { box-shadow: 0 0 12px rgba(0, 191, 255, 0.3); }
  50%       { box-shadow: 0 0 28px rgba(0, 191, 255, 0.7); }
}

.app-footer__scan-linie {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00BFFF, transparent);
  box-shadow: 0 0 8px #00BFFF;
  animation: scan-linie 1.4s ease forwards;
  z-index: 2;
}

@keyframes scan-linie {
  0%   { top: 0%; opacity: 1; }
  100% { top: 100%; opacity: 0.3; }
}

.app-footer__modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: var(--spacing-md);
}

.app-footer__modal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  max-width: 420px;
  width: 100%;
  text-align: center;
  border: var(--border-width-thin) solid var(--color-primary);
  box-shadow: 0 0 40px rgba(0, 191, 255, 0.2);
}

.app-footer__modal-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.app-footer__modal-close:hover {
  color: var(--color-text);
  background: var(--glass-bg-strong);
}

.app-footer__modal-emoji {
  font-size: 4rem;
  line-height: 1;
}

.app-footer__modal-titel {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.app-footer__modal-text {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.app-footer__modal-fingerabdruck {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
}

.app-footer__modal-identifiziert {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 767px) {
  .app-footer {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
    align-items: center;
  }

  .app-footer__fingerabdruck {
    width: 56px;
    height: 56px;
    bottom: 1.25rem;
  }
}
</style>