import { isLang, type Lang } from '../content/types'
import { DEFAULT_CAT_COAT, isCatCoat, type CatCoat } from '../lib/catCoat'
import { DEFAULT_CAT_NAME, normalizeCatName } from '../lib/catName'

/** Megjelenés: 'auto' a rendszer beállítását követi, amíg a játékos nem választ. */
export type Theme = 'auto' | 'light' | 'dark'

export function isTheme(value: unknown): value is Theme {
  return value === 'auto' || value === 'light' || value === 'dark'
}

/** Külön kulcson él, hogy az előrehaladás törlése ne állítsa vissza. */
export interface Settings {
  lang: Lang
  /** Világos vagy sötét mód; régebbi mentésből hiányzik, ilyenkor 'auto'. */
  theme: Theme
  /** Hangeffektek. */
  sfx: boolean
  /** Háttérzene. */
  music: boolean
  /** 0–1. */
  musicVolume: number
  /** A cica neve a tálkán és a feliratokban; régebbi mentésből hiányzik, ilyenkor az alapnév. */
  catName: string
  /** A cica bundája; régebbi mentésből hiányzik, ilyenkor a fekete-fehér. */
  catCoat: CatCoat
}

/** A böngésző nyelve alapján magyar, egyébként angol. */
export function detectLang(navigatorLanguage: string | undefined): Lang {
  return navigatorLanguage?.toLowerCase().startsWith('hu') ? 'hu' : 'en'
}

export function defaultSettings(navigatorLanguage?: string): Settings {
  return {
    lang: detectLang(navigatorLanguage),
    theme: 'auto',
    sfx: true,
    music: false,
    musicVolume: 0.3,
    catName: DEFAULT_CAT_NAME,
    catCoat: DEFAULT_CAT_COAT,
  }
}

/** Ismeretlen forrásból jövő adatból érvényes beállítást készít; a hibás mezők alapértéket kapnak. */
export function sanitizeSettings(raw: unknown, defaults: Settings): Settings {
  if (typeof raw !== 'object' || raw === null) return defaults
  const data = raw as Record<string, unknown>
  const volume = data.musicVolume
  return {
    lang: isLang(data.lang) ? data.lang : defaults.lang,
    theme: isTheme(data.theme) ? data.theme : defaults.theme,
    sfx: typeof data.sfx === 'boolean' ? data.sfx : defaults.sfx,
    music: typeof data.music === 'boolean' ? data.music : defaults.music,
    musicVolume:
      typeof volume === 'number' && Number.isFinite(volume)
        ? Math.min(1, Math.max(0, volume))
        : defaults.musicVolume,
    catName: normalizeCatName(data.catName) ?? defaults.catName,
    catCoat: isCatCoat(data.catCoat) ? data.catCoat : defaults.catCoat,
  }
}
