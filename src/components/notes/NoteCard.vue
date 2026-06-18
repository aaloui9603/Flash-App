<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['bearbeiten', 'loeschen'])

// Ordner-Schlüssel → CSS-Variable auflösen
const ORDNER_FARBEN = {
  cyan:        'var(--ordner-cyan)',
  meerblau:    'var(--ordner-meerblau)',
  aquamarin:   'var(--ordner-aquamarin)',
  violetred:   'var(--ordner-violetred)',
  orchid:      'var(--ordner-orchid)',
  lavendel:    'var(--ordner-lavendel)',
  indianred:   'var(--ordner-indianred)',
  springgreen: 'var(--ordner-springgreen)'
}

// Gibt die Farbe des Ordners zurück — oder null wenn kein Ordner gewählt
function ordnerFarbe(schluessel) {
  if (!schluessel) return null
  return ORDNER_FARBEN[schluessel] ?? null
}

function bearbeiten() {
  emit('bearbeiten', props.note)
}

function loeschen() {
  emit('loeschen', props.note.id)
}
</script>

<template>
  <div class="note-card glass--card" @click="bearbeiten">

    <!-- Farbiger Ordner-Streifen oben -->
    <div
      v-if="ordnerFarbe(note.ordner)"
      class="note-card__ordner-streifen"
      :style="{ background: ordnerFarbe(note.ordner) }"
    />

    <div class="note-card__header">
      <h3 class="note-card__titel">{{ note.titel }}</h3>
      <div class="note-card__actions">
        <button class="note-card__btn neu-button" @click.stop="bearbeiten">✏️</button>
        <button class="note-card__btn note-card__btn--delete neu-button" @click.stop="loeschen">🗑️</button>
      </div>
    </div>

    <div class="note-card__inhalt" v-html="note.inhalt" />

    <div class="note-card__footer">
      <span class="note-card__datum">
        📅 {{ new Date(note.created_at).toLocaleDateString('de-DE') }}
      </span>
    </div>

  </div>
</template>

<style scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
  min-height: var(--card-height);
  border: var(--border-width-thin) solid var(--glass-border);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.note-card:hover {
  background: var(--glass-bg-strong);
  transform: translateY(-4px);
  box-shadow: var(--glass-shadow);
}

/* Farbiger Streifen am oberen Rand der Karte */
.note-card__ordner-streifen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.note-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  border-bottom: var(--border-width-thin) solid var(--glass-border);
  padding-bottom: var(--spacing-sm);
}

.note-card__titel {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  line-height: var(--line-height-tight);
}

.note-card__actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.note-card__btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-md);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  color: var(--color-text-secondary);
}

.note-card__btn:hover {
  background: var(--glass-bg-strong);
}

.note-card__btn--delete:hover {
  color: var(--color-error);
}

.note-card__inhalt {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  flex: 1;
  overflow: hidden;
}

.note-card__footer {
  border-top: var(--border-width-thin) solid var(--glass-border);
  padding-top: var(--spacing-sm);
}

.note-card__datum {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>