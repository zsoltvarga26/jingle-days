import { emptySave, type DayProgress, type SaveData, type StepStatus } from './progress'
import { defaultSettings, sanitizeSettings, type Settings } from './settings'

/** Az egyetlen modul, amely a localStorage-hoz nyúl. Minden hívás try/catch-ben van. */
export const SAVE_KEY = 'advent-2026:v1'
export const SETTINGS_KEY = 'advent-2026:settings'

const CURRENT_VERSION = 1

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Csak akkor ír, ha a tartalom eltér a tárolttól. Visszaadja, hogy történt-e írás. */
function writeRaw(key: string, value: string): boolean {
  try {
    if (window.localStorage.getItem(key) === value) return false
    window.localStorage.setItem(key, value)
    return true
  } catch {
    // Privát mód, betelt tárhely: a játék mentés nélkül megy tovább.
    return false
  }
}

function isStepStatus(value: unknown): value is StepStatus {
  return value === 'pending' || value === 'done' || value === 'skipped'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDayProgress(value: unknown): value is DayProgress {
  if (!isRecord(value)) return false
  const { openedAt, quiz, emoji, quoteSeen, ornamentShown } = value
  if (typeof openedAt !== 'string') return false
  if (typeof quoteSeen !== 'boolean' || typeof ornamentShown !== 'boolean') return false
  if (!isRecord(quiz) || !isStepStatus(quiz.status) || !Array.isArray(quiz.answers)) return false
  if (!quiz.answers.every((a) => a === null || (Number.isInteger(a) && (a as number) >= 0))) {
    return false
  }
  if (!Array.isArray(emoji)) return false
  return emoji.every(
    (p) =>
      isRecord(p) &&
      isStepStatus(p.status) &&
      (p.hintsRevealed === 0 || p.hintsRevealed === 1 || p.hintsRevealed === 2) &&
      Number.isInteger(p.attempts) &&
      (p.attempts as number) >= 0,
  )
}

function isSaveData(value: unknown): value is SaveData {
  if (!isRecord(value) || value.version !== CURRENT_VERSION || !isRecord(value.days)) return false
  return Object.entries(value.days).every(([key, day]) => {
    const n = Number(key)
    return Number.isInteger(n) && n >= 1 && n <= 24 && isDayProgress(day)
  })
}

/**
 * Régebbi verziójú mentés átalakítása. Egyelőre csak az 1-es verzió létezik;
 * egy későbbi `version: 2` itt alakítja át az 1-est. Ismeretlen adatra null.
 */
export function migrate(raw: unknown): SaveData | null {
  if (isSaveData(raw)) return raw
  return null
}

/** A sorosított mentésből állapot; hibás vagy ismeretlen verziójú adatra üres mentés. */
export function parseSave(text: string | null): SaveData {
  if (!text) return emptySave()
  try {
    return migrate(JSON.parse(text)) ?? emptySave()
  } catch {
    return emptySave()
  }
}

export function loadSave(): SaveData {
  return parseSave(readRaw(SAVE_KEY))
}

export function saveSave(data: SaveData): boolean {
  return writeRaw(SAVE_KEY, JSON.stringify(data))
}

function browserLanguage(): string | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator.language
}

export function loadSettings(): Settings {
  const defaults = defaultSettings(browserLanguage())
  const text = readRaw(SETTINGS_KEY)
  if (!text) return defaults
  try {
    return sanitizeSettings(JSON.parse(text), defaults)
  } catch {
    return defaults
  }
}

export function saveSettings(settings: Settings): boolean {
  return writeRaw(SETTINGS_KEY, JSON.stringify(settings))
}
