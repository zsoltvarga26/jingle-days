import { ornaments } from './ornaments'
import type { Category, DayContent, EmojiPuzzle, L, QuizQuestion, Quote } from './types'

/**
 * Rövidítő segédek a napi tartalom megírásához. Az azonosítók (`d03-q1`, `d03-e1`) a nap
 * számából és a sorrendből jönnek, így nem lehet őket elírni.
 */

/** Kétnyelvű szöveg: [magyar, angol]. */
export type Pair = readonly [hu: string, en: string]

export const l = ([hu, en]: Pair): L => ({ hu, en })

type DraftQuestion = Omit<QuizQuestion, 'id'>
type DraftPuzzle = Omit<EmojiPuzzle, 'id'>

/**
 * Kvízkérdés. Az **első válasz a helyes**; a megjelenítés keveri a sorrendet.
 * @param explanation rövid érdekesség, ami a válasz után jelenik meg
 */
export function question(
  category: Category,
  text: Pair,
  options: readonly Pair[],
  explanation?: Pair,
): DraftQuestion {
  return {
    category,
    question: l(text),
    options: options.map(l),
    correctIndex: 0,
    ...(explanation ? { explanation: l(explanation) } : {}),
  }
}

/**
 * Emoji-rejtvény. Az elfogadott válaszok közül az első a kanonikus (ez jelenik meg megfejtés után).
 * A kis- és nagybetűt, az ékezetet, az írásjelet, a szóközt és a kezdő névelőt a normalize() kezeli.
 */
export function puzzle(
  emojis: string,
  kind: EmojiPuzzle['kind'],
  answers: { hu: string[]; en: string[] },
  hint1: Pair,
  hint2: Pair,
): DraftPuzzle {
  return { emojis, kind, answers, hints: [l(hint1), l(hint2)] }
}

/** Idézet; a szerző és a forrás elhagyható (saját szövegnél). */
export function quote(text: Pair, author?: Pair, source?: Pair): Quote {
  return {
    text: l(text),
    ...(author ? { author: l(author) } : {}),
    ...(source ? { source: l(source) } : {}),
  }
}

/** Egy nap: a kérdések és rejtvények azonosítót kapnak, a dísz a díszlistából jön. */
export function day(
  number: number,
  quiz: readonly DraftQuestion[],
  emoji: readonly DraftPuzzle[],
  dayQuote: Quote,
): DayContent {
  const dd = String(number).padStart(2, '0')
  return {
    day: number,
    quiz: quiz.map((q, index) => ({ id: `d${dd}-q${index + 1}`, ...q })),
    emoji: emoji.map((p, index) => ({ id: `d${dd}-e${index + 1}`, ...p })),
    quote: dayQuote,
    ornament: ornaments[number],
  }
}
