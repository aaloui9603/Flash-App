<script setup>
import { watch, onBeforeUnmount, onMounted, ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// CSS-Variable nach DOM-Bereitschaft lesen
function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim()
}

const schriftfarben = ref([])
const markierfarben = ref([])

onMounted(() => {
  schriftfarben.value = [
    { name: 'Standard', wert: null },
    { name: 'Grau', wert: getCssVar('--color-grey34') },
    { name: 'Schiefergrau', wert: getCssVar('--color-slate-grey') },
    { name: 'Marine', wert: getCssVar('--color-navy') },
    { name: 'Cyan', wert: getCssVar('--color-cyan4') },
    { name: 'Goldgelb', wert: getCssVar('--color-burlywood') },
    { name: 'Türkis', wert: getCssVar('--color-turquoise') },
    { name: 'DeepPink', wert: getCssVar('--color-deep-pink') },
    { name: 'Feuerrot', wert: getCssVar('--color-firebrick') },
    { name: 'Meeresgrün', wert: getCssVar('--color-light-sea-green') },
    { name: 'Schwarz', wert: getCssVar('--color-schwarz') }
  ]

  markierfarben.value = [
    { name: 'Gelb', wert: getCssVar('--marker-gelb') },
    { name: 'Grün', wert: getCssVar('--marker-gruen') },
    { name: 'Blau', wert: getCssVar('--marker-blau') },
    { name: 'Pink', wert: getCssVar('--marker-pink') }
  ]
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (neuerWert) => {
  if (editor.value && editor.value.getHTML() !== neuerWert) {
    editor.value.commands.setContent(neuerWert, false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function farbeSetzen(wert) {
  if (wert === null) {
    editor.value?.chain().focus().unsetColor().run()
  } else {
    editor.value?.chain().focus().setColor(wert).run()
  }
}

function markierenSetzen(wert) {
  editor.value?.chain().focus().toggleHighlight({ color: wert }).run()
}
</script>

<template>
  <div class="note-editor">

    <!-- Toolbar -->
    <div class="note-editor__toolbar glass">

      <!-- Formatierung -->
      <div class="note-editor__gruppe">
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('bold') }"
          @click="editor?.chain().focus().toggleBold().run()"
          title="Fett"
        >
          <strong>B</strong>
        </button>
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('italic') }"
          @click="editor?.chain().focus().toggleItalic().run()"
          title="Kursiv"
        >
          <em>I</em>
        </button>
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('underline') }"
          @click="editor?.chain().focus().toggleUnderline().run()"
          title="Unterstrichen"
        >
          <u>U</u>
        </button>
      </div>

      <div class="note-editor__divider"></div>

      <!-- Listen & Überschrift -->
      <div class="note-editor__gruppe">
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
          title="Aufzählung"
        >
          ☰
        </button>
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          title="Nummerierte Liste"
        >
          1.
        </button>
        <button
          class="note-editor__btn neu-button"
          :class="{ 'note-editor__btn--active': editor?.isActive('heading', { level: 2 }) }"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          title="Überschrift"
        >
          H2
        </button>
      </div>

      <div class="note-editor__divider"></div>

      <!-- Schriftfarben -->
      <div class="note-editor__gruppe note-editor__gruppe--farben">
        <span class="note-editor__gruppe-label">A</span>
        <button
          v-for="farbe in schriftfarben"
          :key="farbe.name"
          class="note-editor__farb-btn"
          :style="{ background: farbe.wert ?? 'var(--color-text)' }"
          :title="farbe.name"
          @click="farbeSetzen(farbe.wert)"
        />
      </div>

      <div class="note-editor__divider"></div>

      <!-- Textmarker -->
      <div class="note-editor__gruppe note-editor__gruppe--farben">
        <span class="note-editor__gruppe-label">🖊</span>
        <button
          v-for="marker in markierfarben"
          :key="marker.name"
          class="note-editor__farb-btn note-editor__farb-btn--marker"
          :style="{ background: marker.wert }"
          :title="marker.name"
          @click="markierenSetzen(marker.wert)"
        />
      </div>

      <div class="note-editor__divider"></div>

      <!-- Reset -->
      <button
        class="note-editor__btn neu-button"
        @click="editor?.chain().focus().unsetAllMarks().run()"
        title="Formatierung zurücksetzen"
      >
        ✕
      </button>

    </div>

    <!-- Editor -->
    <EditorContent class="note-editor__content" :editor="editor" />

  </div>
</template>

<style scoped>
.note-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.note-editor__toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  flex-wrap: wrap;
}

.note-editor__gruppe {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.note-editor__gruppe--farben {
  gap: var(--spacing-xs);
  align-items: center;
}

.note-editor__gruppe-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.note-editor__btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  min-width: var(--editor-btn-min-width);
  text-align: center;
}

.note-editor__btn--active {
  color: var(--color-primary);
  background: var(--glass-bg-strong);
}

.note-editor__btn:hover {
  color: var(--color-primary);
  background: var(--glass-bg);
}

.note-editor__farb-btn {
  width: var(--spacing-md);
  height: var(--spacing-md);
  border-radius: var(--radius-full);
  border: var(--border-width-thin) solid var(--glass-border);
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 0;
}

.note-editor__farb-btn:hover {
  transform: scale(1.2);
  border-color: var(--color-primary);
}

.note-editor__farb-btn--marker {
  border-radius: var(--radius-sm);
}

.note-editor__divider {
  width: var(--border-width-thin);
  height: var(--editor-divider-height);
  background: var(--glass-border);
  margin: 0 var(--spacing-xs);
}

/* Kernelement — ProseMirror füllt gesamten Bereich aus */
/* Fix für Klick-Bug + Textfeld-Größe */
.note-editor__content {
  background: var(--glass-bg);
  border: var(--border-width-thin) solid var(--glass-border);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
  cursor: text;
}

.note-editor__content:focus-within {
  border-color: var(--color-primary);
  background: var(--glass-bg-strong);
  outline: none;
}

/* :deep() — greift auf das interne ProseMirror-Element zu */
.note-editor__content :deep(.ProseMirror) {
  min-height: var(--editor-min-height);
  padding: var(--spacing-md);
  color: var(--color-text);
  font-size: var(--font-size-md);
  font-family: inherit;
  outline: none;
  cursor: text;
  width: 100%;
  overflow-y: auto;
  line-height: var(--line-height-base);
}

.note-editor__content :deep(.ProseMirror p) {
  margin: 0;
}

.note-editor__content :deep(.ProseMirror:focus) {
  outline: none;
}
</style>