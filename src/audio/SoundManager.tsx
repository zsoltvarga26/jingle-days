import { useEffect, useState } from 'react'
import { useSettings } from '../state/useSettings'
import { getEngine } from './engine'
import { setMusicVolume, startMusic, stopMusic } from './music'

/**
 * A háttérzenét köti össze a beállításokkal. Nem jelenít meg semmit.
 *
 * - A böngészők csak felhasználói művelet után engednek hangot: ha az oldal „zene: be”
 *   állapotban töltődik be, a zene az első kattintásra vagy billentyűre indul, nem magától.
 * - Háttérbe került fülön a zene elhalkul és szünetel, visszatéréskor folytatódik.
 */
export function SoundManager() {
  const { settings } = useSettings()
  const { music, musicVolume } = settings

  // Volt-e már felhasználói művelet ezen a betöltésen.
  const [unlocked, setUnlocked] = useState(false)
  const [visible, setVisible] = useState(() => !document.hidden)

  useEffect(() => {
    if (unlocked) return
    const unlock = () => {
      // A hangmotor itt jön létre (vagy éled fel), még a felhasználói műveleten belül.
      getEngine()
      setUnlocked(true)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [unlocked])

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    setMusicVolume(musicVolume)
  }, [musicVolume])

  useEffect(() => {
    if (music && unlocked && visible) startMusic()
    else stopMusic()
  }, [music, unlocked, visible])

  useEffect(() => stopMusic, [])

  return null
}
