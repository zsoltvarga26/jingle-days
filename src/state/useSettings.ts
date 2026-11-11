import { createContext, useContext } from 'react'
import type { Settings } from './settings'

export interface SettingsContextValue {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
}

export const SettingsCtx = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsCtx)
  if (!value) throw new Error('A useSettings csak a SettingsProvider alatt használható.')
  return value
}
