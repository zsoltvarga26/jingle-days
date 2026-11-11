import { useEffect, useState } from 'react'

/** Az egyetlen hely, ahol az évszám szerepel. */
export const YEAR = 2026
export const DAY_COUNT = 24

const DECEMBER = 11
const MS_PER_DAY = 86_400_000

/** Az n. ajtó ettől a (helyi idő szerinti) pillanattól nyitható. */
export function unlockDate(day: number): Date {
  return new Date(YEAR, DECEMBER, day)
}

export function firstDoorDate(): Date {
  return unlockDate(1)
}

/** A visszaszámlálás célpontja: december 24. 00:00, helyi idő. */
export function countdownTarget(): Date {
  return unlockDate(24)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isDayUnlocked(day: number, now: Date, unlockAll = false): boolean {
  return unlockAll || now.getTime() >= unlockDate(day).getTime()
}

/** December 1. előtt vagyunk-e (ekkor jelenik meg a StartBanner). */
export function isBeforeStart(now: Date, unlockAll = false): boolean {
  return !unlockAll && now.getTime() < firstDoorDate().getTime()
}

/** Naptári napok száma a céldátumig (ma → 0, holnap → 1). */
export function daysUntil(target: Date, now: Date): number {
  const diff = startOfDay(target).getTime() - startOfDay(now).getTime()
  return Math.round(diff / MS_PER_DAY)
}

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** A hátralévő idő részekre bontva; null, ha a célpont elmúlt. */
export function countdownParts(now: Date, target: Date = countdownTarget()): CountdownParts | null {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null
  const total = Math.floor(diff / 1000)
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export function msUntilNextMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}

/**
 * A `?date=2026-12-10` paraméter értelmezése: a megadott nap, a valódi óra szerinti
 * napszakkal (így a visszaszámláló szimulált napon is ketyeg). Hibás értékre null.
 */
export function parseDateParam(value: string | null, realNow: Date): Date | null {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const simulated = new Date(
    year,
    month - 1,
    day,
    realNow.getHours(),
    realNow.getMinutes(),
    realNow.getSeconds(),
    realNow.getMilliseconds(),
  )
  // A túlcsorduló dátumot (pl. 2026-02-31) a Date átírná egy másik napra: ezt nem fogadjuk el.
  if (simulated.getMonth() !== month - 1 || simulated.getDate() !== day) return null
  return simulated
}

/** Minden ajtó nyitható-e (helyi fejlesztés, Netlify-előnézet). */
export function isUnlockAll(): boolean {
  return import.meta.env.VITE_UNLOCK_ALL === 'true'
}

/** A „most”. Fejlesztői módban a `?date=` paraméter felülírja a napot. */
export function getNow(): Date {
  const real = new Date()
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const param = new URLSearchParams(window.location.search).get('date')
    const simulated = parseDateParam(param, real)
    if (simulated) return simulated
  }
  return real
}

/** Másodpercenként (vagy a megadott ütemben) frissülő „most”. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(getNow)

  useEffect(() => {
    const id = window.setInterval(() => setNow(getNow()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return now
}

/**
 * A mai nap (00:00). Csak éjfélkor és a fülre visszatéréskor változik,
 * így aki nyitva hagyja az oldalt, annak az új ajtó frissítés nélkül nyílik meg.
 */
export function useToday(): Date {
  const [today, setToday] = useState(() => startOfDay(getNow()))

  useEffect(() => {
    const refresh = () => {
      const next = startOfDay(getNow())
      setToday((prev) => (prev.getTime() === next.getTime() ? prev : next))
    }
    const timer = window.setTimeout(refresh, msUntilNextMidnight(getNow()) + 50)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [today])

  return today
}
