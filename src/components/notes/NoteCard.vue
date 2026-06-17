<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['bearbeiten', 'loeschen'])

function bearbeiten() {
  emit('bearbeiten', props.note)
}

function loeschen() {
  emit('loeschen', props.note.id)
}
</script>

<template>
  <div class="note-card glass--card" @click="bearbeiten">
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
}

.note-card:hover {
  background: var(--glass-bg-strong);
  transform: translateY(-4px);
  box-shadow: var(--glass-shadow);
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