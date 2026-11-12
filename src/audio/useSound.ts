import { useCallback } from 'react'
import { useSettings } from '../state/useSettings'
import { playSfx, type SfxName } from './sfx'

/**
 * Hangeffekt lejátszása a beállítások szerint: kikapcsolt effekteknél nem szól semmi.
 * A visszaadott függvény stabil, amíg a kapcsoló nem változik.
 */
export function useSound(): (name: SfxName) => void {
  const { settings } = useSettings()
  const enabled = settings.sfx
  return useCallback(
    (name: SfxName) => {
      if (enabled) playSfx(name)
    },
    [enabled],
  )
}
