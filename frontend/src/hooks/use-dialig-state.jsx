import { useState } from 'react'

/**
 * Hook personnalisé pour gérer l’état d’un dialogue (ou modal, menu, etc.)
 * @param {string | boolean | null} initialState
 * @returns {[string | boolean | null, function]} État actuel + fonction pour le modifier
 */
export default function useDialogState(initialState = null) {
  const [open, setOpenInternal] = useState(initialState)

  const setOpen = (value) => {
    setOpenInternal((prev) => (prev === value ? null : value))
  }
  return [open, setOpen]
}
