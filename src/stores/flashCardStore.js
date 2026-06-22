import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useFlashcardStore = defineStore('flashcards', () => {

  // ── State ──────────────────────────────────────────────────────────────
  const flashcards = ref([])
  const isLoading  = ref(false)
  const error      = ref(null)

  // ── Alle Flashcards laden ──────────────────────────────────────────────
  async function ladeFlashcards() {
    isLoading.value = true
    error.value     = null

    const { data, error: sbError } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false })

    if (sbError) {
      error.value = sbError.message
      console.error('ladeFlashcards Fehler:', sbError.message)
    } else {
      flashcards.value = data
    }

    isLoading.value = false
  }

  // ── Neue Flashcard hinzufügen ──────────────────────────────────────────
  // ordner = ausgewählte Ordnerfarbe (z.B. '#00CED1') oder null
  async function flashcardHinzufuegen(frage, antwort, kategorie, ordner) {
    const { data, error: sbError } = await supabase
      .from('flashcards')
      .insert([{ frage, antwort, kategorie, ordner }])
      .select()

    if (sbError) {
      error.value = sbError.message
      console.error('flashcardHinzufuegen Fehler:', sbError.message)
      return false
    } else {
      flashcards.value.unshift(data[0])
      return true
    }
  }

  // ── Flashcard löschen ──────────────────────────────────────────────────
  async function flashcardLoeschen(id) {
    const { error: sbError } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
      console.error('flashcardLoeschen Fehler:', sbError.message)
    } else {
      flashcards.value = flashcards.value.filter(f => f.id !== id)
    }
  }

  // ── Flashcard als gelernt markieren ───────────────────────────────────
  async function gelerntMarkieren(id, gelernt) {
    const { error: sbError } = await supabase
      .from('flashcards')
      .update({ gelernt })
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
      console.error('gelerntMarkieren Fehler:', sbError.message)
    } else {
      const karte = flashcards.value.find(f => f.id === id)
      if (karte) karte.gelernt = gelernt
    }
  }

  return {
    flashcards,
    isLoading,
    error,
    ladeFlashcards,
    flashcardHinzufuegen,
    flashcardLoeschen,
    gelerntMarkieren
  }

}, { persist: true })