export type Lang = 'hu' | 'en'

/** Minden megjelenő tartalmi szöveg mindkét nyelven. */
export type L = Record<Lang, string>

export const LANGS: readonly Lang[] = ['hu', 'en']

export function isLang(value: unknown): value is Lang {
  return value === 'hu' || value === 'en'
}

export type Category = 'erdekesseg' | 'film' | 'zene' | 'hagyomany' | 'etel'

export interface QuizQuestion {
  /** pl. 'd01-q1' – ebből jön a válaszok keverésének seedje is. */
  id: string
  category: Category
  question: L
  /** 3 vagy 4 elem. */
  options: L[]
  /** A helyes válasz indexe az options tömbben (a tartalomfájl szerinti sorrendben). */
  correctIndex: number
  /** Rövid érdekesség a válasz után. */
  explanation?: L
}

export interface EmojiPuzzle {
  /** pl. 'd24-e2' */
  id: string
  emojis: string
  kind: 'szo' | 'film' | 'dal'
  /** Elfogadott alakok nyelvenként, az első a kanonikus. */
  answers: Record<Lang, string[]>
  /** Pontosan 2 tipp, sorrendben oldhatók fel. */
  hints: [L, L]
}

export interface Quote {
  /** Közkincs vagy saját szöveg, saját fordítással. */
  text: L
  author?: L
  source?: L
}

export type OrnamentShape =
  | 'bauble'
  | 'candyCane'
  | 'bell'
  | 'bow'
  | 'star'
  | 'snowflake'
  | 'gingerbread'
  | 'boot'
  | 'gift'
  | 'candle'
  | 'szaloncukor'
  | 'pinecone'

export type OrnamentColor = 'red' | 'gold' | 'green' | 'blue' | 'pink' | 'silver' | 'white'

export interface Ornament {
  /** Egyedi azonosító, pl. 'd01-bauble-red'. */
  id: string
  shape: OrnamentShape
  /** A díszpaletta kulcsa; ha nincs, az alakzat alapszíne. */
  color?: OrnamentColor
  name: L
  /** A fa SVG egységeiben: x 0–100, y 0–120. */
  slot: { x: number; y: number }
}

export interface DayContent {
  /** 1–24 */
  day: number
  /** 1–23. nap: 3 elem, 24. nap: 5 elem. */
  quiz: QuizQuestion[]
  /** 1–23. nap: 1 elem, 24. nap: 2 elem. */
  emoji: EmojiPuzzle[]
  quote: Quote
  ornament: Ornament
  /**
   * Ideiglenes helykitöltő tartalom, amíg a nap nincs megírva.
   * Élesítés előtt egyetlen nap sem maradhat ilyen (a tartalomteszt számon tartja).
   */
  draft?: boolean
}
