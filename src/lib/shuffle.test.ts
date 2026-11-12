import { describe, expect, test } from 'vitest'
import { days } from '../content/days'
import { shuffledIndices } from './shuffle'

describe('shuffledIndices', () => {
  test('ugyanarra a seedre mindig ugyanazt adja', () => {
    expect(shuffledIndices(4, 'd01-q1')).toEqual(shuffledIndices(4, 'd01-q1'))
  })

  test('az eredmény az indexek permutációja', () => {
    for (const length of [0, 1, 3, 4, 5]) {
      const order = shuffledIndices(length, `seed-${length}`)
      expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length }, (_, i) => i))
    }
  })

  test('különböző seedekre nem mindig ugyanaz a sorrend', () => {
    const orders = new Set(
      Array.from({ length: 20 }, (_, i) => shuffledIndices(4, `d${i}-q1`).join('')),
    )
    expect(orders.size).toBeGreaterThan(5)
  })

  test('a helyes válasz nem mindig ugyanarra a helyre kerül a teljes tartalomban', () => {
    const positions = days.flatMap((day) =>
      day.quiz.map((q) => shuffledIndices(q.options.length, q.id).indexOf(q.correctIndex)),
    )
    const counts = new Map<number, number>()
    for (const p of positions) counts.set(p, (counts.get(p) ?? 0) + 1)
    // Legalább három különböző helyen előfordul, és egyik hely sem viszi el a kérdések felét.
    expect(counts.size).toBeGreaterThanOrEqual(3)
    expect(Math.max(...counts.values())).toBeLessThan(positions.length / 2)
  })

  test('egy napon belül sem mindig ugyanott van a helyes válasz', () => {
    const sameSpotDays = days.filter((day) => {
      const spots = day.quiz.map((q) => shuffledIndices(q.options.length, q.id).indexOf(q.correctIndex))
      return new Set(spots).size === 1
    })
    // Véletlenül előfordulhat egy-egy ilyen nap, de nem lehet ez a jellemző.
    expect(sameSpotDays.length).toBeLessThan(days.length / 3)
  })
})
