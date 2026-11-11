import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { progressReducer } from './progress'
import { loadSave, parseSave, SAVE_KEY, saveSave } from './storage'
import { ProgressCtx } from './useProgress'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadSave)

  // Minden változás azonnal mentődik. A storage.ts csak akkor ír, ha a tartalom eltér,
  // így egy másik fülről átvett állapot nem indít oda-vissza írogatást.
  useEffect(() => {
    saveSave(state)
  }, [state])

  // Több nyitott fül szinkronja: a másik fül mentését a HYDRATE veszi át.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SAVE_KEY) return
      dispatch({ type: 'HYDRATE', data: parseSave(event.key === null ? null : event.newValue) })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}
