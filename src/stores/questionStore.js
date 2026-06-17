import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useQuestionStore = defineStore('questions', () => {

  // --- State ---
  const questions = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const tagesfrageIndex = ref(0)

  // --- Getters ---
  const tagesfrage = computed(() => {
    if (questions.value.length === 0) return null
    return questions.value[tagesfrageIndex.value]
  })

  const nochNichtAngezeigt = computed(() => {
    return questions.value.filter(q => !q.angezeigt_am)
  })

  // --- Actions ---

  // Alle Fragen laden
  async function ladeFragen() {
    isLoading.value = true
    error.value = null

    const { data, error: sbError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (sbError) {
      error.value = sbError.message
    } else {
      questions.value = data
    }

    isLoading.value = false
  }

  // Neue Frage hinzufügen
  async function frageHinzufuegen(frage, antwort, kategorie) {
    const { data, error: sbError } = await supabase
      .from('questions')
      .insert([{ frage, antwort, kategorie }])
      .select()

    if (sbError) {
      error.value = sbError.message
    } else {
      questions.value.unshift(data[0])
    }
  }

  // Frage als angezeigt markieren
  async function frageAlsAngezeigtMarkieren(id) {
    const jetzt = new Date().toISOString()

    const { error: sbError } = await supabase
      .from('questions')
      .update({ angezeigt_am: jetzt })
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
    } else {
      const frage = questions.value.find(q => q.id === id)
      if (frage) frage.angezeigt_am = jetzt
    }
  }

  // Frage löschen
  async function frageLoeschen(id) {
    const { error: sbError } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
    } else {
      questions.value = questions.value.filter(q => q.id !== id)
    }
  }

  return {
    questions,
    isLoading,
    error,
    tagesfrageIndex,
    tagesfrage,
    nochNichtAngezeigt,
    ladeFragen,
    frageHinzufuegen,
    frageAlsAngezeigtMarkieren,
    frageLoeschen
  }

}, { persist: true })