import { days01to06 } from './days/days01-06'
import { days07to12 } from './days/days07-12'
import { days13to18 } from './days/days13-18'
import { days19to24 } from './days/days19-24'
import type { DayContent } from './types'

/**
 * A 24 nap kétnyelvű tartalma. A napok a `days/` mappa négy fájljában vannak megírva;
 * a szabályokat a docs/03-tartalom-utmutato.md rögzíti, a formai hibákat a tartalomteszt jelzi.
 */
export const days: readonly DayContent[] = [
  ...days01to06,
  ...days07to12,
  ...days13to18,
  ...days19to24,
]

export function getDay(day: number): DayContent {
  const content = days[day - 1]
  if (!content || content.day !== day) throw new Error(`Nincs ilyen nap: ${day}`)
  return content
}

export interface StepCounts {
  quiz: number
  emoji: number
}

/** A kérdések és rejtvények számát a tartalom tömbjeinek hossza adja, nem a nap száma. */
export function stepCounts(day: number): StepCounts {
  const content = getDay(day)
  return { quiz: content.quiz.length, emoji: content.emoji.length }
}
