import { describe, expect, test } from 'vitest'
import {
  countdownParts,
  countdownTarget,
  DAY_COUNT,
  daysUntil,
  firstDoorDate,
  isBeforeStart,
  isDayUnlocked,
  msUntilNextMidnight,
  parseDateParam,
  unlockDate,
} from './dates'

const allDays = Array.from({ length: DAY_COUNT }, (_, i) => i + 1)
const unlocked = (now: Date, unlockAll = false) =>
  allDays.filter((day) => isDayUnlocked(day, now, unlockAll))

describe('dátumzár', () => {
  test('november 30. 23:59-kor minden ajtó zárolt', () => {
    const now = new Date(2026, 10, 30, 23, 59, 59)
    expect(unlocked(now)).toEqual([])
    expect(isBeforeStart(now)).toBe(true)
  })

  test('december 1. 00:00-kor az 1. ajtó nyitható, a többi nem', () => {
    const now = new Date(2026, 11, 1, 0, 0, 0)
    expect(unlocked(now)).toEqual([1])
    expect(isBeforeStart(now)).toBe(false)
  })

  test('december 10-én az 1–10. ajtó nyitható', () => {
    expect(unlocked(new Date(2026, 11, 10, 14, 30))).toEqual(allDays.slice(0, 10))
  })

  test('december 24-én mind a 24 nyitható', () => {
    expect(unlocked(new Date(2026, 11, 24, 0, 0, 0))).toEqual(allDays)
  })

  test('december 25-én és 2027 januárjában is minden nyitható marad', () => {
    expect(unlocked(new Date(2026, 11, 25, 9))).toEqual(allDays)
    expect(unlocked(new Date(2027, 0, 15))).toEqual(allDays)
    expect(isBeforeStart(new Date(2027, 0, 15))).toBe(false)
  })

  test('az unlockAll kapcsoló mindent megnyit, és elrejti a kezdő feliratot', () => {
    const now = new Date(2026, 10, 11)
    expect(unlocked(now, true)).toEqual(allDays)
    expect(isBeforeStart(now, true)).toBe(false)
  })

  test('az ajtó helyi idő szerinti éjfélkor nyílik', () => {
    const date = unlockDate(7)
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 11, 7])
    expect([date.getHours(), date.getMinutes()]).toEqual([0, 0])
  })
})

describe('daysUntil', () => {
  test('november 11-én még 20 nap van december 1-jéig', () => {
    expect(daysUntil(firstDoorDate(), new Date(2026, 10, 11, 18, 0))).toBe(20)
  })

  test('november 20-án még 11 nap', () => {
    expect(daysUntil(firstDoorDate(), new Date(2026, 10, 20))).toBe(11)
  })

  test('naptári napot számol, nem 24 órás szakaszokat', () => {
    expect(daysUntil(unlockDate(2), new Date(2026, 11, 1, 23, 59))).toBe(1)
    expect(daysUntil(unlockDate(2), new Date(2026, 11, 2, 0, 0))).toBe(0)
  })
})

describe('visszaszámláló', () => {
  test('a célpont december 24. 00:00', () => {
    const target = countdownTarget()
    expect([target.getMonth(), target.getDate(), target.getHours()]).toEqual([11, 24, 0])
  })

  test('részekre bontja a hátralévő időt', () => {
    expect(countdownParts(new Date(2026, 11, 22, 21, 58, 57))).toEqual({
      days: 1,
      hours: 2,
      minutes: 1,
      seconds: 3,
    })
  })

  test('a célpont elérésekor és utána null', () => {
    expect(countdownParts(new Date(2026, 11, 24, 0, 0, 0))).toBeNull()
    expect(countdownParts(new Date(2027, 0, 1))).toBeNull()
  })
})

describe('segédfüggvények', () => {
  test('msUntilNextMidnight', () => {
    expect(msUntilNextMidnight(new Date(2026, 11, 1, 23, 59, 59, 0))).toBe(1000)
  })

  test('parseDateParam a megadott napot adja a valódi napszakkal', () => {
    const real = new Date(2026, 10, 11, 16, 20, 30)
    const simulated = parseDateParam('2026-12-10', real)
    expect(simulated).toEqual(new Date(2026, 11, 10, 16, 20, 30))
  })

  test('parseDateParam hibás értékre null', () => {
    const real = new Date(2026, 10, 11)
    expect(parseDateParam(null, real)).toBeNull()
    expect(parseDateParam('', real)).toBeNull()
    expect(parseDateParam('2026-12-1', real)).toBeNull()
    expect(parseDateParam('holnap', real)).toBeNull()
    expect(parseDateParam('2026-02-31', real)).toBeNull()
  })
})
