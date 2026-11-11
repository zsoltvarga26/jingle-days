import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Settings } from './settings'
import { loadSettings, saveSettings, SETTINGS_KEY } from './storage'
import { SettingsCtx } from './useSettings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch }
      // Csak a játékos saját változtatása mentődik; az alapértékek nem íródnak ki maguktól.
      saveSettings(next)
      return next
    })
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SETTINGS_KEY) return
      setSettings(loadSettings())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}
