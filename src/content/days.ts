/**
 * A 24 nap tartalma a 2. fázisban kerül ide (docs/SPEC.md, „Adatmodell”).
 *
 * Addig csak azt tudjuk, hány kérdés és rejtvény tartozik egy naphoz. Amint a tartalom
 * megvan, ez a függvény a tömbök hosszából számol, és a nap száma sehol máshol nem dönt.
 */
export interface StepCounts {
  quiz: number
  emoji: number
}

export function stepCounts(day: number): StepCounts {
  return day === 24 ? { quiz: 5, emoji: 2 } : { quiz: 3, emoji: 1 }
}
