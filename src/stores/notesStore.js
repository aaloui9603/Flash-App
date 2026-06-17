import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../composables/useSupabase.js'

export const useNotesStore = defineStore('notes', () => {

  // --- State ---
  const notes = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // --- Actions ---

  // Alle Notizen laden
  async function ladeNotes() {
    isLoading.value = true
    error.value = null

    const { data, error: sbError } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (sbError) {
      error.value = sbError.message
    } else {
      notes.value = data
    }

    isLoading.value = false
  }

  // Neue Notiz hinzufügen
  async function notizHinzufuegen(titel, inhalt, farbe) {
    const { data, error: sbError } = await supabase
      .from('notes')
      .insert([{ titel, inhalt, farbe }])
      .select()

    if (sbError) {
      error.value = sbError.message
    } else {
      notes.value.unshift(data[0])
    }
  }

  // Notiz aktualisieren
  async function notizAktualisieren(id, titel, inhalt, farbe) {
    const { error: sbError } = await supabase
      .from('notes')
      .update({ titel, inhalt, farbe, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
    } else {
      const notiz = notes.value.find(n => n.id === id)
      if (notiz) {
        notiz.titel = titel
        notiz.inhalt = inhalt
        notiz.farbe = farbe
      }
    }
  }

  // Notiz löschen
  async function notizLoeschen(id) {
    const { error: sbError } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (sbError) {
      error.value = sbError.message
    } else {
      notes.value = notes.value.filter(n => n.id !== id)
    }
  }

  return {
    notes,
    isLoading,
    error,
    ladeNotes,
    notizHinzufuegen,
    notizAktualisieren,
    notizLoeschen
  }

}, { persist: true })