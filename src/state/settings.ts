import { isLang, type Lang } from '../content/types'

/** Külön kulcson él, hogy az előrehaladás törlése ne állítsa vissza. */
export interface Settings {
  lang: Lang
  /** Hangeffektek. */
  sfx: boolean
  /** Háttérzene. */
  music: boolean
  /** 0–1. */
  musicVolume: number
}

/** A böngésző nyelve alapján magyar, egyébként angol. */
export function detectLang(navigatorLanguage: string | undefined): Lang {
  return navigatorLanguage?.toLowerCase().startsWith('hu') ? 'hu' : 'en'
}

export function defaultSettings(navigatorLanguage?: string): Settings {
  return {
    lang: detectLang(navigatorLanguage),
    sfx: true,
    music: false,
    musicVolume: 0.3,
  }
}

/** Ismeretlen forrásból jövő adatból érvényes beállítást készít; a hibás mezők alapértéket kapnak. */
export function sanitizeSettings(raw: unknown, defaults: Settings): Settings {
  if (typeof raw !== 'object' || raw === null) return defaults
  const data = raw as Record<string, unknown>
  const volume = data.musicVolume
  return {
    lang: isLang(data.lang) ? data.lang : defaults.lang,
    sfx: typeof data.sfx === 'boolean' ? data.sfx : defaults.sfx,
    music: typeof data.music === 'boolean' ? data.music : defaults.music,
    musicVolume:
      typeof volume === 'number' && Number.isFinite(volume)
        ? Math.min(1, Math.max(0, volume))
        : defaults.musicVolume,
  }
}
